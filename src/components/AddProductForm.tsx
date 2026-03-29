"use client"

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { AuthModel } from './AuthModel'
import { addProduct } from '@/actions/serverAction'
import { toast } from 'sonner'

interface AddProductFormProps<T> {
  user: T
}

const AddProductForm = <T,>({ user }: AddProductFormProps<T>) => {

  const [url, seturl] = useState("")
  const [loading, setloading] = useState(false)
  const [ShowModel, setShowModel] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(!user){
      setShowModel(true)
      return
    }

    setloading(true)

    const formData = new FormData()
    formData.append("url", url)

    const result = await addProduct(formData)
    
    if(result.error){
      toast.error(result.error)
    }else{
      toast.success(result.message || "Product added successfully")
      seturl("")
    }

    setloading(false)
  }
  return (
    <>
      <form onSubmit={handleSubmit} className='w-full max-w-2xl mx-auto'>
        <div className='flex flex-col sm:flex-row gap-2'>
          <Input
            type='url'
            value={url}
            onChange={(e) => seturl(e.target.value)}
            placeholder='Paste Product url  (Amazon, Flipkart, etc.)'
            className='h-12 text-base'
            required
            disabled={loading}
          />

          <Button
            type="submit"
            disabled={loading}
            className="bg-orange-700 hover:bg-orange-600 h-10 sm:h-12 px-8 font-semibold text-lg"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 />
                Adding....
              </>
            ) : ("Trace Price")}
          </Button>
        </div>
      </form>

      {/* Auth model */}
      <AuthModel
        isOpen={ShowModel}
        onClose={() => setShowModel(false)}
      />
    </>
  )
}

export default AddProductForm
