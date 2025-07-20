import express, { Request, Response, Application } from 'express';
import { apiPrefix } from './config';
import { ApiResponse } from './types/todo.types';

import {
  corsMiddleware,
  helmetMiddleware,
  rateLimitMiddleware,
  loggingMiddleware,
  validateContentType,
  validateRequestSize,
  securityHeaders,
} from './middleware/security.middleware';

import {
  errorHandler,
  notFoundHandler,
} from './middleware/error.middleware';

import todoRoutes from './routes/todo.routes';


export const createApp = (): Application => {
  const app = express();

  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(securityHeaders);
  app.use(rateLimitMiddleware);
  app.use(loggingMiddleware);

  app.use(validateRequestSize);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(validateContentType);


  app.get('/health', (req: Request, res: Response) => {
    const response: ApiResponse = {
      success: true,
      message: 'Server is healthy',
      data: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
      },
    };
    
    res.status(200).json(response);
  });


  app.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'pong' });
  });


  app.get('/', (req: Request, res: Response) => {
    const response: ApiResponse = {
      success: true,
      message: 'Welcome to the Todo API',
      data: {
        version: '1.0.0',
        description: 'A production-ready Node.js Todo API built with TypeScript',
        endpoints: {
          health: '/health',
          ping: '/ping',
          api: apiPrefix,
          todos: `${apiPrefix}/todos`,
          stats: `${apiPrefix}/todos/stats`,
        },
        documentation: {
          swagger: `${apiPrefix}/docs`,
          postman: '/postman.json',
        },
        timestamp: new Date().toISOString(),
      },
    };
    
    res.status(200).json(response);
  });


  app.use(`${apiPrefix}/todos`, todoRoutes);


  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp();