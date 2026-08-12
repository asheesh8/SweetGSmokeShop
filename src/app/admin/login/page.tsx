import { LoginForm } from '@/components/admin/LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <LoginForm next={next ?? '/admin'} />
    </div>
  )
}
