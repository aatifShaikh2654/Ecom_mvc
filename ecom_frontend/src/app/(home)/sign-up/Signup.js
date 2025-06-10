'use client'
import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import styles from '@/app/(home)/styles/login.module.css'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchCart, selectCart } from '@/app/store/cartSlice';
import Link from 'next/link';
import { registerUser } from '@/app/api-integeration/auth';
import { Loader2 } from 'lucide-react';
import { toast } from '@/lib/toast';

const Signup = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [Error, setError] = useState('');
    const { cart } = useSelector(selectCart);
    const params = useSearchParams()
    const redirect = params.get("redirect") ? params.get("redirect") : "/"
    const router = useRouter();
    const dispatch = useDispatch();


    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const onSubmit = async (data) => {
        data.cartData = cart
        const json = await registerUser(data)
        if (json.success) {
            toast.success(json.message)
            dispatch(fetchCart());
            window.location.href = redirect
        } else {
            setError(json.message)
        }
    }

    return (
        <div className={`${styles.login} padd-x`}>
            <div className="row h-100 justify-center align-items-center">
                <div className="col-lg-6 col-12">
                    <div className={`${styles.login_container} py-4`}>
                        <h1>Create Account</h1>
                        <p className={styles.para}>Create your personal account.</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Username Field */}
                            <div className="input-field">
                                <label htmlFor="username">Full Name</label>
                                <div className="input">
                                    <input
                                        type="text"
                                        placeholder="Enter Full Name"
                                        id="username"
                                        {...register('name', {
                                            required: 'Full Name is required',
                                            minLength: {
                                                value: 3,
                                                message: 'Full Name must be at least 3 characters'
                                            },
                                            maxLength: {
                                                value: 35,
                                                message: 'Full Name must not exceed 35 characters'
                                            },
                                        })}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="input-field">
                                <label htmlFor="email">Email Address</label>
                                <div className="input">
                                    <input
                                        type="email"
                                        placeholder="Enter your Email"
                                        id="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Enter a valid email address',
                                            },
                                        })}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Phone Field */}
                            <div className="input-field">
                                <label htmlFor="phone">Phone</label>
                                <div className="input">
                                    <input
                                        type="text"
                                        placeholder="Enter your Phone Number"
                                        id="phone"
                                        {...register('phone', {
                                            required: 'Phone Number is required',
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: 'Phone number must be 10 digits',
                                            },
                                        })}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="input-field">
                                <label htmlFor="password">Password</label>
                                <div className="input d-flex align-items-center">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="Enter your Password"
                                        id="password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 3,
                                                message: 'Password must be at least 3 characters',
                                            },
                                        })}
                                    />
                                    {passwordVisible ? <FaRegEye onClick={togglePasswordVisibility} /> : <FaRegEyeSlash onClick={togglePasswordVisibility} />}
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                                )}
                            </div>
                            {Error && (
                                <p className="text-red-500 text-sm">{Error}</p>
                            )}
                            <button type='submit' disabled={isSubmitting} className={styles.button}>
                                {isSubmitting ? <Loader2 /> : "Sign Up"}
                            </button>
                        </form>
                        <p className={styles.para}>Already Have an Account? <Link href={`/login?redirect=${redirect}`}>Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
