import React from 'react'

import Users from './Users'
import { getUsers } from '@/app/api-integeration/auth';

const page = async ({ searchParams }) => {

  const params = await searchParams;
  const data = await getUsers(params);


  if (!data?.success) {
    return;
  }
  
  return (
    <Users data={data} />
  )
}

export default page
