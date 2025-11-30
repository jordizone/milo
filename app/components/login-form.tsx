import { useFetcher } from 'react-router'
import { Field, FieldGroup, FieldSet } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'

export default function LoginForm() {
  const fetcher = useFetcher()

  return (
    <fetcher.Form method="post" className="w-full font-mono">
      <FieldSet>
        <FieldGroup className="gap-2">
          <Field>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </Field>
          <Field>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </Field>
        </FieldGroup>
      </FieldSet>
      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          className="w-[150px] bg-sky-400 font-mono hover:cursor-pointer"
          disabled={fetcher.state !== 'idle'}
        >
          {fetcher.state === 'idle' ? 'Get started' : <Spinner />}
        </Button>
      </div>
    </fetcher.Form>
  )
}
