import {
  FieldSet,
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Button } from './ui/button'

export default function LoginForm() {
  return (
    <form method="post" className="w-full">
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
        <Button type="submit" className="hover:cursor-pointer">
          Get started
        </Button>
      </div>
    </form>
  )
}
