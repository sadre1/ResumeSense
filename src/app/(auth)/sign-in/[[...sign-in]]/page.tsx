import { SignIn } from "@clerk/nextjs"

const page = () => {
  return (
    <main className="flex h-screen items-center justify-center p-3">
       <SignIn /> 
    </main>
  )
}

export default page