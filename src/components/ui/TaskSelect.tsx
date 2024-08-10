import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';

export const TaskSelect = ({ status }: { status: string }) => {
  const statusOptions = ['todo', 'wip', 'done'];
  return (
    <Select disabled={status === 'done'}>
      <SelectTrigger className="col-span-3 bg-black">
        <SelectValue placeholder={status} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Choose a status</SelectLabel>
          {statusOptions.map((s) => (
            <SelectItem
              key={s}
              value={s}
              disabled={
                s === status ||
                status === 'done' ||
                (status === 'wip' && s === 'todo')
              }
            >
              {status}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
