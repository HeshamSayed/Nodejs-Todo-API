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
      'GET /todos - Get all todos'
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

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Visit: http://localhost:${PORT}`);
});