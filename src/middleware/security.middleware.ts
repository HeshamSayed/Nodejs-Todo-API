import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { corsOrigin, rateLimitWindow, rateLimitMax, logLevel, nodeEnv } from '../config';

export const corsMiddleware = cors({
  origin: corsOrigin === '*' ? true : corsOrigin.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
});


export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  
  hidePoweredBy: true,
  
  noSniff: true,
  
  xssFilter: true,
  
  frameguard: { action: 'deny' },
  
  hsts: nodeEnv === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false,
});


export const rateLimitMiddleware = rateLimit({
  windowMs: rateLimitWindow,
  max: rateLimitMax,
  
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    error: 'Rate limit exceeded',
  },
  
  standardHeaders: true,
  legacyHeaders: false,
  
  skipSuccessfulRequests: false,
  
  skipFailedRequests: false,
  
  keyGenerator: (req: Request): string => {
    return req.ip || 'unknown';
  },
});


export const loggingMiddleware = morgan(logLevel, {
  ...(nodeEnv === 'development' && {
    format: ':method :url :status :res[content-length] - :response-time ms',
  }),
  
  skip: (req: Request, res: Response) => {
    return req.url === '/health' || req.url === '/ping';
  },
});


export const validateContentType = (req: Request, res: Response, next: NextFunction): void => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type must be application/json',
        error: 'Invalid content type',
      });
    }
  }
  
  next();
};


export const validateRequestSize = (req: Request, res: Response, next: NextFunction): void => {
  const contentLength = req.headers['content-length'];
  
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    const maxSize = 1024 * 1024;
    
    if (size > maxSize) {
      return res.status(413).json({
        success: false,
        message: 'Request entity too large',
        error: `Maximum request size is ${maxSize} bytes`,
      });
    }
  }
  
  next();
};


export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  res.removeHeader('X-Powered-By');
  
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-Request-ID', generateRequestId());
  
  next();
};

const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};