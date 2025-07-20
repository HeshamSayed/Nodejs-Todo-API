import express, { Request, Response, NextFunction } from 'express';
import { Todo, CreateTodoInput, ApiResponse } from './types/todo.types';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});


let todos: Todo[] = [];
let nextId = 1;


app.get('/', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Welcome to TypeScript Todo API!',
    data: {
      version: '1.0.0',
      description: 'A simple Todo API built with Node.js and TypeScript',
      endpoints: [
        'GET / - This welcome message',
        'GET /todos - Get all todos',
        'POST /todos - Create a new todo',
        'GET /todos/:id - Get specific todo',
        'PUT /todos/:id - Update todo (coming soon)',
        'DELETE /todos/:id - Delete todo (coming soon)'
      ],
      timestamp: new Date().toISOString()
    }
  };
  res.status(200).json(response);
});

app.get('/todos', (req: Request, res: Response) => {
  const response: ApiResponse<Todo[]> = {
    success: true,
    message: todos.length > 0 ? 'Todos retrieved successfully' : 'No todos found',
    count: todos.length,
    data: todos
  };
  res.status(200).json(response);
});

app.post('/todos', (req: Request, res: Response) => {
  try {
    const { title, description }: CreateTodoInput = req.body;
    
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title is required and must be a non-empty string'
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be longer than 200 characters'
      });
    }

    if (description && typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Description must be a string'
      });
    }

    if (description && description.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Description cannot be longer than 1000 characters'
      });
    }
    
    const newTodo: Todo = {
      id: nextId++,
      title: title.trim(),
      description: description?.trim() || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    
    const response: ApiResponse<Todo> = {
      success: true,
      message: 'Todo created successfully',
      data: newTodo
    };
    
    res.status(201).json(response);
    
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/todos/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID. ID must be a positive number.'
      });
    }
    
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Todo with ID ${id} not found`
      });
    }
    
    const response: ApiResponse<Todo> = {
      success: true,
      message: 'Todo retrieved successfully',
      data: todo
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error retrieving todo:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.put('/todos/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID. ID must be a positive number.'
      });
    }
    
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Todo with ID ${id} not found`
      });
    }
    
    const { title, description, completed } = req.body;
    
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Title must be a non-empty string'
        });
      }
      if (title.trim().length > 200) {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be longer than 200 characters'
        });
      }
    }
    
    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Description must be a string'
      });
    }
    
    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Completed must be a boolean'
      });
    }
    
    const currentTodo = todos[todoIndex]!;
    const updatedTodo: Todo = {
      ...currentTodo,
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(completed !== undefined && { completed }),
      updatedAt: new Date().toISOString()
    };
    
    todos[todoIndex] = updatedTodo;
    
    const response: ApiResponse<Todo> = {
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.delete('/todos/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID. ID must be a positive number.'
      });
    }
    
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Todo with ID ${id} not found`
      });
    }
    
    const deletedTodo = todos.splice(todoIndex, 1)[0]!;
    
    const response: ApiResponse<Todo> = {
      success: true,
      message: 'Todo deleted successfully',
      data: deletedTodo
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ===== TypeScript Todo API Started =====');
  console.log(`✅ Server running on port: ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`📋 Todos API: http://localhost:${PORT}/todos`);
  console.log(`📖 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('==========================================');
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET    /           - Welcome message');
  console.log('  GET    /todos      - Get all todos');
  console.log('  POST   /todos      - Create new todo');
  console.log('  GET    /todos/:id  - Get specific todo');
  console.log('  PUT    /todos/:id  - Update todo');
  console.log('  DELETE /todos/:id  - Delete todo');
  console.log('');
});