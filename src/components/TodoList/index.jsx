import { useState } from 'react'
import { useTodos } from '../../hooks/useTodos'
import TodoItem from '../TodoItem/TodoItem'
import AddTodoForm from './AddTodoForm'
import Filters from '../Filter/filters'
import './TodoList.css'

const TodoList = () => {
  const [filter, setFilter] = useState('all')
  const { todos, isLoading, isError, createTodo, updateTodo, deleteTodo } =
    useTodos()

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.done
    if (filter === 'completed') return todo.done
    return true
  })

  const handleAddTodo = text => {
    if (text.trim()) {
      createTodo(text.trim())
    }
  }

  const handleToggle = todo => {
    updateTodo({ ...todo, done: !todo.done })
  }

  const handleDelete = id => {
    deleteTodo(id)
  }

  if (isLoading) return <div className='loading'>Loading...</div>
  if (isError) return <div className='error'>Error loading todos</div>

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
            onUpdate={updateTodo}
          />
        ))}
      </ul>

      <div className='todo-count'>
        {todos.filter(t => !t.done).length} items left
      </div>
    </div>
  )
}

export default TodoList
