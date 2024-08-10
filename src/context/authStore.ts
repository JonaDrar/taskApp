import { create } from 'zustand';
import { auth } from '@/lib/firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  getIdToken,
  onAuthStateChanged,
} from 'firebase/auth';
import Cookies from 'js-cookie';

interface AuthStore {
  user: any | null;
  loading: boolean;
  setUser: (user: any) => void;
  clearUser: () => void;
  initializeAuth: () => void;
  login: () => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  clearUser: () => {
    Cookies.remove('token');
    set({ user: null, loading: false });
  },
  initializeAuth: () => {
    set({ loading: true });
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        Cookies.set('token', token, { expires: 1 });
        set({ user, loading: false });
      } else {
        Cookies.remove('token');
        set({ user: null, loading: false });
      }
    });
  },
  login: async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const token = await getIdToken(result.user); // Obtener el token JWT del usuario

      // Guardar el token en las cookies
      Cookies.set('token', token, { expires: 1 }); // Expira en 1 día

      set({ user: result.user });
    } catch (error) {
      console.error('Error during login:', error);
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
      Cookies.remove('token');
      set({ user: null });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },
}));

export default useAuthStore;
