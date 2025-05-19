import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../api/todos'

export const useTodos = () => {
  const queryClient = useQueryClient()

  const {
    data: todos = [],
    isLoading,
    isError,
    error: queryError
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    retry: 2,
    staleTime: 1000 * 60 * 5
  })

  const mutationOptions = {
    onError: (error, variables, context) => {
      console.error('Ошибка в мутации:', error.message)
      // Восстанавливаем предыдущее состояние при ошибке
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    }
    // Убрали onSettled с invalidateQueries
  }

  const createMutation = useMutation({
    mutationFn: createTodo,
    ...mutationOptions,
    onMutate: async text => {
      await queryClient.cancelQueries(['todos'])
      const previousTodos = queryClient.getQueryData(['todos'])

      queryClient.setQueryData(['todos'], (old = []) => [
        ...old,
        { id: Date.now(), text, done: false }
      ])

      return { previousTodos }
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    ...mutationOptions,
    onMutate: async updatedTodo => {
      await queryClient.cancelQueries(['todos'])
      const previousTodos = queryClient.getQueryData(['todos'])

      queryClient.setQueryData(['todos'], (old = []) =>
        old.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
      )

      return { previousTodos }
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    ...mutationOptions,
    onMutate: async id => {
      await queryClient.cancelQueries(['todos'])
      const previousTodos = queryClient.getQueryData(['todos'])

      queryClient.setQueryData(['todos'], (old = []) =>
        old.filter(todo => todo.id !== id)
      )

      return { previousTodos }
    }
  })

  return {
    todos,
    isLoading,
    isError,
    error: queryError?.message,
    createTodo: text => createMutation.mutateAsync(text),
    updateTodo: todo => updateMutation.mutateAsync(todo),
    deleteTodo: id => deleteMutation.mutateAsync(id)
  }
}
