import { NextResponse } from 'next/server';
import { getProposalById, updateProposalStatus, saveProposal } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/portal';
import { createAuditLog } from '@/lib/audit-logger';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const proposal = await getProposalById(id);

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, proposal });
  } catch (error) {
    console.error('Error fetching proposal by ID:', error);
    return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await getProposalById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Quick status toggle
    if (body.status && ['draft', 'sent', 'accepted', 'declined'].includes(body.status)) {
      const ok = await updateProposalStatus(id, body.status);
      if (ok) {
        createAuditLog({
          action: 'PROPOSAL_STATUS_CHANGED',
          category: 'SYSTEM',
          actor: { username: 'admin', name: 'Admin', role: 'admin' },
          status: 'SUCCESS',
          details: `Changed Proposal ${existing.proposalNumber} status to "${body.status}"`,
          metadata: { id, oldStatus: existing.status, newStatus: body.status }
        }).catch(() => {});

        return NextResponse.json({ success: true, status: body.status });
      }
    }

    // Partial merge update
    const updated = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString()
    };

    const saved = await saveProposal(updated);
    if (saved) {
      return NextResponse.json({ success: true, proposal: updated });
    }

    return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
  }
}
