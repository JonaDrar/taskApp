'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { LogoutButton } from './LogoutButton';

export const Menu = () => {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  return (
    <>
      <MenuButton isMenuModalOpen={isMenuModalOpen} setIsMenuModalOpen={setIsMenuModalOpen} />
      {isMenuModalOpen && <MenuModal setIsMenuModalOpen={setIsMenuModalOpen} />}
    </>
  );
};

const MenuModal = ({ setIsMenuModalOpen }: { setIsMenuModalOpen: (value: boolean) => void }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }
  , [setIsMenuModalOpen]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
           <LogoutButton />
    </div>
  );
};

const MenuButton = ({ isMenuModalOpen, setIsMenuModalOpen }: { isMenuModalOpen: boolean; setIsMenuModalOpen: (value: boolean) => void }) => {
  return (
    <Button
      onClick={() => setIsMenuModalOpen(!isMenuModalOpen)}
      className={`z-50 rounded-full bg-black text-white fixed bottom-8 left-2 h-24 w-24 flex justify-center items-center animate transition-all lg:left-48 xl:left-96 
        ${''}`}
    >
      <div className="grid justify-items-center gap-2">
        <span className={`h-1.5 w-12 animate ease-in-out transition-all bg-white ${isMenuModalOpen ? 'rotate-45 translate-y-3.5' : ''}`}></span>
        <span className={`h-1.5 w-12 animate transition-all bg-white ${isMenuModalOpen ? 'w-0' : ''}`}></span>
        <span className={`h-1.5 w-12 animate transition-all bg-white ${isMenuModalOpen ? '-rotate-45 -translate-y-3.5' : ''}`}></span>
      </div>
    </Button>
  );
};
