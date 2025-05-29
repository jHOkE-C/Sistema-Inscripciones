"use client"

import { User, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/auth"


export function UserPanel() {

  const { user } = useAuth()
  return (
    <div className="w-full max-w-3xl mx-auto p-6 pb-0 bg-gradient-to-r  rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-slate-700 text-white p-4 rounded-full">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{user?.usuario}</h2>
            <p className="text-slate-500 dark:text-slate-400">Panel de Administración</p>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 justify-center ">
            <Shield className="h-4 w-4" />
            Roles
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {user?.roles.map((rol, index) => (
              <Badge key={index} className="px-3 py-1.5 text-sm bg-slate-700">
                {rol}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
