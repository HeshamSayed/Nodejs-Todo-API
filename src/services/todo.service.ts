import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo.types';

class TodoService {
  private todos: Todo[] = [];
  private nextId: number = 1;

 
  public getAllTodos(): Todo[] {
    return [...this.todos];
  }


  public getTodoById(id: number): Todo | null {
    const todo = this.todos.find(t => t.id === id);
    return todo ? { ...todo } : null;
  }


  public createTodo(input: CreateTodoInput): Todo {
    this.validateCreateInput(input);

    const now = new Date().toISOString();
    
    const newTodo: Todo = {
      id: this.nextId++,
      title: input.title.trim(),
      description: input.description?.trim() || '',
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    this.todos.push(newTodo);
    return { ...newTodo };
  }

  public updateTodo(id: number, input: UpdateTodoInput): Todo | null {
    const todoIndex = this.todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return null;
    }

    this.validateUpdateInput(input);

    const currentTodo = this.todos[todoIndex]!;
    
    const updatedTodo: Todo = {
      ...currentTodo,
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...(input.description !== undefined && { description: input.description.trim() }),
      ...(input.completed !== undefined && { completed: input.completed }),
      updatedAt: new Date().toISOString(),
    };

    this.todos[todoIndex] = updatedTodo;
    return { ...updatedTodo };
  }

  public deleteTodo(id: number): Todo | null {
    const todoIndex = this.todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return null;
    }

    const deletedTodo = this.todos.splice(todoIndex, 1)[0]!;
    return { ...deletedTodo };
  }

  public toggleTodo(id: number): Todo | null {
    const todo = this.todos.find(t => t.id === id);
    
    if (!todo) {
      return null;
    }

    todo.completed = !todo.completed;
    todo.updatedAt = new Date().toISOString();
    
    return { ...todo };
  }


  public getStats(): { total: number; completed: number; pending: number; completionRate: number } {
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  }


  private validateCreateInput(input: CreateTodoInput): void {
    if (!input.title || typeof input.title !== 'string') {
      throw new Error('Title is required and must be a string');
    }

    if (input.title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }

    if (input.title.trim().length > 200) {
      throw new Error('Title cannot be longer than 200 characters');
    }

    if (input.description && typeof input.description !== 'string') {
      throw new Error('Description must be a string');
    }

    if (input.description && input.description.trim().length > 1000) {
      throw new Error('Description cannot be longer than 1000 characters');
    }
  }


  private validateUpdateInput(input: UpdateTodoInput): void {
    if (input.title !== undefined) {
      if (typeof input.title !== 'string') {
        throw new Error('Title must be a string');
      }
      if (input.title.trim().length === 0) {
        throw new Error('Title cannot be empty');
      }
      if (input.title.trim().length > 200) {
        throw new Error('Title cannot be longer than 200 characters');
      }
    }

    if (input.description !== undefined) {
      if (typeof input.description !== 'string') {
        throw new Error('Description must be a string');
      }
      if (input.description.trim().length > 1000) {
        throw new Error('Description cannot be longer than 1000 characters');
      }
    }

    if (input.completed !== undefined && typeof input.completed !== 'boolean') {
      throw new Error('Completed must be a boolean');
    }
  }
}


export const todoService = new TodoService();