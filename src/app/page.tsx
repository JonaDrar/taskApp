import { TaskDialog } from "@/components/ui/TaskDialog";
import { AddTask } from '@/components/AddTask';
import { Menu } from '@/components/Menu';

const tasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Task 1 descriptionlakjslkjasdlfkasd flasdkjflasdkfn sadlfij8ef kam dfoqihefñlawen f werqfijqw flwreqifqw fijhfrnglte gioewrgkerw greihg',
    status: 'todo',
    expirationDate: '2024-07-25T22:00:00.000Z',
    createdAt: '2024-07-24T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Task 2lkj hsdlkashdl kasjlk as1234we 1234efwe',
    description: 'Task 2 description',
    status: 'wip',
    createdAt: '2024-07-22T19:00:00.000Z',
    updatedAt: '2024-07-24T19:00:00.000Z',
  },
  {
    id: 3,
    title: 'Task 3',
    description: 'Task 3 description',
    status: 'done',
    expirationDate: '2024-07-24T19:00:00.000Z',
    createdAt: '2024-07-23T19:00:00.000Z',
    updatedAt: '2024-07-24T19:00:00.000Z',
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-12">
 
      <h1 className="text-3xl font-bold">Tasks</h1>
      <ul className="flex flex-col gap-4 min-w-96">
        {tasks.map((task) => (
          <TaskDialog key={task.id} task={task} />
        ))}
      </ul>
      <AddTask />
      <Menu />
    </main>
  );
};
