import { Request, Response } from 'express';
import { todoService } from '../services/todo.service';
import { ApiResponse, CreateTodoInput, UpdateTodoInput } from '../types/todo.types';
import { AppError, asyncHandler } from '../middleware/error.middleware';


export const getAllTodos = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const todos = todoService.getAllTodos();
  
  const response: ApiResponse = {
    success: true,
    message: todos.length > 0 ? 'Todos retrieved successfully' : 'No todos found',
    count: todos.length,
    data: todos,
  };
  
  res.status(200).json(response);
});


export const getTodoById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = (req as any).numericId;
  
  const todo = todoService.getTodoById(id);
  
  if (!todo) {
    throw new AppError(`Todo with ID ${id} not found`, 404);
  }
  
  const response: ApiResponse = {
    success: true,
    message: 'Todo retrieved successfully',
    data: todo,
  };
  
  res.status(200).json(response);
});


export const createTodo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const input: CreateTodoInput = {
    title: req.body.title,
    description: req.body.description,
  };
  
  try {
    const newTodo = todoService.createTodo(input);
    
    const response: ApiResponse = {
      success: true,
      message: 'Todo created successfully',
      data: newTodo,
    };
    
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(error.message, 400);
    }
    throw error;
  }
});


export const updateTodo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = (req as any).numericId;
  
  const input: UpdateTodoInput = {
    ...(req.body.title !== undefined && { title: req.body.title }),
    ...(req.body.description !== undefined && { description: req.body.description }),
    ...(req.body.completed !== undefined && { completed: req.body.completed }),
  };
  
  try {
    const updatedTodo = todoService.updateTodo(id, input);
    
    if (!updatedTodo) {
      throw new AppError(`Todo with ID ${id} not found`, 404);
    }
    
    const response: ApiResponse = {
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo,
    };
    
    res.status(200).json(response);
  } catch (error) {
    // Convert service errors to HTTP errors
    if (error instanceof Error && error.message.includes('not found')) {
      throw new AppError(error.message, 404);
    }
    if (error instanceof Error) {
      throw new AppError(error.message, 400);
    }
    throw error;
  }
});


export const deleteTodo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = (req as any).numericId;
  
  const deletedTodo = todoService.deleteTodo(id);
  
  if (!deletedTodo) {
    throw new AppError(`Todo with ID ${id} not found`, 404);
  }
  
  const response: ApiResponse = {
    success: true,
    message: 'Todo deleted successfully',
    data: deletedTodo,
  };
  
  res.status(200).json(response);
});


export const toggleTodo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = (req as any).numericId;
  
  const toggledTodo = todoService.toggleTodo(id);
  
  if (!toggledTodo) {
    throw new AppError(`Todo with ID ${id} not found`, 404);
  }
  
  const response: ApiResponse = {
    success: true,
    message: `Todo marked as ${toggledTodo.completed ? 'completed' : 'incomplete'}`,
    data: toggledTodo,
  };
  
  res.status(200).json(response);
});


export const getTodoStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const stats = todoService.getStats();
  
  const response: ApiResponse = {
    success: true,
    message: 'Statistics retrieved successfully',
    data: stats,
  };
  
  res.status(200).json(response);
});