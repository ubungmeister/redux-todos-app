import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Task } from '@/type/index';
export const tasksApi = createApi({
  reducerPath: 'tasks',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    // GET all tasks, fetches an array of Task objects from the `/tasks`.
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      providesTags: (result) =>
        result
          ? [
              // create a tag for each task with its unique ID.
              ...result.map(({ id }) => ({ type: 'Task' as const, id })),
              // create a special tag for the entire list of tasks
              { type: 'Task', id: 'LIST' },
            ] //still need to provide a tag for the entire list of tasks
          : // query remains "subscribed" to the list of tasks
            [{ type: 'Task', id: 'LIST' }],
    }),
    // DELETE single task, deletes a single task by ID from the `/tasks/:id`.
    deleteTask: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistically remove the task from the getTasks cache
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
            // Find the task ID in cached array(draft) and remove it
            const index = draft.findIndex((task) => task.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // If the deletion fails, roll back the optimistic update
          patchResult.undo();
        }
      },
    }),
    //DELETE all completed tasks
    deleteAllCompleted: builder.mutation<
      { success: boolean; deletedCount: number },
      void
    >({
      query: () => ({
        url: '/tasks/completed',
        method: 'DELETE',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        // Optimistically update the getTasks cache by removing all completed tasks
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
            // Remove all completed tasks from cached array
            return draft.filter((task) => !task.completed);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // If the deletion fails, roll back the optimistic update
          patchResult.undo();
        }
      },
    }),
    // POST new task, creates a new task by sending a POST request to `/tasks`.
    createTask: builder.mutation<Task, { text: string }>({
      query: (body) => ({
        url: `/tasks/`,
        method: 'POST',
        body,
      }),
      async onQueryStarted(newTask, { dispatch, queryFulfilled }) {
        // Generate a temporary ID for the new task
        const tempId = Math.random().toString(36);

        // Optimistically update the getTasks cache by adding the new task
        const patchResult = dispatch(
          tasksApi.util.updateQueryData(
            'getTasks',
            undefined,
            (draft: Task[]) => {
              // Add the new task to the beginning of the cached array
              draft.unshift({
                ...newTask,
                id: tempId,
                completed: false,
                createdDate: new Date().getTime(),
              } as Task);
            }
          )
        );

        try {
          // Wait for the mutation to resolve
          const { data: createdTask } = await queryFulfilled;
          // Replace the temporary task with the one returned from the server
          dispatch(
            tasksApi.util.updateQueryData(
              'getTasks',
              undefined,
              (draft: Task[]) => {
                // Find the temporary task in the cached array and replace it
                const index = draft.findIndex((task) => task.id === tempId);
                if (index !== -1) {
                  draft[index] = createdTask;
                }
              }
            )
          );
        } catch {
          // Roll back the optimistic update in case of an error
          patchResult.undo();
        }
      },
    }),
    // Update single task by ID /tasks/:id
    updateTask: builder.mutation<Task, Partial<Task>>({
      query: (body) => ({
        url: `/tasks/${body.id}`,
        method: 'POST',
        body,
      }),
      async onQueryStarted(updatedTask, { dispatch, queryFulfilled }) {
        //Optimistically update the getTasks cache with the new text
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
            // Find the task in the cached array by ID
            const index = draft.findIndex((t) => t.id === updatedTask.id);
            if (index !== -1) {
              draft[index] = {
                ...draft[index],
                ...updatedTask, // Update the task with the new text
              };
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    // Toggle single task /tasks/:id/complete
    completeTask: builder.mutation<Task, Partial<Task>>({
      query: (body) => ({
        url: `/tasks/${body.id}/complete`,
        method: 'POST',
      }),

      async onQueryStarted(updatedTask, { dispatch, queryFulfilled }) {
        //Optimistically update the getTasks cache with the new status to "completed"
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
            // Find the task in the cached array by ID
            const index = draft.findIndex((t) => t.id === updatedTask.id);
            if (index !== -1) {
              draft[index].completed = true; //mark as completed
              draft[index].completedDate = new Date().getTime();
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // Roll back in case of error
          patchResult.undo();
        }
      },
    }),
    // Toggle single task /tasks/:id/incomplete
    incompleteTask: builder.mutation<Task, Partial<Task>>({
      query: (body) => ({
        url: `/tasks/${body.id}/incomplete`,
        method: 'POST',
      }),
      async onQueryStarted(updatedTask, { dispatch, queryFulfilled }) {
        //Optimistically update the getTasks cache with the new status to not "completed"
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
            // Find the task in the cached array by ID
            const index = draft.findIndex((t) => t.id === updatedTask.id);
            if (index !== -1) {
              draft[index].completed = false; //mark as not completed
              draft[index].completedDate = undefined;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // Roll back in case of error
          patchResult.undo();
        }
      },
    }),
    // Complete all tasks /tasks/completeAll
    completeAllTasks: builder.mutation<Task[], { ids: string[] }>({
      query: (body) => ({
        url: `/tasks/completeAll`,
        method: 'POST',
        body,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        //Optimistically update the ALL getTasks cache entities with the new status to "completed"
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
            // arg.ids is an array of task IDs to be marked as completed
            // Find each task in the cached array by ID and mark it as completed
            arg.ids.forEach((id) => {
              const task = draft.find((t) => t.id === id);
              if (task) {
                task.completed = true; //mark as completed
                task.completedDate = new Date().getTime();
              }
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // Roll back in case of error
          patchResult.undo();
        }
      },
    }),
    // Incomplete all tasks /tasks/incompleteAll
    incompleteAllTasks: builder.mutation<Task[], { ids: string[] }>({
      query: (body) => ({
        url: `/tasks/incompleteAll`,
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        //Optimistically update the ALL getTasks cache entities with the new status to not "completed"
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
            // arg.ids is an array of task IDs to be marked as not completed
            // Find each task in the cached array by ID and mark it as not completed
            arg.ids.forEach((id) => {
              const task = draft.find((t) => t.id === id);
              if (task) {
                task.completed = false; //mark as not completed
                task.completedDate = undefined;
              }
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // Roll back in case of error
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTasksQuery,
  useDeleteAllCompletedMutation,
  useDeleteTaskMutation,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useCompleteTaskMutation,
  useIncompleteTaskMutation,
  useCompleteAllTasksMutation,
  useIncompleteAllTasksMutation,
} = tasksApi;
