import { useState } from 'react'
import { useTodos } from '../../hooks/useTodos'
import TodoItem from '../TodoItem/TodoItem'
import AddTodoForm from './AddTodoForm'
import Filters from '../Filter/filters'
import './TodoList.css'

const TodoList = () => {
  const [filter, setFilter] = useState('all')
  const {
    todos,
    isLoading,
    isError,
    error,
    createTodo,
    updateTodo,
    deleteTodo
  } = useTodos()

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.done
    if (filter === 'completed') return todo.done
    return true
  })

  const handleAddTodo = async text => {
    if (!text.trim()) return

    try {
      await createTodo(text.trim())
    } catch (error) {
      console.error('Ошибка в компоненте при добавлении:', error)
    }
  }

  const handleToggle = async todo => {
    try {
      await updateTodo({ ...todo, done: !todo.done })
    } catch (error) {
      console.error('Ошибка в компоненте при переключении:', error)
    }
  }

  const handleDelete = async id => {
    try {
      await deleteTodo(id)
    } catch (error) {
      console.error('Ошибка в компоненте при удалении:', error)
    }
  }

  if (isLoading) return <div className='loading'>Загрузка задач...</div>
  if (isError) return <div className='error'>Ошибка: {error}</div>

  return (
    <div className='todo-list-container'>
      <AddTodoForm onAdd={handleAddTodo} />

      <Filters currentFilter={filter} onFilterChange={setFilter} />

      <ul className='todo-items'>
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={updatedTodo => updateTodo(updatedTodo)}
          />
        ))}
      </ul>

      <div className='todo-count'>
        {todos.filter(t => !t.done).length} задач осталось
      </div>
    </div>
  )
}

export default TodoList
