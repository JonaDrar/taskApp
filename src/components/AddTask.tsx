'use client';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import useAuthStore from '@/context/authStore';

export const AddTask = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [allowToggle, setAllowToggle] = useState(true); // Estado para controlar el toggle

  const handleAddTaskToggle = () => {
    if (!allowToggle) return; // Si no se permite el toggle, no hace nada
    setIsAddModalOpen((prev) => !prev);
  };

  const closeAddTask = () => {
    setIsAddModalOpen(false);
    setAllowToggle(false); // Desactiva el toggle temporalmente
    setTimeout(() => {
      setAllowToggle(true); // Reactiva el toggle después de un breve retardo
    }, 300); // Ajusta el retardo según sea necesario
  };

  return (
    <>
      <AddTaskButton isAddModalOpen={isAddModalOpen} onClick={handleAddTaskToggle} />
      {isAddModalOpen && <AddTaskModal closeAddTask={closeAddTask} />}
    </>
  );
};

const AddTaskModal = ({ closeAddTask }: { closeAddTask: () => void }) => {
  const initialFormState = {
    title: '',
    description: '',
    expirationDate: '',
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isShowed, setIsShowed] = useState(false);
  const [task, setTask] = useState(initialFormState);
  const userId = useAuthStore((state) => state.user?.uid);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }
    if (!task.title || !task.title.trim()) {
      console.error('Task title is required');
      return;
    }

    try {
      console.log('Adding task:', task);

      const expirationDate = task.expirationDate ? new Date(`${task.expirationDate}T12:00:00`) : null;

      await addDoc(collection(db, `users/${userId}/tasks`), {
        ...task,
        expirationDate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'todo',
      });
      console.log('Task added successfully:', task);
    } catch (error) {
      console.error('Error adding task:', error);
    }

    setTask(initialFormState);
    closeAddTask();
  };

  useEffect(() => {
    setIsShowed(true);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAddTask();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        closeAddTask();
      }
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeAddTask]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`bg-black rounded-lg p-8 border-white border-2 overflow-hidden animate transition-all duration-300 opacity-0 ${isShowed ? 'w-96 h-auto opacity-100' : ''}`}
      >
        <h2 className="text-white text-2xl font-bold">Add a new task</h2>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              className="col-span-3 text-white bg-black"
              autoFocus
              onChange={handleChange}
              name="title"
              value={task.title}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              className="col-span-3 text-white bg-black"
              onChange={handleChange}
              name="description"
              value={task.description}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expirationDate" className="text-right">
              Expiration Date
            </Label>
            <Input
              id="expirationDate"
              type="date"
              className="col-span-3 text-white bg-black"
              onChange={handleChange}
              name="expirationDate"
              value={task.expirationDate}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            disabled={!task.title || isLoading}
            type="submit"
            className="bg-white text-black"
          >
            Add Task
          </Button>
        </div>
      </form>
    </div>
  );
};

const AddTaskButton = ({ isAddModalOpen, onClick }: { isAddModalOpen: boolean; onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
      className={`z-50 rounded-full bg-black text-white fixed bottom-8 right-2 h-24 w-24 flex justify-center items-center animate transition-all lg:right-48 xl:right-96 
      ${isAddModalOpen ? 'rotate-45' : ''}`}
    >
      <span className="text-8xl -translate-y-2 font-light">+</span>
    </Button>
  );
};