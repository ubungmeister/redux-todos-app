export interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdDate: number;
    completedDate?: number;
  }

  export interface TasksState {
  tasks: Task[];
  filter: Filter;
  sort: Sort;
}

export enum Filter {
  All = 'all',
  Completed = 'completed',
  Active = 'active',
}
export enum Sort {
  Asc = 'asc',
  Desc = 'desc',
}
