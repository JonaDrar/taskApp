'use client';
import { Badge } from './badge';
import classNames from 'classnames';
import { Timestamp } from 'firebase/firestore'; // Asegúrate de importar Timestamp de Firestore
import { useEffect, useState } from 'react';

export type TaskType = {
  id: string;
  title: string;
  description: string;
  status: string;
  expirationDate?: Timestamp; // Cambiado a Timestamp
  createdAt: Timestamp; // Cambiado a Timestamp
  updatedAt?: Timestamp; // Cambiado a Timestamp
};

export const Task = ({ task }: { task: TaskType }) => {
  const [timeAgo, setTimeAgo] = useState('');
  const getDiff = (date: Date): number => {
    const today = new Date().getTime();
    const taskDate = date?.getTime();
    const diff = today - taskDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const hoursAgo = (date: Date): number => {
    const today = new Date().getTime();
    const taskDate = date?.getTime();
    const diff = today - taskDate;
    return Math.floor(diff / (1000 * 60 * 60));
  };

  const createdAtDate = task.createdAt?.toDate(); // Convertir Timestamp a Date
  const expirationDate = task.expirationDate
    ? task.expirationDate.toDate()
    : null; // Convertir Timestamp a Date si existe

  const hoursToExpire = expirationDate ? hoursAgo(expirationDate) : 0;
  const diffDays = getDiff(createdAtDate);
  const daysToExpire = expirationDate ? getDiff(expirationDate) : 0;
  const isNearExpiration =
    expirationDate && task.status !== 'done' && daysToExpire >= -1;

  const taskClasses = classNames(
    'flex flex-col gap-4 w-full max-w-96 p-2 px-6 rounded-lg',
    {
      'opacity-10': task.status === 'done',
      'border-l-4 border-cyan-500': task.status === 'wip',
      'border-l-4 border-default': task.status === 'todo',
      'bg-red-950/50 animate-vibrate': diffDays === 1 && task.status !== 'done',
      'bg-red-950 animate-vibrate-intense':
        diffDays >= 2 && task.status !== 'done',
      'bg-red-950 animate-pulse': isNearExpiration,
    }
  );

  const calculateTimeAgo = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - createdAtDate?.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
  useEffect(() => {
    // Calcula el tiempo al montar el componente
    setTimeAgo(calculateTimeAgo());

    // Actualiza el tiempo cada minuto
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 60000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, [task.createdAt]);

  return (
    <div className={taskClasses}>
      <header className="flex flex-row justify-between">
        <h2 className="text-xl font-bold">{task.title}</h2>
        <Badge variant="outline" className="text-white ml-2 max-h-6">
          {task.status}
        </Badge>
      </header>
      <p className="text-gray-500 text-wrap">{task.description}</p>
      <div className="flex gap-4 justify-between">
        <p className="text-gray-500">
          Created: {timeAgo}
        </p>
        {expirationDate && (
          <p className="text-gray-500">
            Expires in:{' '}
            {hoursToExpire * -1 < 24 ? hoursToExpire * -1 : daysToExpire * -1}
            {' '}
            {hoursToExpire === 1
              ? 'hour'
              : hoursToExpire < -24
              ? 'days'
              : 'hours'}
          </p>
        )}
      </div>
    </div>
  );
};
