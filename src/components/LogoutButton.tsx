'use client';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/context/authStore';

export const LogoutButton = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white px-4 py-2 rounded text-4xl font-bold"
    >
      LogOut
    </button>
  );
};
