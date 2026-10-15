import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  getFinanceRecords,
  getFinanceRecordById,
  saveFinanceRecord,
  deleteFinanceRecord,
  getFinanceStats,
  FinanceRecord,
  FinanceType
} from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/portal';

export async function GET(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const category = searchParams.get('category') || undefined;
    const month = searchParams.get('month') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const [records, stats] = await Promise.all([
      getFinanceRecords({ type, category, month, status, search }),
      getFinanceStats(),
    ]);

    return NextResponse.json({
      success: true,
      records,
      stats,
    });
  } catch (error) {
    console.error('Error fetching finance records:', error);
    return NextResponse.json({ error: 'Failed to fetch finance records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const type = (body.type || 'income') as FinanceType;
    const title = String(body.title || '').trim();
    const amount = Number(body.amount) || 0;
    const category = String(body.category || 'other_income').trim();
    const date = String(body.date || new Date().toISOString().slice(0, 10)).trim();

    if (!title || !amount || amount <= 0 || !date) {
      return NextResponse.json(
        { error: 'Title, positive Amount, and Date are required.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const record: FinanceRecord = {
      id: body.id || randomUUID(),
      type: type === 'expense' ? 'expense' : 'income',
      title,
      description: String(body.description || '').trim() || undefined,
      amount,
      category,
      date,
      status: body.status === 'pending' ? 'pending' : 'completed',
      paymentMethod: String(body.paymentMethod || 'upi').trim(),
      clientName: String(body.clientName || '').trim() || undefined,
      vendorName: String(body.vendorName || '').trim() || undefined,
      referenceNumber: String(body.referenceNumber || '').trim() || undefined,
      invoiceUrl: String(body.invoiceUrl || '').trim() || undefined,
      reminderId: String(body.reminderId || '').trim() || undefined,
      tags: Array.isArray(body.tags) ? body.tags : undefined,
      createdAt: now,
      updatedAt: now,
    };

    const saved = await saveFinanceRecord(record);
    if (!saved) {
      return NextResponse.json({ error: 'Failed to save financial transaction' }, { status: 500 });
    }

    const updatedStats = await getFinanceStats();

    return NextResponse.json({
      success: true,
      record,
      stats: updatedStats,
      message: `${type === 'income' ? 'Income' : 'Expense'} recorded successfully`,
    });
  } catch (error) {
    console.error('Error creating finance record:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = String(body.id || '').trim();

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const existing = await getFinanceRecordById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Toggle status or edit fields
    const updated: FinanceRecord = {
      ...existing,
      type: body.type !== undefined ? body.type : existing.type,
      title: body.title !== undefined ? String(body.title).trim() : existing.title,
      description: body.description !== undefined ? String(body.description).trim() : existing.description,
      amount: body.amount !== undefined ? (Number(body.amount) || 0) : existing.amount,
      category: body.category !== undefined ? String(body.category).trim() : existing.category,
      date: body.date !== undefined ? String(body.date).trim() : existing.date,
      status: body.status !== undefined ? (body.status === 'pending' ? 'pending' : 'completed') : existing.status,
      paymentMethod: body.paymentMethod !== undefined ? String(body.paymentMethod).trim() : existing.paymentMethod,
      clientName: body.clientName !== undefined ? String(body.clientName).trim() : existing.clientName,
      vendorName: body.vendorName !== undefined ? String(body.vendorName).trim() : existing.vendorName,
      referenceNumber: body.referenceNumber !== undefined ? String(body.referenceNumber).trim() : existing.referenceNumber,
      invoiceUrl: body.invoiceUrl !== undefined ? String(body.invoiceUrl).trim() : existing.invoiceUrl,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveFinanceRecord(updated);
    if (!saved) {
      return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
    }

    const updatedStats = await getFinanceStats();

    return NextResponse.json({
      success: true,
      record: updated,
      stats: updatedStats,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    console.error('Error updating finance record:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body?.id;
    }

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const deleted = await deleteFinanceRecord(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Transaction not found or could not be deleted' }, { status: 404 });
    }

    const updatedStats = await getFinanceStats();

    return NextResponse.json({
      success: true,
      stats: updatedStats,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting finance record:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
