import { data, redirect } from 'react-router'
import LoginForm from '~/components/login-form'
import { createClient } from '~/utils/supabase/server'
import type { Route } from './+types/login'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Login - Milo' },
    { name: 'description', content: 'Login to your Milo account' },
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is already logged in, redirect to home
  if (user) {
    return redirect('/')
  }

  return null
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { supabase, headers } = createClient(request)

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return data({ error: error.message }, { status: 400 })
  }

  return redirect('/', {
    headers,
  })
}

export default function Login({ actionData }: Route.ComponentProps) {
  return (
    <div className="mx-auto flex h-screen w-full max-w-sm flex-col items-center justify-center gap-4 p-10">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <LoginForm />
      {actionData?.error && (
        <div className="text-red-500">{actionData.error}</div>
      )}
    </div>
  )
}
