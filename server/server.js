import express from 'express'
import fs from 'fs'
import cors from 'cors'

const app = express()
const PORT = 5000

// Настройка CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

// Логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

app.use(express.json())

const DATA_FILE = 'todos.json'

// Инициализация файла с задачами
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf-8')
  console.log('Файл todos.json создан')
}

// Чтение задач из файла
const readTodos = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Ошибка чтения задач:', error)
    throw new Error('Не удалось прочитать задачи')
  }
}

// Запись задач в файл
const writeTodos = todos => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8')
  } catch (error) {
    console.error('Ошибка записи задач:', error)
    throw new Error('Не удалось сохранить задачи')
  }
}

// Маршруты
app.get('/todos', (req, res) => {
  try {
    const todos = readTodos()
    console.log('Отправлено задач:', todos.length)
    res.status(200).json(todos)
  } catch (error) {
    console.error('Ошибка GET /todos:', error)
    res.status(500).json({
      error: 'Ошибка сервера',
      message: error.message
    })
  }
})

app.get('/todos/:id', (req, res) => {
  try {
    const todos = readTodos()
    const todo = todos.find(t => t.id === parseInt(req.params.id))

    if (!todo) {
      console.log('Задача не найдена ID:', req.params.id)
      return res.status(404).json({ error: 'Задача не найдена' })
    }

    res.status(200).json(todo)
  } catch (error) {
    console.error('Ошибка GET /todos/:id:', error)
    res.status(500).json({
      error: 'Ошибка сервера',
      message: error.message
    })
  }
})

app.post('/todos', (req, res) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ error: 'Текст задачи обязателен' })
    }

    const todos = readTodos()
    const newTodo = {
      id: todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1,
      text: req.body.text.trim(),
      done: false
    }

    todos.push(newTodo)
    writeTodos(todos)

    console.log('Добавлена новая задача:', newTodo)
    res.status(201).json(newTodo)
  } catch (error) {
    console.error('Ошибка POST /todos:', error)
    res.status(500).json({
      error: 'Ошибка сервера',
      message: error.message
    })
  }
})

app.put('/todos/:id', (req, res) => {
  try {
    const todos = readTodos()
    const index = todos.findIndex(t => t.id === parseInt(req.params.id))

    if (index === -1) {
      return res.status(404).json({ error: 'Задача не найдена' })
    }

    const updatedTodo = {
      ...todos[index],
      ...req.body,
      id: parseInt(req.params.id)
    }

    todos[index] = updatedTodo
    writeTodos(todos)

    console.log('Обновлена задача:', updatedTodo)
    res.status(200).json(updatedTodo)
  } catch (error) {
    console.error('Ошибка PUT /todos/:id:', error)
    res.status(500).json({
      error: 'Ошибка сервера',
      message: error.message
    })
  }
})

app.delete('/todos/:id', (req, res) => {
  try {
    const todos = readTodos()
    const initialLength = todos.length
    const newTodos = todos.filter(t => t.id !== parseInt(req.params.id))

    if (initialLength === newTodos.length) {
      console.log('Задача для удаления не найдена ID:', req.params.id)
      return res.status(404).json({ error: 'Задача не найдена' })
    }

    writeTodos(newTodos)
    console.log('Удалена задача ID:', req.params.id)
    res.status(200).json({
      message: 'Задача удалена',
      id: parseInt(req.params.id)
    })
  } catch (error) {
    console.error('Ошибка DELETE /todos/:id:', error)
    res.status(500).json({
      error: 'Ошибка сервера',
      message: error.message
    })
  }
})

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' })
})

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Глобальная ошибка:', err)
  res.status(500).json({
    error: 'Внутренняя ошибка сервера',
    message: err.message
  })
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})
