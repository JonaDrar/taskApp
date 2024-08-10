'use client'
import { GoogleIcon } from '@/assets/icons/GoogleIcon';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/context/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // Si el usuario ya está autenticado, redirigir a la página principal
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogin = async () => {
    await login();
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-12">
      <div>
        <h2 className="text-center text-xl">To use the App</h2>
        <p className="text-center text-3xl">Log in with your Google account</p>
      </div>
      <Button className="flex items-center gap-4 bg-white" onClick={handleLogin}>
        <GoogleIcon className="w-6 h-6 text-white" />
        <span className="text-black">Continue with Google</span>
      </Button>
    </main>
  );
};

export default Login;