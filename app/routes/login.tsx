import { redirect, data } from 'react-router'
import type { Route } from './+types/login'
import { createClient } from '~/utils/supabase/server'
import LoginForm from '~/components/login-form'

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
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      {actionData?.error && (
        <div
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c33',
          }}
        >
          {actionData.error}
        </div>
      )}
      <LoginForm />
    </div>
  )
}
