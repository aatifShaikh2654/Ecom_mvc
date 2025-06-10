'use client'
import React from 'react'
import styles from '@/app/(home)/styles/section.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/app/store/cartSlice'

const Product2 = ({ data }) => {

    const dispatch = useDispatch();

    const availability = data ? data.available && data.stock !== 0 : true;
    if (!availability) {
        return
    }

    const handleAddToCart = () => {
        dispatch(addToCart({ quantity: 1, data: data }))
    }

    let slug;
    slug = `/shop/${data?.category?.slug}/${data.slug}/`

    return (
        <div className={styles.item}>
            <Link href={slug || "/shop"} className={styles.image}>
                <Image alt={data?.name} src={data && data && data.images[0] ? process.env.IMAGE_URL + data.images[0] : '/images/not_found.png'} className='img-fluid' width={500} height={500} />
            </Link>
            <Link href={slug || "/shop"}>
                <h4>{data?.name}</h4>
                <span className={styles.price}>&#8377; {data?.price}</span>
            </Link>
            <button disabled={!availability} onClick={handleAddToCart} className={styles.btn}>Add to Cart</button>
        </div>
    )
}

export default Product2
