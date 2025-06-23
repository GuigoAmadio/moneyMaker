import { redirect } from 'next/navigation'
import { getAuthUser } from '@/actions/auth'
import {
  devAuthMiddleware,
  isAuthenticationEnabled,
  getCurrentUser,
} from '@/lib/auth-config'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DevModeIndicator from '@/components/ui/DevModeIndicator'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user

  // 🚀 MODO DESENVOLVIMENTO: Bypass de autenticação
  if (!isAuthenticationEnabled()) {
    console.log(
      '🔓 [DEV MODE] Autenticação desabilitada - Acesso livre ao dashboard'
    )
    user = getCurrentUser()
  } else {
    // Verificar autenticação normal em produção
    user = await getAuthUser()

    if (!user) {
      redirect('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DevModeIndicator />
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader user={user} />
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
