export default function LogoutForm() {
  return (
    <form method="post" action="/logout" className="w-full">
      <button
        type="submit"
        className="w-full px-2 py-1.5 text-left hover:cursor-pointer"
      >
        Log out
      </button>
    </form>
  )
}
