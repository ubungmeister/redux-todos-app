import { Filter } from '@/type/index';

interface TaskFilterProps {
  setFilter: (filter: Filter) => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({setFilter}) => {
  
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setFilter(e.target.value as Filter);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        onChange={handleSelect}
        className="form-select text-primary border border-primary bg-transparent"
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="active">Active</option>
      </select>
    </div>
  );
};
