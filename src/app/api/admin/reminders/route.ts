import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  getReminders,
  getReminderById,
  saveReminder,
  deleteReminder,
  markReminderStatus,
  getReminderStats,
  ClientReminder,
  ReminderCategory
} from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/portal';
import { sendClientReminderEmail } from '@/lib/email';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [reminders, stats] = await Promise.all([
      getReminders(),
      getReminderStats()
    ]);

    return NextResponse.json({
      success: true,
      reminders,
      stats
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

function normalizeDateString(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  const trimmed = dateStr.trim();
  const dmy = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  }
  return trimmed;
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized: Admin session expired or invalid. Please re-login.' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const clientName = String(body.clientName || '').trim();
    const clientEmail = String(body.clientEmail || '').trim();
    const title = String(body.title || '').trim();
    const description = String(body.description || '').trim();
    const dueDateRaw = String(body.dueDate || '').trim();
    const category = (body.category || 'general') as ReminderCategory;

    if (!clientName || !title || !dueDateRaw) {
      return NextResponse.json(
        { error: 'Client Name, Reminder Title, and Due Date are required.' },
        { status: 400 }
      );
    }

    const dueDate = normalizeDateString(dueDateRaw);
    const now = new Date().toISOString();
    const reminder: ClientReminder = {
      id: randomUUID(),
      clientName,
      clientEmail,
      clientPhone: String(body.clientPhone || '').trim(),
      company: String(body.company || '').trim(),
      title,
      description,
      category,
      dueDate, // YYYY-MM-DD
      dueTime: body.dueTime || undefined,
      amount: String(body.amount || '').trim() || undefined,
      priority: ['low', 'normal', 'high', 'urgent'].includes(body.priority)
        ? body.priority
        : 'normal',
      status: 'pending',
      notifyClientEmail: false, // Per user requirement: Client receives NO reminder emails
      notifyAdminEmail: Boolean(body.notifyAdminEmail ?? true),
      notes: String(body.notes || '').trim() || undefined,
      createdAt: now,
      updatedAt: now
    };

    const saved = await saveReminder(reminder);
    if (!saved) {
      return NextResponse.json({ error: 'Database save failed. Please check MongoDB connection.' }, { status: 500 });
    }

    // If immediate notification was requested, send ONLY to Admin
    if (body.sendImmediateEmail && reminder.notifyAdminEmail) {
      await sendClientReminderEmail({
        reminder,
        recipientType: 'admin',
        customNote: body.customNote
      });
      reminder.status = 'notified';
      reminder.lastNotifiedAt = now;
      await saveReminder(reminder);
    }

    return NextResponse.json({ success: true, reminder }, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Failed to create reminder: ' + (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = String(body.id || '');

    if (!id) {
      return NextResponse.json({ error: 'Reminder ID is required' }, { status: 400 });
    }

    const existing = await getReminderById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    // Action: Trigger manual email notification (Admin only)
    if (body.action === 'send_email') {
      const adminSent = await sendClientReminderEmail({
        reminder: existing,
        recipientType: 'admin',
        customNote: body.customNote
      });

      if (adminSent) {
        existing.status = 'notified';
        existing.lastNotifiedAt = new Date().toISOString();
        existing.updatedAt = new Date().toISOString();
        await saveReminder(existing);
        return NextResponse.json({
          success: true,
          message: 'Reminder alert email sent to Admin successfully!',
          reminder: existing
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to send email to Admin. Check SMTP mail settings in .env.' },
          { status: 500 }
        );
      }
    }

    // Action: Quick Status Toggle
    if (body.action === 'toggle_status' || body.status) {
      const nextStatus: ClientReminder['status'] =
        body.status || (existing.status === 'completed' ? 'pending' : 'completed');
      await markReminderStatus(id, nextStatus, body.notes);
      const updated = await getReminderById(id);
      return NextResponse.json({ success: true, reminder: updated });
    }

    // Action: Full Edit Update
    const updated: ClientReminder = {
      ...existing,
      clientName: body.clientName !== undefined ? String(body.clientName).trim() : existing.clientName,
      clientEmail: body.clientEmail !== undefined ? String(body.clientEmail).trim() : existing.clientEmail,
      clientPhone: body.clientPhone !== undefined ? String(body.clientPhone).trim() : existing.clientPhone,
      company: body.company !== undefined ? String(body.company).trim() : existing.company,
      title: body.title !== undefined ? String(body.title).trim() : existing.title,
      description: body.description !== undefined ? String(body.description).trim() : existing.description,
      category: body.category || existing.category,
      dueDate: body.dueDate || existing.dueDate,
      dueTime: body.dueTime !== undefined ? body.dueTime : existing.dueTime,
      amount: body.amount !== undefined ? String(body.amount).trim() : existing.amount,
      priority: body.priority || existing.priority,
      status: body.status || existing.status,
      notifyClientEmail: body.notifyClientEmail !== undefined ? Boolean(body.notifyClientEmail) : existing.notifyClientEmail,
      notifyAdminEmail: body.notifyAdminEmail !== undefined ? Boolean(body.notifyAdminEmail) : existing.notifyAdminEmail,
      notes: body.notes !== undefined ? String(body.notes).trim() : existing.notes,
      updatedAt: new Date().toISOString()
    };

    await saveReminder(updated);
    return NextResponse.json({ success: true, reminder: updated });
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    let id = url.searchParams.get('id');
    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // empty body ok
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Reminder ID is required' }, { status: 400 });
    }

    const success = await deleteReminder(id);
    if (!success) {
      return NextResponse.json({ error: 'Reminder not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 });
  }
}
