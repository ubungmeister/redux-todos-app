import { Task } from '@/type/index';
import { useState } from 'react';
import { toast } from 'react-toastify';

import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useCompleteTaskMutation,
  useIncompleteTaskMutation,
} from '@/services/tasksApi';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [completeTask] = useCompleteTaskMutation();
  const [incompleteTask] = useIncompleteTaskMutation();

  const [text, setText] = useState(task.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      toast.success('Task deleted successfully!', {
        position: 'bottom-right',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete task', {
        position: 'bottom-right',
      });
    }
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && text.trim()) {
      updateTask({ id: task.id, text });
      setIsEditing(false);
    }
  };
  const handleOnBlur = () => {
    if (text !== task.text && text.trim()) {
      updateTask({ id: task.id, text });
    }
    setIsEditing(false);
  };

  const handleToggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const toggleCompleted = () => {
    if (!task.completed) {
      console.log('task', task);
      completeTask({ id: task.id });
    } else {
      console.log('task2', task);
      incompleteTask({ id: task.id });
    }
  };

  return (
    <div className="item-card">
      <div className="pr-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggleCompleted}
          className="form-checkbox h-5 w-5"
        />
      </div>
      <div className="flex-grow">
        {isEditing ? (
          <input
            type="text"
            value={text}
            onBlur={handleOnBlur}
            autoFocus
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleTextKeyDown}
            className="item-input"
          />
        ) : (
          <p className="text-lg" onDoubleClick={handleToggleEditing}>
            {task.text}
          </p>
        )}
      </div>
      <div className="text-right">
        <div className="flex justify-end mb-1">
          <div
            onClick={handleToggleEditing}
            className="mr-3 text-blue-500  hover:cursor-pointer"
          ></div>
          <div
            onClick={handleDelete}
            className="mr-3 text-blue-500  hover:cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-trash3-fill"
              viewBox="0 0 16 16"
            >
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
