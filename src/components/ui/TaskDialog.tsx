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
import { Task, TaskType } from './Task';
import { TaskSelect } from './TaskSelect';

export const TaskDialog = ({ task }: { task: TaskType }) => {
  
  return (
    <li>
      <Dialog>
        <DialogTrigger asChild>
          <Task task={task} />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-black">
          <DialogHeader>
            <DialogTitle>
              {task.status === 'done' ? 'Completed task  🚀' : 'Edit task'}
            </DialogTitle>
            <DialogDescription>
              {task.status === 'done'
                ? 'You have completed this task, good job! 🎉'
                : 'You can edit the task details below'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                defaultValue={task.title}
                className="col-span-3 text-white bg-black"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                defaultValue={task.description}
                className="col-span-3 text-white bg-black"
                disabled={task.status === 'done'}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <TaskSelect status={task.status} />
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-between items-center w-full">
            <Button variant="ghost">Delete task</Button>
            {
              task.status !== 'done' && (
                <Button variant="default" type='submit'>Save changes</Button>
              )
            }
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
};
