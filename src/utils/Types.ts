type UserType = {
    id: string;
    username: string;
    email: string;
}

type TaskType = {
    userId: string;
    taskTitle: string;
    taskDescription?: string;
    completed: boolean;
    id?: string;
}

export type { UserType, TaskType}