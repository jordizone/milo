export default function LogoutForm() {
  return (
    <form method="post" action="/logout">
      <button type="submit" className="w-full hover:cursor-pointer">
        Log out
      </button>
    </form>
  )
}
