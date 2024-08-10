'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export const AddTask = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  return (
    <>
      <AddTaskButton isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} />
      {isAddModalOpen && <AddTaskModal setIsAddModalOpen={setIsAddModalOpen} />}
    </>
  );
};

const AddTaskModal = ({ setIsAddModalOpen }: { setIsAddModalOpen: (value: boolean) => void }) => {
  const initialFormState = {
    title: '',
    description: '',
    expirationDate: '',
  };
  const [isShowed, setIsShowed] = useState(false);
  const [task, setTask] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(task);
    setTask(initialFormState);
    setIsAddModalOpen(false);
  }
  useEffect(() => {
    setIsShowed(true);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAddModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }
  , [setIsAddModalOpen]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit}
      className={`bg-black rounded-lg p-8 border-white border-2 overflow-hidden animate transition-all duration-300 opacity-0 ${isShowed ? 'w-96 h-auto opacity-100' : ''}`}>
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
              name='title'
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
              name='description'
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
              name='expirationDate'
              value={task.expirationDate}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            className="bg-white text-black"
          >
            Add Task
          </Button>
        </div>
      </form>
    </div>
  );
};

const AddTaskButton = ({ isAddModalOpen, setIsAddModalOpen }: { isAddModalOpen: boolean; setIsAddModalOpen: (value: boolean) => void }) => {
  return (
    <Button
    onClick={() => setIsAddModalOpen(!isAddModalOpen)}
    className={`z-50 rounded-full bg-black text-white fixed bottom-8 right-2 h-24 w-24 flex justify-center items-center animate transition-all lg:right-48 xl:right-96 
      ${ isAddModalOpen ? 'rotate-45' : ''}`}>
    <span 
      className='text-8xl -translate-y-2 font-light'
    >
      +
    </span>
  </Button>
  );
};
