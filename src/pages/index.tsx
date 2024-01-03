import { signIn, signOut, useSession } from 'next-auth/react'

import TodoList from './components/TodoList/TodoList'

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="container mx-auto p-4">
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <TodoList></TodoList>
      </div>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
