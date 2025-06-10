import React from 'react'
import Checkout from './Checkout'
import { getProfile } from '@/app/api-integeration/auth'

const page = async () => {

  const user = await getProfile();

  return (
    <Checkout user={user?.data} />
  )
}

export default page
