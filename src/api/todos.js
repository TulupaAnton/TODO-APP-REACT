import axios from 'axios'

const API_URL = 'http://localhost:5000/todos'

// Создаем экземпляр axios с настройками
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Обработчик ошибок
const handleRequestError = (error, operation) => {
  let errorMessage = 'Произошла ошибка'

  if (error.response) {
    // Ошибка от сервера
    errorMessage = error.response.data?.error || error.response.statusText
  } else if (error.request) {
    // Запрос был сделан, но ответ не получен
    errorMessage = 'Сервер не отвечает'
  } else {
    // Ошибка при настройке запроса
    errorMessage = 'Ошибка при отправке запроса'
  }

  throw new Error(errorMessage)
}

export const fetchTodos = async () => {
  try {
    const response = await api.get('/')
    return response.data
  } catch (error) {
    handleRequestError(error, 'при загрузке задач')
  }
}

export const createTodo = async text => {
  try {
    const response = await api.post('/', { text })
    return response.data
  } catch (error) {
    handleRequestError(error, 'при создании задачи')
  }
}

export const updateTodo = async todo => {
  try {
    const response = await api.put(`/${todo.id}`, todo)
    return response.data
  } catch (error) {
    handleRequestError(error, 'при обновлении задачи')
  }
}

export const deleteTodo = async id => {
  try {
    const response = await api.delete(`/${id}`)
    return response.data
  } catch (error) {
    handleRequestError(error, 'при удалении задачи')
  }
}
