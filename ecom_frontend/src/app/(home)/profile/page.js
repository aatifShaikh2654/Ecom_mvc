import React from 'react'
import Profile from './Profile'
import { getProfile } from '@/app/api-integeration/auth'

const page = async () => {

    const user = await getProfile();


    return (
        <Profile user={user?.data} />
    )
}

export default page
