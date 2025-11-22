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
      {/* <div style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          id="email"
          name="email"
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="password"
          style={{ display: 'block', marginBottom: '0.5rem' }}
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div> */}
      <FieldSet>
        <FieldGroup>
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
        <Button type="submit">Login</Button>
      </div>
    </form>
  )
}
