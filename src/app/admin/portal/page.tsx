'use client';

import React from 'react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { PortalAccountsManager } from '@/components/admin/PortalAccountsManager';

export default function AdminPortalPage() {
  return (
    <AdminLayoutShell
      title="Client Portal & Support Tickets"
      subtitle="Manage client accounts, staff access, and ticket issue resolution"
    >
      <div className="bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <PortalAccountsManager embedded={false} />
      </div>
    </AdminLayoutShell>
  );
}
