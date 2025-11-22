import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Milo' },
    { name: 'description', content: 'A flashcard app' },
  ]
}

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="font-rounded text-4xl font-extrabold tracking-tight">
        Milo
      </h1>
    </div>
  )
}
