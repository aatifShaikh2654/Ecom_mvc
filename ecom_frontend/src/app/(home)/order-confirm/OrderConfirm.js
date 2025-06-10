import React from 'react'
import styles from '@/app/(home)/styles/orderConfirm.module.css'
import Image from 'next/image';
import Link from 'next/link';

const OrderConfirm = ({ order }) => {

    console.log(order)

    const orderItems = order?.orderItems;

    return (
        <div className='row justify-center padd-x min-h-[100vh]'>
            <div className="col-lg-6">
                <div className={styles.summary_container}>
                    <h2>Order placed successfully</h2>
                    {orderItems &&
                        orderItems.map((item, index) => {
                            return (
                                <Link
                                    href={`/shop/${item?.product?.category?.name}/${item?.product?.slug}/`}
                                    key={index}
                                    className={styles.items}
                                >
                                    <div className={styles.item}>
                                        <Image
                                            src={`${process.env.IMAGE_URL}${item.product.images[0]}`}
                                            alt="All In One Chocolate Combo"
                                            className={styles.item_image}
                                            width={70}
                                            height={70}
                                        />
                                        <div>
                                            <h5>{item.product.name}</h5>
                                            <p>
                                                <b>
                                                    &#8377;{" "}
                                                    {(
                                                        item.product.price * item.quantity
                                                    ).toFixed(2)}
                                                </b>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}

                    <div className={styles.total}>
                        <h3 className={styles.order_total}>
                            <b className={styles.total_text}>Order Total:</b>
                            <span className={styles.total_text}>
                                {" "}
                                &#8377; {order?.total}
                            </span>
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderConfirm
