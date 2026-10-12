import { redirect } from 'next/navigation';

export default function PortalAccountsRoute() {
  redirect('/admin/dashboard?section=portal');
}
