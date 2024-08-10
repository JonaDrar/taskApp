'use client';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { LogoutButton } from './LogoutButton';

export const Menu = () => {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [allowToggle, setAllowToggle] = useState(true); // Nuevo estado para controlar el toggle

  const handleMenuToggle = () => {
    if (!allowToggle) return; // Si no se permite el toggle, no hace nada
    setIsMenuModalOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuModalOpen(false);
    setAllowToggle(false); // Desactiva el toggle temporalmente
    setTimeout(() => {
      setAllowToggle(true); // Reactiva el toggle después de un breve retardo
    }, 300); // Ajusta el retardo según sea necesario
  };

  return (
    <>
      <MenuButton isMenuModalOpen={isMenuModalOpen} onClick={handleMenuToggle} />
      {isMenuModalOpen && <MenuModal closeMenu={closeMenu} />}
    </>
  );
};

const MenuModal = ({ closeMenu }: { closeMenu: () => void }) => {
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeMenu]);

  return (
    <section
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm"
    >
      <LogoutButton />
    </section>
  );
};

const MenuButton = ({ isMenuModalOpen, onClick }: { isMenuModalOpen: boolean; onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
      className={`z-50 rounded-full bg-black text-white fixed bottom-8 left-2 h-24 w-24 flex justify-center items-center animate transition-all lg:left-48 xl:left-96`}
    >
      <div className="grid justify-items-center gap-2">
        <span className={`h-1.5 w-12 animate ease-in-out transition-all bg-white ${isMenuModalOpen ? 'rotate-45 translate-y-3.5' : ''}`}></span>
        <span className={`h-1.5 w-12 animate transition-all bg-white ${isMenuModalOpen ? 'opacity-0' : 'opacity-100'}`}></span>
        <span className={`h-1.5 w-12 animate transition-all bg-white ${isMenuModalOpen ? '-rotate-45 -translate-y-3.5' : ''}`}></span>
      </div>
    </Button>
  );
};