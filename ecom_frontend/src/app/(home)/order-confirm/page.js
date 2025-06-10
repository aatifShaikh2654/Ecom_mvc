import React from 'react'
import OrderConfirm from './OrderConfirm'
import { getSingleOrder } from '@/app/api-integeration/orders'

const page = async ({ searchParams }) => {

    const params = await searchParams;
    const data = await getSingleOrder(params?.id)

    return (
        <OrderConfirm order={data?.data} />
    )
}

export default page
