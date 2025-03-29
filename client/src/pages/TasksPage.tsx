import { TasksList } from '@/components/tasks/TasksList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Controls } from '@/components/tasks/Controls';

import { useGetTasksQuery } from '@/services/tasksApi';
import { Filter } from '../type';
import { useState, useMemo } from 'react';

export const TasksPage = () => {
  const { data: tasks, isLoading } = useGetTasksQuery();
  const [filter, setFilter] = useState<Filter>(Filter.All);

  // Filter tasks based on the selected filter
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    if (filter === 'completed') {
      return tasks.filter((t) => t.completed);
    } else if (filter === 'active') {
      return tasks.filter((t) => !t.completed);
    }
    return tasks;
  }, [tasks, filter]);

  const completedTasks = tasks?.filter((t) => t.completed) ?? [];
  const completedTasksCount = completedTasks?.length;
  const hasCompletedTasks = !!completedTasks && completedTasks.length > 0;
  const hasTasks = !!tasks && tasks.length > 0;

  return (
    <div className="card">
      <div className="container mx-auto">
        <div className="card-position">
          <div className="w-full max-w-xl">
            {/* Card Container */}
            <div id="list1" className="card-container ">
              <div className="py-4 px-4 md:px-5">
                {/* Header */}
                <div className="text-4xl font-bold text-center mt-3 mb-4 pb-3 text-blue-500">
                  <u>My Todo-s</u>
                </div>
                {/* Add New Task */}
                <TaskForm />
                <hr className="my-4 " />
                {/* Filter and Controls */}
                {hasTasks && <Controls setFilter={setFilter} tasks={tasks} />}
                {/* Tasks List */}
                <TasksList tasks={filteredTasks} isLoading={isLoading} />
                {/* Completed tasks count*/}
                {hasCompletedTasks && (
                  <div className="mt-3 gap-0.5 flex items-center ">
                    <p>{completedTasksCount}</p>
                    <p>{completedTasksCount > 1 ? 'tasks' : 'task'} done</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
