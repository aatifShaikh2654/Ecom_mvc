'use client'

import Image from "next/image";
import Link from "next/link";
import styles from '@/app/(home)/styles/orderConfirm.module.css'

const Orders = ({orders}) => {

    console.log(orders)

    return (
        <div className='flex justify-center padd-x min-h-[100vh] w-full'>
            <div className="w-full">
                <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
                {orders.length === 0 && <p>No orders found.</p>}

                {orders.map((order, orderIndex) => (
                    <div key={orderIndex} className={styles.summary_container + " mb-8"}>
                        <h2 className="!text-sm mb-4">
                            Order #{order.id} - {new Date(order?.createdAt).toLocaleDateString()}
                        </h2>

                        {order.orderItems.map((item, itemIndex) => (
                            <Link
                                href={`/shop/${item.product?.category?.name}/${item.product?.slug}/`}
                                key={itemIndex}
                                className={styles.items}
                            >
                                <div className={styles.item}>
                                    <Image
                                        src={`${process.env.IMAGE_URL}${item.product.images[0]}`}
                                        alt={item.product.name}
                                        className={styles.item_image}
                                        width={70}
                                        height={70}
                                    />
                                    <div>
                                        <h5>{item.product.name}</h5>
                                        <p>
                                            <b>
                                                ₹{(item.product.price * item.quantity).toFixed(2)}
                                            </b>
                                        </p>
                                        <p>Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        <div className={styles.total}>
                            <h3 className={styles.order_total}>
                                <b className={styles.total_text}>Order Total:</b>
                                <span className={styles.total_text}>
                                    ₹{order.total}
                                </span>
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
