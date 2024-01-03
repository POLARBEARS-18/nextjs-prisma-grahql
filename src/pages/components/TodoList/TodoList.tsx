import type { FormEvent } from 'react'
import React, { FormEventHandler, useEffect, useState } from 'react'

import {
  type TodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useTodosQuery,
  useUpdateTodoMutation,
} from '@/generated/request'

function TodoList() {
  const [todoTitle, setTodoTitle] = useState('')
  const [todos, setTodos] = useState<TodosQuery['todos']>([])

  const { loading, error, data, refetch } = useTodosQuery()
  const [addTodoMutation] = useAddTodoMutation()
  const [updateTodoMutation] = useUpdateTodoMutation()
  const [deleteTodoMutation] = useDeleteTodoMutation()

  useEffect(() => {
    setTodos(data?.todos ?? [])
  }, [data?.todos])

  if (loading) <div>loading...</div>
  if (error) <div>error!</div>
  if (!data?.todos) null

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data } = await addTodoMutation({
      variables: {
        title: todoTitle,
      },
    })
    const addedTodo = data?.addTodo
    if (!addedTodo) return
    setTodos([addedTodo, ...todos])
    setTodoTitle('')
  }

  const handleChange = async (todoId: string, completed: boolean): Promise<void> => {
    const { data } = await updateTodoMutation({
      variables: { todoId, completed },
    })

    const todo = data?.updateTodo
    if (!todo) return
    const updatedTodos = todos.map((t) => (t?.id === todo.id ? todo : t))
    setTodos(updatedTodos)
  }
  const handleDelete = async (todoId: string): Promise<void> => {
    const isOk = confirm('削除しますか？')
    if (!isOk) return
    const { data } = await deleteTodoMutation({ variables: { todoId } })
    const todo = data?.deleteTodo
    if (!todo) return
    const deletedTodos = todos.filter((t) => t?.id !== todo.id)
    setTodos(deletedTodos)
    await refetch()
  }

  return (
    <div className="p-5 border rounded">
      TodoList
      <form onSubmit={handleSubmit}>
        <input
          className="p-2 border"
          type="text"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
        ></input>
        <button className="bg-gray-200 p-2">追加</button>
      </form>
      <ul className="mt-5">
        {todos.map((todo) => {
          return (
            <li key={todo.id} className={`${todo.completed && 'line-through'}`}>
              <span>
                {todo.completed ? '✅' : '👀'} {todo.title}
              </span>{' '}
              <input
                className="cursor-pointer"
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => handleChange(todo.id, e.target.checked)}
              />
              <span> / </span>
              <button onClick={() => handleDelete(todo.id)}>🗑</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TodoList
