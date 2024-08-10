'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Task, TaskType } from './Task';
import { TaskSelect } from './TaskSelect';
import { useEffect, useState, useRef } from 'react';
import { deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import useAuthStore from '@/context/authStore';
import { db } from '@/lib/firebase';

export const TaskDialog = ({ task }: { task: TaskType }) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <>
      <li className="hover:cursor-pointer" onClick={() => setIsEditing(true)}>
        <Task task={task} />
      </li>
      {isEditing && <Dialog inputTask={task} setIsEditing={setIsEditing} />}
    </>
  );
};

const Dialog = ({
  inputTask,
  setIsEditing,
}: {
  inputTask: TaskType;
  setIsEditing: (value: boolean) => void;
}) => {
  const [isShowed, setIsShowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const userId = useAuthStore((state) => state.user?.uid);

  const expirationDate = inputTask.expirationDate?.toDate();

  const initialTask = {
    id: inputTask.id,
    title: inputTask.title,
    description: inputTask.description,
    status: inputTask.status,
    expirationDate: expirationDate?.toISOString().split('T')[0] || '',
  };
  const [task, setTask] = useState(initialTask);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let expirationDate = null;

      if (task.expirationDate) {
        const parsedDate = new Date(task.expirationDate + "T00:00:00");
        if (!isNaN(parsedDate.getTime())) {
          expirationDate = parsedDate;
        } else {
          console.error("Invalid expiration date:", task.expirationDate);
        }
      }

      await updateDoc(doc(db, `users/${userId}/tasks`, task.id), {
        description: task.description,
        status: task.status,
        expirationDate: expirationDate,
        updatedAt: serverTimestamp(),
      });

      setIsEditing(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, `users/${userId}/tasks`, task.id));
      setIsEditing(false);
      setIsDeleting(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsShowed(true);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleDialogClick = (e: React.MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      setIsEditing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50 cursor-auto"
      onClick={handleDialogClick}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`bg-black rounded-lg p-8 border-white border-2 overflow-hidden animate transition-all relative duration-300 opacity-0 
          ${isShowed ? 'w-96 h-auto opacity-100' : ''}`}
        onClick={(e) => e.stopPropagation()} // Evitar que el clic dentro del formulario cierre el diálogo
      >
        <button
          className="absolute top-4 right-4"
          type="button"
          onClick={() => setIsEditing(false)}
        >
          <span className="sr-only">Close</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white hover:text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-white text-2xl font-bold">
          {inputTask.status === 'done' ? 'Completed task  🚀' : 'Edit task'}
        </h2>
        <p>
          {inputTask.status === 'done'
            ? 'You have completed this task, good job! 🎉'
            : 'You can edit the task details below'}
        </p>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              className="col-span-3 text-white bg-black"
              name="title"
              value={task.title}
              disabled
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
              disabled={inputTask.status === 'done'}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <TaskSelect
              status={inputTask.status}
              onChange={(value) => setTask({ ...task, status: value })}
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
              disabled={inputTask.status === 'done'}
            />
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <Button
            type="button"
            variant="ghost"
            className="text-red-500"
            onClick={() => setIsDeleting(!isDeleting)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Really?' : 'Delete'}
          </Button>
          {isDeleting && (
            <div className="flex gap-0 -translate-x-6 animate-deletereveal">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDeleting(false)}
              >
                No
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleDelete}
                className="text-red-500"
              >
                Yes
              </Button>
            </div>
          )}
          {inputTask.status !== 'done' ? (
            <Button type="submit" variant="default" disabled={isLoading}>
              Save
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              onClick={() => setIsEditing(false)}
            >
              Close
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};