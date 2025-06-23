import React from 'react'

export default function MasterAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Aqui poderemos adicionar sidebar quando necessário */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
