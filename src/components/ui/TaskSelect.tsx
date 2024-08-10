import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';

export const TaskSelect = ({ status, onChange }: { status: string, onChange: (value: string) => void }) => {
  const statusOptions = ['todo', 'wip', 'done'];
  
  return (
    <Select
      disabled={status === 'done'}
      onValueChange={onChange}
    >
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
              {s}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};