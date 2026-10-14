import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getPortalDb, getPortalUser, type PortalIssue, type PortalUser } from '@/lib/portal';

export async function GET() {
  const user = await getPortalUser(); if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = await getPortalDb(); const query = user.role === 'client' ? { clientId: user.id } : {};
  const issues = await db.collection<PortalIssue>('portal_issues').find(query).sort({ updatedAt: -1 }).toArray();
  return NextResponse.json(issues.map(({ _id, ...issue }) => issue));
}

export async function POST(request: Request) {
  const user = await getPortalUser(); if (!user || user.role !== 'client') return NextResponse.json({ error: 'Client login required.' }, { status: 401 });
  try {
    const body = await request.json(); const title = String(body.title || '').trim(); const description = String(body.description || '').trim();
    if (title.length < 4 || title.length > 140 || description.length < 10 || description.length > 5000) return NextResponse.json({ error: 'Add a title (4–140 characters) and details (10–5000 characters).' }, { status: 400 });
    const now = new Date().toISOString(); const issue: PortalIssue = { id: randomUUID(), clientId: user.id, clientName: user.name, clientEmail: user.email, title, description, category: String(body.category || 'General').slice(0, 60), priority: ['low','normal','high','urgent'].includes(body.priority) ? body.priority : 'normal', status: 'open', createdAt: now, updatedAt: now, updates: [] };
    const db = await getPortalDb(); await db.collection<PortalIssue>('portal_issues').insertOne(issue);
    return NextResponse.json(issue, { status: 201 });
  } catch { return NextResponse.json({ error: 'Unable to save your issue. Please try again.' }, { status: 503 }); }
}

export async function PATCH(request: Request) {
  const user = await getPortalUser(); if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json(); const db = await getPortalDb(); const col = db.collection<PortalIssue>('portal_issues');
    const issue = await col.findOne({ id: body.id }); if (!issue || (user.role === 'client' && issue.clientId !== user.id)) return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    const now = new Date().toISOString(); const set: Record<string, string> = { updatedAt: now };
    if (typeof body.message === 'string' && body.message.trim()) {
      const updates = [...(issue.updates || []), { id: randomUUID(), authorId: user.id, authorName: user.name, message: body.message.trim().slice(0, 2000), createdAt: now }];
      await col.updateOne({ id: issue.id }, { $set: { updates, updatedAt: now } });
    }
    if (user.role === 'staff') {
      const allowed = ['open','in-progress','waiting-client','resolved']; if (allowed.includes(body.status)) set.status = body.status;
      if (typeof body.assignedTo === 'string') {
        if (body.assignedTo) {
          const member = await db.collection<PortalUser>('portal_users').findOne({
            id: body.assignedTo,
            role: { $regex: /^staff$/i },
            active: { $ne: false }
          });
          if (member) {
            set.assignedTo = member.id;
            set.assignedName = member.name;
          } else if (typeof body.assignedName === 'string' && body.assignedName) {
            set.assignedTo = body.assignedTo;
            set.assignedName = body.assignedName;
          }
        } else {
          set.assignedTo = '';
          set.assignedName = '';
        }
      }
      if (Object.keys(set).length > 1) await col.updateOne({ id: issue.id }, { $set: set });
    }
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Unable to update issue.' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  const user = await getPortalUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(request.url);
    let id = url.searchParams.get('id');
    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // empty body ok if passed as searchParam
      }
    }

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Issue ID is required.' }, { status: 400 });
    }

    const db = await getPortalDb();
    const col = db.collection<PortalIssue>('portal_issues');
    const issue = await col.findOne({ id });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    // Clients can only delete their own issues, staff can delete any issue
    if (user.role === 'client' && issue.clientId !== user.id) {
      return NextResponse.json({ error: 'You are not authorized to delete this issue.' }, { status: 403 });
    }

    await col.deleteOne({ id });
    return NextResponse.json({ success: true, message: 'Issue deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Unable to delete issue.' }, { status: 500 });
  }
}
