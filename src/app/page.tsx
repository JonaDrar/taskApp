'use client';
import { useEffect, useState } from 'react';
import { TaskDialog } from '@/components/ui/TaskDialog';
import { AddTask } from '@/components/AddTask';
import { Menu } from '@/components/Menu';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import useAuthStore from '@/context/authStore';
import { TaskInterface } from '../types/Tasks';

export default function Home() {
  const [tasks, setTasks] = useState<TaskInterface[]>([]); // Define el tipo de estado como TaskInterface[]
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((state) => state.user?.uid);

  const filterAndSortTasks = (tasks: TaskInterface[]) => {
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    const now = new Date().getTime();

    const filtered = tasks
      .filter(task => {
        // Filtra las tareas que no están completadas o que han sido completadas en las últimas 24 horas
        if (task.status !== 'done') {
          return true;
        }

        const completedTime = task.updatedAt?.seconds ? task.updatedAt.seconds * 1000 : 0;
        return now - completedTime <= oneDayInMillis;
      })
      .sort((a, b) => {
        // Mueve las tareas "done" al final
        if (a.status === 'done' && b.status !== 'done') {
          return 1;
        }
        if (a.status !== 'done' && b.status === 'done') {
          return -1;
        }

        const aExpirationTime = a.expirationDate?.seconds ? a.expirationDate.seconds * 1000 : Infinity;
        const bExpirationTime = b.expirationDate?.seconds ? b.expirationDate.seconds * 1000 : Infinity;
        const aCreatedTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
        const bCreatedTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;

        // Ordena por proximidad a expirar
        if (aExpirationTime !== bExpirationTime) {
          return aExpirationTime - bExpirationTime;
        }

        // Si no hay expiración o son iguales, ordena por antigüedad
        return aCreatedTime - bCreatedTime;
      });

    setLoading(false);
    return filtered;
  };

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, `users/${userId}/tasks`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData: TaskInterface[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<TaskInterface, 'id'>), // Asegúrate de que los datos cumplen con TaskInterface, omitiendo el ID
      }));

      const filteredAndSortedTasks = filterAndSortTasks(tasksData);
      setTasks(filteredAndSortedTasks);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userId]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-12">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <ul className="flex flex-col gap-4 min-w-96">
        {
          loading ? (
            <p className='text-center'>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <li className="text-white text-center">No tasks yet</li>
          ) : (
            tasks.map((task) => (
              <TaskDialog key={task.id} task={task} />
            ))
          )
        }
      </ul>
      <AddTask />
      <Menu />
    </main>
  );
}