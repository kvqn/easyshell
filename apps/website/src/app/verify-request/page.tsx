export const metadata = {
  title: "easyshell - check your email",
}

export default function Page() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="text-center text-4xl font-bold lg:text-6xl">
        Check your email!
      </div>
      <div className="mt-2 text-center text-neutral-600 lg:mt-4 lg:text-2xl">
        A sign in link has been sent to your email address.
      </div>
      <div className="mt-4 text-center text-sm text-neutral-400 lg:mt-8">{`Although it's unlikely but if you didn't receive an email, be sure to check your spam folder.`}</div>
    </div>
  )
}
