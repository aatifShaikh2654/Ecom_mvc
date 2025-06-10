'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from '@/app/(home)/styles/detail.module.css'
import Breadcrumb from '@/app/(home)/components/BreadCrumb'
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { Swiper, SwiperSlide } from 'swiper/react';
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { LuMinus } from "react-icons/lu";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';
import { useDispatch } from 'react-redux';
import { loader } from '@/app/store/loaderSlice';
import { useSelector } from 'react-redux';
import { addToCart, fetchCart, selectCart } from '@/app/store/cartSlice';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import { addCheckoutItem } from '@/app/store/checkoutSlice';
import Image from 'next/image';



const Detail = ({ data }) => {

    const [mainImage, setMainImage] = useState({ url: null, index: 0 });

    const url = process.env.API_URL

    const [quantity, setQuantity] = useState(1);

    const cookie = new Cookies()
    const token = cookie.get('token')

    const nextRef = useRef(null);
    const prevRef = useRef(null);
    const swiperRef = useRef(null);
    const dispatch = useDispatch()
    const router = useRouter();
    const availability = data ? data.available && data.stock !== 0 : true;

    const handleChangeImage = (item, index) => {
        setMainImage({ url: item, index: index })
    }

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.params.navigation.prevEl = prevRef.current;
            swiperRef.current.params.navigation.nextEl = nextRef.current;

            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
        }
    }, [swiperRef]);

    const pathname = usePathname();
    const changeSKU = (newSKU) => {
        // Extract the current URL path
        const pathParts = pathname.split('/');
        if (pathParts.length > 3) {
            // Replace the SKU part
            pathParts[3] = newSKU;
        }
        const newUrl = pathParts.join('/');
        // Update the URL without reloading the page
        router.replace(newUrl, undefined, { shallow: true });
    };

    const handleAddToCart = () => {
        if (data) {
            dispatch(addToCart({ quantity: quantity, data: data }))
        }
    }

    const handleBuyNow = async () => {
        try {
            dispatch(loader(true))
            dispatch(addCheckoutItem({ item: data, quantity: quantity }))
            await router.push('/checkout')
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(loader(false))
        }
    }


    const lines = data && data.description.split('\n');
    const bulletPoints = [];
    const paragraphs = [];
    const [subSwiperDirection, setSubSwiperDirection] = useState("horizontal");
    const [index, setIndex] = useState(0)

    lines && lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('•')) {
            bulletPoints.push(trimmedLine.replace('•', '').trim()); // Add bullet points without the marker
        } else if (trimmedLine) {
            paragraphs.push(trimmedLine); // Add non-empty lines as paragraphs
        }
    });

    const mainSwiperRef = useRef(null);
    const subSwiperRef = useRef(null);

    useEffect(() => {
        // Update windowWidth state on resize and adjust Swiper direction
        const handleResize = () => {
            const newWidth = window.innerWidth;
            setSubSwiperDirection(newWidth >= 992 ? "vertical" : "horizontal");
        };

        window.addEventListener("resize", handleResize);

        // Trigger initial direction calculation
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    const breakpointsConfig = {
        1000: {
            slidesPerView: 3,
            spaceBetween: 10
        },
        768: {
            slidesPerView: 4,
            spaceBetween: 10,
        },
        599: {
            slidesPerView: data && data.images.length > 5 ? 5 : data && data.images.length,
        },
        499: {
            slidesPerView: data && data.images.length > 4 ? 4 : data && data.images.length,
        },
    };

    const handleMainImageChange = (ind) => {
        // Slide main swiper to the selected index
        if (mainSwiperRef.current) {
            mainSwiperRef.current.slideTo(ind);
            setIndex(ind)
        }
        handleChangeImage(data.images[index].image, index);
    };
    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
            handleMainImageChange(index)
            console.log(index)
        }
    }, [index, swiperRef])

    const handlePrevClick = () => {
        if (swiperRef.current) {
            if (index > 0) {
                console.log("hello")
                setIndex(index - 1)
            }
        }
    };
    const handleNextClick = () => {
        if (swiperRef.current) {

            // const newIndex = Math.min(swiperRef.current.activeIndex + 1, data.images.length-1);
            // console.log(newIndex)
            if (index < data.images.length - 1) {
                console.log("hello")
                setIndex(index + 1)
            }

        }
    }

    if (data) {
        return (
            <>
                <div className={`container-fluid padd-x ${styles.detail}`}>
                    <div className="mb-2">
                        <Breadcrumb />
                    </div>
                    <div className="row position-relative">
                        <div className="col-lg-5 col-12">
                            <div className={styles.image_content}>
                                <div className="row">
                                    {/* Sub Image Swiper */}
                                    <div className="col-lg-2  col-12 d-flex align-items-center flex-lg-column order-lg-0 order-1">
                                        <div className={styles.sub_image_list}>
                                            <div className={styles.inner_sub_list}>
                                                <Swiper
                                                    direction={subSwiperDirection}
                                                    spaceBetween={10}
                                                    slidesPerView={3}
                                                    // Always 3 slides in vertical mode
                                                    style={subSwiperDirection === 'vertical' ? { height: "20em" } : undefined}
                                                    modules={[Navigation]}

                                                    onBeforeInit={(swiper) => {

                                                        swiperRef.current = swiper; // Store Swiper instance
                                                    }}
                                                    allowSlideNext={true}
                                                    breakpoints={breakpointsConfig}
                                                    allowTouchMove={data.images.length > 3} // Enable scrolling if more than 3 slides
                                                >
                                                    {data.images.map((item, index) => (

                                                        <>

                                                            <SwiperSlide key={index} >
                                                                <div
                                                                    onClick={() => handleMainImageChange(index)}
                                                                    className={`${styles.sub_image} ${mainImage.index === index ? styles.active : ""
                                                                        }`}
                                                                >
                                                                    {item && <Image
                                                                        src={process.env.IMAGE_URL + item}
                                                                        className="img-fluid"
                                                                        alt=""
                                                                        width={100}
                                                                        height={100}
                                                                    />}
                                                                </div>
                                                            </SwiperSlide>
                                                        </>

                                                    ))}
                                                </Swiper>
                                            </div>

                                            {data.images.length > 3 && (
                                                <div>
                                                    <button onClick={handlePrevClick}

                                                        className={`${styles.btn} ${styles.left}`}
                                                    >
                                                        <FaAngleUp />
                                                    </button>
                                                    <button

                                                        className={`${styles.btn} ${styles.right}`}
                                                        onClick={handleNextClick}
                                                    >
                                                        <FaAngleDown />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Main Image Swiper */}
                                    <div className="col-lg-10 col-12 order-lg-1 order-0">
                                        <Swiper
                                            slidesPerView={1}
                                            spaceBetween={10}
                                            onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
                                            onSlideChange={(swiper) =>
                                                handleMainImageChange(swiper.activeIndex)
                                            }
                                            modules={[Navigation]}
                                            navigation={{
                                                prevEl: prevRef.current,
                                                nextEl: nextRef.current,
                                            }}
                                            className={styles.mainSwiper}
                                        >
                                            {data.images.map((item, index) => (
                                                <SwiperSlide key={index} className={styles.swiper_slide}>
                                                    <div className={styles.main_image}>
                                                        {item && <Image
                                                            src={process.env.IMAGE_URL + item}
                                                            className="img-fluid"
                                                            alt=""
                                                            width={1000}
                                                            height={1000}
                                                        />}
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 col-12">
                            <div className={styles.content}>
                                <h1>{data.name}</h1>
                                <div className={styles.price}>
                                    <span>&#8377; {data.price}</span>
                                </div>

                                <div className={`quantity accent ${styles.quantity}`}>
                                    <button disabled={quantity === 1} onClick={() => { setQuantity(quantity - 1) }} className={`svg ${quantity === 1 ? "disabled" : ''}`}><LuMinus /></button>
                                    <input type="number" minLength={0} value={quantity} />
                                    <button onClick={() => { setQuantity(quantity + 1) }} className="svg"><LuPlus /></button>
                                </div>

                                {!availability && <p className='text-red-500 text-sm'>Product is not availabile</p>}
                                <div className={styles.cta}>
                                    <button className={`${styles.button} ${!availability ? styles.disabled : ''}`} disabled={!availability} onClick={handleBuyNow}>Buy Now</button>
                                    <button className={`${styles.button} ${styles.add} ${!availability ? styles.disabled : ''}`} disabled={!availability} onClick={handleAddToCart}>Add to Cart</button>
                                </div>

                                <p className="whitespace-pre-line">{data?.description}</p>

                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <div className="d-flex align-items-center justify-content-center flex-col" style={{ height: "100vh" }}>
                {error ? null : <div className="loader-circle">
                    <span class="loader"></span>
                </div>}
                {error && <h6 className="mt-2">!{error}</h6>}
            </div>
        )
    }
}

export default Detail
