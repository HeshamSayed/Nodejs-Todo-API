# Production-Ready Node.js Todo API with TypeScript

A professionally architected REST API built with Node.js, TypeScript, and Express.js following industry best practices for production applications.

## 🎯 Why This Architecture?

### **TypeScript Benefits**
- **Type Safety**: Catch errors at compile time, not runtime
- **Better Developer Experience**: Auto-completion, refactoring, navigation
- **Self-Documenting**: Types serve as inline documentation
- **Maintainability**: Easier to maintain and refactor large codebases
- **Team Collaboration**: Clear contracts between modules

### **Modular Architecture Benefits**
- **Separation of Concerns**: Each module has a single responsibility
- **Testability**: Easy to unit test individual components
- **Scalability**: Add features without affecting existing code
- **Maintainability**: Changes in one module don't break others
- **Team Development**: Multiple developers can work on different modules

## 🏗️ Architecture Overview

```
src/
├── types/           # TypeScript type definitions
├── config/          # Configuration management
├── middleware/      # Express middleware functions
├── services/        # Business logic layer
├── controllers/     # HTTP request handlers
├── routes/          # API route definitions
├── app.ts          # Express app configuration
└── server.ts       # Server startup and process management
```

### **Layer Responsibilities**

1. **Types Layer** (`src/types/`)
   - Define interfaces and types
   - Ensure type safety across the application
   - Single source of truth for data structures

2. **Configuration Layer** (`src/config/`)
   - Environment variable management
   - Application settings
   - Validation of configuration

3. **Middleware Layer** (`src/middleware/`)
   - Cross-cutting concerns (security, logging, validation)
   - Request/response processing
   - Error handling

4. **Service Layer** (`src/services/`)
   - Pure business logic
   - Data manipulation and validation
   - Independent of HTTP concerns

5. **Controller Layer** (`src/controllers/`)
   - HTTP request/response handling
   - Input validation coordination
   - Service layer orchestration

6. **Routes Layer** (`src/routes/`)
   - API endpoint definitions
   - Middleware application
   - Route organization

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- TypeScript knowledge (recommended)

### Installation

1. **Clone and setup:**
```bash
mkdir todo-api-ts
cd todo-api-ts
# Copy all the files from artifacts
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Development:**
```bash
# Start development server (auto-restart on changes)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## 📋 Project Structure Explained

### **Why we use `const express = require('express')`?**

Actually, in our TypeScript version, we use:
```typescript
import express from 'express';
```

**ES6 Imports vs CommonJS Requires:**

```typescript
// ❌ Old CommonJS way (JavaScript)
const express = require('express');

// ✅ Modern ES6 way (TypeScript)
import express from 'express';
import { Request, Response } from 'express';
```

**Benefits of ES6 imports:**
- **Type Safety**: Get TypeScript type checking
- **Tree Shaking**: Bundlers can remove unused code
- **Static Analysis**: Better IDE support and refactoring
- **Standard**: Modern JavaScript/TypeScript standard
- **Explicit**: Clear what you're importing

### **Why This Modular Structure?**

```typescript
// ❌ Everything in one file (your original code)
const express = require('express');
const app = express();
// ... 200 lines of mixed concerns

// ✅ Modular approach
import { createApp } from './app';           // App configuration
import { todoService } from './services';   // Business logic
import { validateInput } from './middleware'; // Validation
```

**Problems with monolithic structure:**
- Hard to test individual components
- Difficult to maintain as app grows
- No separation of concerns
- Code reuse is difficult
- Team collaboration conflicts

**Benefits of modular structure:**
- Each file has one clear purpose
- Easy to locate and fix bugs
- Components can be tested independently
- New features don't break existing code
- Multiple developers can work simultaneously

## 🔧 Key Architectural Decisions

### **1. Configuration Management**

```typescript
// ❌ Hardcoded values
const PORT = 3000;
const API_PREFIX = '/api/v1';

// ✅ Environment-based configuration
export const config = {
  port: getEnvNumber('PORT', 3000),
  apiPrefix: getEnvString('API_PREFIX', '/api/v1'),
};
```

**Why?**
- **Environment flexibility**: Different settings for dev/staging/prod
- **Security**: Keep secrets out of code
- **Deployment**: Easy configuration without code changes

### **2. Type Safety**

```typescript
// ❌ No types (JavaScript)
function createTodo(data) {
  return {
    id: nextId++,
    title: data.title,
    // Runtime errors possible
  };
}

// ✅ With TypeScript interfaces
interface CreateTodoInput {
  title: string;
  description?: string;
}

function createTodo(data: CreateTodoInput): Todo {
  // Compile-time type checking
  return {
    id: nextId++,
    title: data.title.trim(),
    description: data.description || '',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
```

### **3. Middleware Chain Pattern**

```typescript
// ❌ Manual validation in each route
app.post('/todos', (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({error: 'Title required'});
  }
  // ... more validation
  // ... business logic
});

// ✅ Middleware chain
router.post('/',
  validateCreateTodo,    // Validation middleware
  createTodo            // Business logic controller
);
```

**Benefits:**
- **Reusable**: Same validation for multiple routes
- **Composable**: Mix and match middleware
- **Testable**: Test validation separately
- **Clean**: Controllers focus on business logic

### **4. Service Layer Pattern**

```typescript
// ❌ Business logic mixed with HTTP
app.get('/todos', (req, res) => {
  const todos = [...todosArray];  // Business logic
  res.json({                      // HTTP logic
    success: true,
    data: todos
  });
});

// ✅ Separated concerns
// Service (business logic)
export class TodoService {
  getAllTodos(): Todo[] {
    return [...this.todos];
  }
}

// Controller (HTTP logic)
export const getAllTodos = (req: Request, res: Response) => {
  const todos = todoService.getAllTodos();
  res.json({ success: true, data: todos });
};
```

### **5. Error Handling Strategy**

```typescript
// ❌ Inconsistent error handling
app.get('/todos/:id', (req, res) => {
  try {
    // ... logic
  } catch (error) {
    res.status(500).json({error: 'Something went wrong'});
  }
});

// ✅ Centralized error handling
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // Consistent error format
  // Proper logging
  // Environment-specific details
};

// ✅ Custom error types
export class AppError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
  }
}
```

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

#### Health & Info
- `GET /health` - Health check
- `GET /ping` - Simple ping
- `GET /` - API information

#### Todos
- `GET /api/v1/todos` - Get all todos
- `GET /api/v1/todos/:id` - Get specific todo
- `POST /api/v1/todos` - Create todo
- `PUT /api/v1/todos/:id` - Update todo
- `DELETE /api/v1/todos/:id` - Delete todo
- `PATCH /api/v1/todos/:id/toggle` - Toggle completion
- `GET /api/v1/todos/stats` - Get statistics

### Request/Response Examples

#### Create Todo
```bash
curl -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn TypeScript",
    "description": "Master advanced TypeScript patterns"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": 1,
    "title": "Learn TypeScript",
    "description": "Master advanced TypeScript patterns",
    "completed": false,
    "createdAt": "2025-07-17T10:30:00.000Z",
    "updatedAt": "2025-07-17T10:30:00.000Z"
  }
}
```

## 🛡️ Security Features

- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers (XSS protection, content security policy)
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses (no sensitive data leaks)
- **Request Size Limits**: Prevent large payload attacks

## 🧪 Testing Strategy

```typescript
// Example test structure
describe('TodoService', () => {
  it('should create a todo with valid input', () => {
    const input: CreateTodoInput = {
      title: 'Test Todo',
      description: 'Test Description'
    };
    
    const result = todoService.createTodo(input);
    
    expect(result.title).toBe('Test Todo');
    expect(result.completed).toBe(false);
  });
});
```

## 🚀 Production Deployment

### Environment Variables
```bash
NODE_ENV=production
PORT=8080
API_PREFIX=/api/v1
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX=1000
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8080
CMD ["node", "dist/server.js"]
```

### Build Process
```bash
npm run build    # Compile TypeScript
npm start       # Start production server
```

## 🔄 Development Workflow

1. **Make changes** to TypeScript files
2. **TypeScript compiler** checks types automatically
3. **ts-node-dev** restarts server on changes
4. **Test** endpoints with curl/Postman
5. **Build** for production with `npm run build`

## 📚 Learning Outcomes

By studying this codebase, you'll learn:

- **TypeScript**: Advanced types, interfaces, generics
- **Express.js**: Middleware, routing, error handling
- **Architecture**: Layered architecture, separation of concerns
- **Security**: Production-ready security practices
- **Configuration**: Environment-based configuration
- **Error Handling**: Centralized error management
- **Testing**: Testable code structure
- **Production**: Deployment and process management

## 🔮 Next Steps

1. **Database Integration**: Add PostgreSQL/MongoDB
2. **Authentication**: JWT-based auth system
3. **Testing**: Unit and integration tests
4. **Documentation**: Swagger/OpenAPI docs
5. **Monitoring**: Logging and metrics
6. **CI/CD**: Automated deployment pipeline

---

This architecture provides a solid foundation for building production-ready APIs that can scale from small projects to enterprise applications. The modular structure and TypeScript types make it maintainable and reliable for team development.