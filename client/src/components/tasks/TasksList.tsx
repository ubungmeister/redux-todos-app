import { Task } from '@/type/index';
import { TaskItem } from './TaskItem';

type TaskListProps = {
  tasks: Task[];
  isLoading: boolean;
};

export const TasksList: React.FC<TaskListProps> = ({ tasks, isLoading }) => {
  if (isLoading)
    return <div className="animate-bounce text-center">Loading...</div>;

  return (
    <>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </>
  );
};
