export const instant = false;

import { getCurrentUser } from '@/lib/auth/session';
import { getMyOrders } from '@/actions/customer';
import ProfileTabs from './ProfileTabs';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const orders = await getMyOrders();

  // 🔥 Client Component-এর জন্য প্লেইন ডেটা কনভার্ট করা
  const safeUser = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    role: user.role,
    createdAt: user.createdAt ? user.createdAt.toISOString() : null,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileTabs user={safeUser} orders={orders} />
    </div>
  );
}
