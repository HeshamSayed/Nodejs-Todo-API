
export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface CreateTodoInput {
  title: string;
  description?: string;
}


export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
}


export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  error?: string;
}


export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}