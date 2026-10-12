import { NextResponse } from 'next/server';
import { getPortalUser } from '@/lib/portal';
export async function GET() { const user = await getPortalUser(); return user ? NextResponse.json({ authenticated: true, user }) : NextResponse.json({ authenticated: false }, { status: 401 }); }
