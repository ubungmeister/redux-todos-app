import { useState } from 'react';
import { useCreateTaskMutation } from '@/services/tasksApi';
import { toast } from 'react-toastify';

export const TaskForm = () => {
  const [createTask] = useCreateTaskMutation();
  const [input, setInput] = useState('');

  const handleAddTask = async (e: React.FormEvent) => {
    // Creating a new, waiting for the promise to resolve
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await createTask({
        text: input,
      }).unwrap(); // gettting the actual data from the promise
      toast.success('Task created successfully!', {
        position: 'bottom-right',
      });
      setInput('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create task!', {
        position: 'bottom-right',
      });
    }
  };

  return (
    <div className="rounded shadow">
      <div className="py-3 px-4 ">
        <form className="flex items-center gap-2" onSubmit={handleAddTask}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add new..."
            className="form-input"
          />
          <button className="btn btn-outline-primary" type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};
