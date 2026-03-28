"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import { LogIn, LogOut } from 'lucide-react'
import { AuthModel } from './AuthModel'
import { SignOut } from '@/actions/serverAction'

interface AuthButtonProps<T> {
  user: T 
}

const AuthButton = <T,>({user} : AuthButtonProps<T>) => {

    const [ShowModel, setShowModel] = useState(false)

    if(user){
        return(
            <form action={SignOut}>
                <Button variant="ghost" type='submit' size="lg" className="bg-orange-200 gap-2 cursor-pointer">
            <LogOut className="w-4 h-4"/>
            Sign out
        </Button>
            </form>
        )
    }

  return (
    <>
        <Button
          onClick={()=>{setShowModel(true)}}
          variant="default"
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4"/>
            Sign In
        </Button>

        <AuthModel
            isOpen={ShowModel}
            onClose={()=> setShowModel(false)}
         />
    </>
  )
}

export default AuthButton
