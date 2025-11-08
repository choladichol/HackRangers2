"use client"

import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, ChevronDown, ChevronUp } from "lucide-react"

export default function UserNav({ userEmail }: { userEmail: string }) {
  const [showInfo, setShowInfo] = useState(false)
  const user = auth?.currentUser

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth)
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-2 px-2 py-2 bg-medtronic-light-gray rounded-lg hover:bg-medtronic-light-gray/80 transition-colors"
        >
          <Avatar className="h-8 w-8 border-2 border-medtronic-vibrant-blue">
            <AvatarImage src={user?.photoURL || undefined} alt={userEmail} />
            <AvatarFallback className="bg-medtronic-vibrant-blue text-white text-sm font-semibold">
              {userEmail.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {showInfo ? <ChevronUp className="h-4 w-4 text-medtronic-vibrant-blue" /> : <ChevronDown className="h-4 w-4 text-medtronic-vibrant-blue" />}
        </button>
        
        {showInfo && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-medtronic-light-gray rounded-lg shadow-lg p-4 z-50">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-medtronic-vibrant-blue">Email:</span>
                <p className="text-gray-700 break-all">{userEmail}</p>
              </div>
              {user?.uid && (
                <div>
                  <span className="font-medium text-medtronic-vibrant-blue">User ID:</span>
                  <p className="text-gray-700 text-xs break-all">{user.uid}</p>
                </div>
              )}
              {user?.emailVerified !== undefined && (
                <div>
                  <span className="font-medium text-medtronic-vibrant-blue">Verified:</span>
                  <p className="text-gray-700">{user.emailVerified ? "Yes" : "No"}</p>
                </div>
              )}
              {user?.metadata?.creationTime && (
                <div>
                  <span className="font-medium text-medtronic-vibrant-blue">Account Created:</span>
                  <p className="text-gray-700 text-xs">
                    {new Date(user.metadata.creationTime).toLocaleDateString()}
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-medtronic-light-gray">
                🔒 Your information is secure and encrypted.
              </p>
            </div>
          </div>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="text-medtronic-purple-indigo border-medtronic-purple-indigo bg-transparent hover:bg-medtronic-purple-indigo/10"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  )
}
