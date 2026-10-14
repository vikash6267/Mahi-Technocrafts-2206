import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getPortalDb, getPortalUser, hashPassword, isAdminAuthenticated, type PortalIssue, type PortalUser } from '@/lib/portal';

const isAdmin = isAdminAuthenticated;

export async function GET() {
  try {
    const admin = await isAdmin();
    const sessionUser = admin ? null : await getPortalUser();
    if (!admin && sessionUser?.role !== 'staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getPortalDb();
    if (!admin) {
      const users = await db.collection<PortalUser>('portal_users')
        .find({ role: { $regex: /^staff$/i }, active: { $ne: false } }, { projection: { id: 1, name: 1, role: 1, active: 1 } })
        .toArray();
      return NextResponse.json({ users: users.map(({ _id, ...u }) => u), issues: [] });
    }

    const [users, issues] = await Promise.all([
      db.collection<PortalUser>('portal_users').find({}).sort({ createdAt: -1 }).toArray(),
      db.collection<PortalIssue>('portal_issues').find({}).sort({ updatedAt: -1 }).toArray()
    ]);

    return NextResponse.json({
      users: users.map(({ _id, passwordHash, ...u }) => u),
      issues: issues.map(({ _id, ...i }) => i)
    });
  } catch {
    return NextResponse.json({ error: 'Portal database is unavailable. Check the MongoDB connection and try again.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const role = body.role;

    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || !['client', 'staff'].includes(role)) {
      return NextResponse.json({ error: 'Name, valid email, role, and a password of at least 8 characters are required.' }, { status: 400 });
    }

    const db = await getPortalDb();
    const users = db.collection<PortalUser>('portal_users');
    if (await users.findOne({ email })) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const user: PortalUser = {
      id: randomUUID(),
      name,
      email,
      role,
      company: String(body.company || '').trim().slice(0, 120),
      active: true,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(password)
    };

    await users.insertOne(user);
    const { passwordHash, ...safe } = user;
    return NextResponse.json(safe, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Portal database is unavailable. Check the MongoDB connection and try again.' }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const db = await getPortalDb();

    // Check if this is an issue update
    if (body.issueId || body.type === 'issue') {
      const issueId = String(body.issueId || body.id || '');
      const col = db.collection<PortalIssue>('portal_issues');
      const issue = await col.findOne({ id: issueId });
      if (!issue) return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });

      const now = new Date().toISOString();
      const setUpdate: Record<string, string> = { updatedAt: now };

      if (body.status && ['open', 'in-progress', 'waiting-client', 'resolved'].includes(body.status)) {
        setUpdate.status = body.status;
      }

      if (typeof body.assignedTo === 'string') {
        if (body.assignedTo) {
          const staffMember = await db.collection<PortalUser>('portal_users').findOne({
            id: body.assignedTo,
            role: { $regex: /^staff$/i }
          });
          if (staffMember) {
            setUpdate.assignedTo = staffMember.id;
            setUpdate.assignedName = staffMember.name;
          } else if (typeof body.assignedName === 'string') {
            setUpdate.assignedTo = body.assignedTo;
            setUpdate.assignedName = body.assignedName;
          }
        } else {
          setUpdate.assignedTo = '';
          setUpdate.assignedName = '';
        }
      }

      if (typeof body.message === 'string' && body.message.trim()) {
        const updateEntry = {
          id: randomUUID(),
          authorId: 'admin',
          authorName: 'Admin / Management',
          message: body.message.trim().slice(0, 3000),
          createdAt: now
        };
        const updates = [...(issue.updates || []), updateEntry];
        await col.updateOne({ id: issueId }, { $set: { ...setUpdate, updates } });
      } else {
        await col.updateOne({ id: issueId }, { $set: setUpdate });
      }

      const updated = await col.findOne({ id: issueId });
      if (updated) {
        const { _id, ...safe } = updated;
        return NextResponse.json({ success: true, issue: safe });
      }
      return NextResponse.json({ success: true });
    }

    // Otherwise handle user update (active toggle)
    const { id, active } = body;
    if (typeof id !== 'string' || typeof active !== 'boolean') {
      return NextResponse.json({ error: 'Invalid account update.' }, { status: 400 });
    }

    const result = await db.collection<PortalUser>('portal_users').updateOne({ id }, { $set: { active } });
    return result.matchedCount ? NextResponse.json({ success: true }) : NextResponse.json({ error: 'Account not found.' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Unable to update.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(request.url);
    let issueId = url.searchParams.get('issueId');
    let userId = url.searchParams.get('userId');

    if (!issueId && !userId) {
      try {
        const body = await request.json();
        issueId = body?.issueId;
        userId = body?.userId;
      } catch {
        // empty body ok
      }
    }

    const db = await getPortalDb();

    if (issueId && typeof issueId === 'string') {
      const res = await db.collection<PortalIssue>('portal_issues').deleteOne({ id: issueId });
      if (res.deletedCount === 0) return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
      return NextResponse.json({ success: true, message: 'Issue deleted successfully.' });
    }

    if (userId && typeof userId === 'string') {
      const res = await db.collection<PortalUser>('portal_users').deleteOne({ id: userId });
      if (res.deletedCount === 0) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      return NextResponse.json({ success: true, message: 'User account deleted successfully.' });
    }

    return NextResponse.json({ error: 'Specify issueId or userId to delete.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Unable to delete record.' }, { status: 500 });
  }
}
