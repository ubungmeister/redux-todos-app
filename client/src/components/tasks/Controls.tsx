// Controls.tsx
import { useState } from 'react';
import { TaskFilter } from '@/components/tasks/TaskFilter';
import { IoMdCheckboxOutline } from 'react-icons/io';
import { TbTrashOff } from 'react-icons/tb';
import { Filter, Task } from '@/type/index';
import { toast } from 'react-toastify';

import {
  useCompleteAllTasksMutation,
  useDeleteAllCompletedMutation,
  useIncompleteAllTasksMutation,
} from '@/services/tasksApi';

interface ControlsProps {
  setFilter: (filter: Filter) => void;
  tasks: Task[];
}

export const Controls: React.FC<ControlsProps> = ({ setFilter, tasks }) => {
  const [completeAllTasks] = useCompleteAllTasksMutation();
  const [incompleteAllTasks] = useIncompleteAllTasksMutation();
  const [deleteAllCompletedTasks] = useDeleteAllCompletedMutation();

  const [allTaskCompleted, setAllTaskCompleted] = useState(true);

  // Mark all tasks as completed or not completed
  const handleMarkAllTasks = () => {
    const ids = tasks?.map((task) => task.id) ?? [];

    if (allTaskCompleted) {
      completeAllTasks({ ids });
    } else {
      incompleteAllTasks({ ids });
    }

    setAllTaskCompleted((prev) => !prev);
  };

  // Delete all completed tasks
  const handleDeleteAllCompletedTasks = async () => {
    try {
      await deleteAllCompletedTasks();
      toast.success('All completed tasks deleted!', {
        position: 'bottom-right',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete completed tasks', {
        position: 'bottom-right',
      });
    }
  };

  const hascompletedTasks = tasks?.filter((t) => t.completed) ?? [];

  return (
    <div className="controls-card">
      <div className="flex items-center gap-1">
        {/* Mark all tasks as completed */}
        <button
          className="btn btn-outline-primary d-flex align-items-center justify-content-center"
          onClick={handleMarkAllTasks}
        >
          <IoMdCheckboxOutline />
          <span className="text-center ml-1">all</span>
        </button>
        {/*Task Filter */}
        <TaskFilter setFilter={setFilter} />
      </div>
      {/* Delete completed tasks */}
      {hascompletedTasks.length > 0 && (
        <button
          className="btn btn-outline-primary d-flex align-items-center justify-content-center"
          onClick={handleDeleteAllCompletedTasks}
        >
          <TbTrashOff />
          <span className="text-center ml-1">completed</span>
        </button>
      )}
    </div>
  );
};
