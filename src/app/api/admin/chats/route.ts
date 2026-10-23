import { NextResponse } from 'next/server';
import { getAllChatSessions, deleteChatSession } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(request: Request) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '150', 10);

    const sessions = await getAllChatSessions(limit);
    return NextResponse.json({ success: true, sessions });
  } catch (error: any) {
    console.error('Error in /api/admin/chats GET:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const success = await deleteChatSession(sessionId);
    if (!success) {
      return NextResponse.json({ error: 'Session not found or failed to delete' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Chat session deleted successfully' });
  } catch (error: any) {
    console.error('Error in /api/admin/chats DELETE:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
