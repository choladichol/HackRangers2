"use client"

import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export default function UserNav({ userEmail }: { userEmail: string }) {
  const handleLogout = async () => {
    await signOut(auth)
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-2 bg-medtronic-light-gray rounded-lg">
        <User className="h-4 w-4 text-medtronic-navy" />
        <span className="text-sm font-medium text-medtronic-navy">{userEmail}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="text-medtronic-orange border-medtronic-orange bg-transparent"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  )
}
