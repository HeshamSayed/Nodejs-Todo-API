const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});

let todos = [];
let nextId = 1;


// ===== ROUTES =====
// Basic route - our first endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Todo API!',
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET / - This welcome message',
      'GET /todos - Get all todos',
      'POST /todos - Create a new todo'
    ]
  });
});

app.get('/todos', (req, res) => {
  res.json({
    success: true,
    message: 'Todos retrieved successfully',
    count: todos.length,
    data: todos
  });
});

app.post('/todos', (req, res) => {
  const { title, description } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Title is required and cannot be empty'
    });
  }
  
  const newTodo = {
    id: nextId++,                           
    title: title.trim(),                    
    description: description || '',         
    completed: false,                       
    createdAt: new Date().toISOString(),  
    updatedAt: new Date().toISOString() 
  };
  
  todos.push(newTodo);
  
  // Send success response with the created todo
  res.status(201).json({
    success: true,
    message: 'Todo created successfully',
    data: newTodo
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Visit: http://localhost:${PORT}`);
});