import { Router } from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  getTodoStats,
} from '../controllers/todo.controller';
import {
  validateIdParam,
  validateCreateTodo,
  validateUpdateTodo,
} from '../middleware/validation.middleware';



const router = Router();


router.get('/stats', getTodoStats);


router.get('/', getAllTodos);


router.post('/', 
  validateCreateTodo,
  createTodo
);


router.get('/:id',
  validateIdParam,
  getTodoById
);


router.put('/:id',
  validateIdParam,
  validateUpdateTodo,
  updateTodo
);


router.delete('/:id',
  validateIdParam,
  deleteTodo
);


router.patch('/:id/toggle',
  validateIdParam,
  toggleTodo
);

export default router;