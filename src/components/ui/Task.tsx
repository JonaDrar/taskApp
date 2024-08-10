import { Badge } from './badge';
import classNames from 'classnames';

export type TaskType = {
  id: number;
  title: string;
  description: string;
  status: string;
  expirationDate?: string;
  createdAt: string;
  updatedAt?: string;
};

export const Task = ({ task }: { task: TaskType }) => {
  const getDiff = (date: string): number => {
    const today = new Date().getTime();
    const taskDate = new Date(date).getTime();
    const diff = today - taskDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const hoursAgo = (date: string): number => {
    const today = new Date().getTime();
    const taskDate = new Date(date).getTime();
    const diff = today - taskDate;
    return Math.floor(diff / (1000 * 60 * 60));
  };
  const hoursToExpire = task.expirationDate ? hoursAgo(task.expirationDate) : 0;
  const diffDays = getDiff(task.createdAt);
  const daysToExpire = task.expirationDate ? getDiff(task.expirationDate) : 0;
  const isNearExpiration = task.expirationDate && task.status !== 'done' && daysToExpire >= -1;

  const taskClasses = classNames(
    'flex flex-col gap-4 w-full max-w-96 p-2 px-6 rounded-lg',
    {
      'opacity-10': task.status === 'done',
      'border-l-4 border-cyan-500': task.status === 'wip',
      'border-l-4 border-default': task.status === 'todo',
      'bg-red-950/50 animate-vibrate': diffDays === 1 && task.status !== 'done',
      'bg-red-950 animate-vibrate-intense': diffDays >= 2 && task.status !== 'done',
      'bg-red-950 animate-pulse': isNearExpiration,
    }
  );

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
          Created: {hoursAgo(task.createdAt)} hours ago
        </p>
        {task.expirationDate && (
          <p className="text-gray-500">Expires in: {(hoursToExpire*-1)} hours</p>
        )}
      </div>
    </div>
  );
};
