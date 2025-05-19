import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import TodoList from './components/TodoList'
import './App.css'

function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='app-container'>
        <div className='app-card'>
          <h1 className='app-title'>Todo App</h1>
          <TodoList />
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
