import React from 'react'
import Orders from './Orders'
import { getAllOrders } from '@/app/api-integeration/orders'

const page = async ({searchParams}) => {

  const params = await searchParams;
  const data = await getAllOrders(params)

  if(!data?.success){
    return;
  }

  return (
    <Orders data={data} />
  )
}

export default page
