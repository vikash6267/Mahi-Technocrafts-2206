import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  getProposals,
  getProposalById,
  saveProposal,
  deleteProposal,
  ClientProposal
} from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/portal';
import { createAuditLog } from '@/lib/audit-logger';
import { generateProposalNumber } from '@/lib/proposal-templates';

export async function GET(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = (searchParams.get('search') || '').toLowerCase().trim();

    let proposals = await getProposals();

    if (category && category !== 'all') {
      proposals = proposals.filter((p) => p.category === category);
    }

    if (status && status !== 'all') {
      proposals = proposals.filter((p) => p.status === status);
    }

    if (search) {
      proposals = proposals.filter(
        (p) =>
          p.proposalNumber.toLowerCase().includes(search) ||
          p.title.toLowerCase().includes(search) ||
          p.clientName.toLowerCase().includes(search) ||
          (p.clientCompany && p.clientCompany.toLowerCase().includes(search)) ||
          (p.clientEmail && p.clientEmail.toLowerCase().includes(search))
      );
    }

    // Compute basic pipeline stats
    const totalCount = proposals.length;
    const totalPipelineValue = proposals.reduce((acc, p) => acc + (p.grandTotal || 0), 0);
    const acceptedCount = proposals.filter((p) => p.status === 'accepted').length;
    const sentCount = proposals.filter((p) => p.status === 'sent').length;
    const draftCount = proposals.filter((p) => p.status === 'draft').length;

    return NextResponse.json({
      success: true,
      proposals,
      stats: {
        totalCount,
        totalPipelineValue,
        acceptedCount,
        sentCount,
        draftCount
      }
    });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const title = String(body.title || '').trim();
    const clientName = String(body.clientName || '').trim();

    if (!title || !clientName) {
      return NextResponse.json(
        { error: 'Project Title and Client Name are required.' },
        { status: 400 }
      );
    }

    const id = body.id || `prop_${randomUUID().replace(/-/g, '').slice(0, 12)}`;
    const now = new Date().toISOString();

    // Auto-calculate financials
    const items = Array.isArray(body.items)
      ? body.items.map((it: any, index: number) => {
          const qty = Number(it.qty) > 0 ? Number(it.qty) : 1;
          const rate = Number(it.rate) >= 0 ? Number(it.rate) : 0;
          return {
            id: it.id || `item_${index + 1}`,
            name: String(it.name || 'Service Item').trim(),
            description: String(it.description || '').trim(),
            qty,
            rate,
            amount: qty * rate
          };
        })
      : [];

    const subtotal = items.reduce((acc: number, item: any) => acc + item.amount, 0);
    const discount = Math.max(0, Number(body.discount) || 0);
    const taxableAmount = Math.max(0, subtotal - discount);
    const taxRate = Number(body.taxRate) >= 0 ? Number(body.taxRate) : 18;
    const taxAmount = Math.round((taxableAmount * taxRate) / 100);
    const grandTotal = taxableAmount + taxAmount;

    const proposalDoc: ClientProposal = {
      id,
      proposalNumber: body.proposalNumber || generateProposalNumber(),
      title,
      category: body.category || 'web_development',
      status: body.status || 'draft',

      clientName,
      clientCompany: body.clientCompany ? String(body.clientCompany).trim() : undefined,
      clientEmail: body.clientEmail ? String(body.clientEmail).trim() : undefined,
      clientPhone: body.clientPhone ? String(body.clientPhone).trim() : undefined,
      clientAddress: body.clientAddress ? String(body.clientAddress).trim() : undefined,

      companyName: body.companyName || 'Mahi TechnoCrafts',
      companyTagline: body.companyTagline || 'Engineering Digital Excellence & Scalable Software',
      companyAddress:
        body.companyAddress ||
        'Hamidia Rd, Badabagh, Shahjahanabad, Bhopal, Madhya Pradesh, India - 462001',
      companyEmail: body.companyEmail || 'contact@mahitechnocrafts.in',
      companyPhone: body.companyPhone || '+91 62671 44122',
      companyWebsite: body.companyWebsite || 'https://mahitechnocrafts.in',
      companyGst: body.companyGst ? String(body.companyGst).trim() : undefined,

      proposalDate: body.proposalDate || now.slice(0, 10),
      validUntil: body.validUntil || new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),

      overview: body.overview || '',
      scopeOfWork: Array.isArray(body.scopeOfWork) ? body.scopeOfWork.map(String) : [],
      techStack: body.techStack || {},

      currency: body.currency === 'USD' ? 'USD' : 'INR',
      items,
      subtotal,
      discount,
      taxRate,
      taxAmount,
      grandTotal,

      projectDuration: body.projectDuration || '4 to 6 Weeks',
      milestones: Array.isArray(body.milestones) ? body.milestones : [],

      terms: body.terms || {
        paymentTerms: [
          '30% Advance deposit upon contract signing to initiate project.',
          '40% Milestone payment upon core development demonstration.',
          '30% Final balance payment before production deployment.'
        ],
        warrantySupport: '90 Days complimentary post-launch technical warranty and bug fixes.',
        validityDays: 15,
        clientObligations: ['Provide brand assets, images, and content in a timely manner.']
      },

      signatoryName: body.signatoryName || 'Vikash Maheshwari',
      signatoryDesignation: body.signatoryDesignation || 'Founder & Technical Director',
      clientSignatoryName: body.clientSignatoryName || clientName,

      notes: body.notes || '',
      createdAt: body.createdAt || now,
      updatedAt: now
    };

    const success = await saveProposal(proposalDoc);

    if (success) {
      createAuditLog({
        action: body.id ? 'PROPOSAL_UPDATED' : 'PROPOSAL_CREATED',
        category: 'SYSTEM',
        actor: { username: 'admin', name: 'Admin', role: 'admin' },
        status: 'SUCCESS',
        details: `${body.id ? 'Updated' : 'Created'} Proposal ${proposalDoc.proposalNumber} for ${proposalDoc.clientName} (₹${proposalDoc.grandTotal.toLocaleString('en-IN')})`,
        metadata: { id: proposalDoc.id, proposalNumber: proposalDoc.proposalNumber, grandTotal }
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        proposal: proposalDoc
      });
    } else {
      return NextResponse.json({ error: 'Failed to save proposal' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving proposal:', error);
    return NextResponse.json({ error: 'Internal server error saving proposal' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const existing = await getProposalById(id);
    const success = await deleteProposal(id);

    if (success) {
      createAuditLog({
        action: 'PROPOSAL_DELETED',
        category: 'SYSTEM',
        actor: { username: 'admin', name: 'Admin', role: 'admin' },
        status: 'SUCCESS',
        details: `Deleted Proposal ${existing?.proposalNumber || id} (${existing?.clientName || 'Client'})`,
        metadata: { id, proposalNumber: existing?.proposalNumber }
      }).catch(() => {});

      return NextResponse.json({ success: true, message: 'Proposal deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to delete proposal' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json({ error: 'Internal server error deleting proposal' }, { status: 500 });
  }
}
