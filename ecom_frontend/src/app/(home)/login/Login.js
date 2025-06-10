'use client'
import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import styles from '@/app/(home)/styles/login.module.css'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchCart, selectCart } from '@/app/store/cartSlice';
import Link from 'next/link';
import { login } from '@/app/api-integeration/auth';
import { toast } from '@/lib/toast';
import { Loader2 } from 'lucide-react';

const Login = () => {

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
        const json = await login(data)
        if (json.success) {
            toast.success(json.message)
            dispatch(fetchCart());
            window.location.href = redirect
        } else {
            setError(json.message)
        }
    }

    return (
        <div className={`${styles.login} padd-x min-h-[100vh]`}>
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-lg-6 col-12">
                    <div className={styles.login_container}>
                        <h1>Welcome Back</h1>
                        <p className={styles.para}>Access your personal account by logging in.</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="input-field">
                                <label htmlFor="email">Email Address Or Phone number</label>
                                <div className="input">
                                    <input
                                        type="text"
                                        placeholder="Enter your Email or Phone Number"
                                        id="contact"
                                        {...register('email', {
                                            required: 'Email is required',
                                            validate: value => {
                                                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                if (!emailPattern.test(value)) {
                                                    return 'Enter a valid email';
                                                }
                                            },
                                        })}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-xs">{errors.email.message}</p>
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
                                    <p className="text-red-500 text-xs">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className=""></div>
                                <Link href="/login/forgot-password/" className={styles.forgot}>Forgot Password</Link>
                            </div>
                            {Error && (
                                <p className="text-red-500 text-xs">{Error}</p>
                            )}
                            <button type='submit' disabled={isSubmitting} className={styles.button}>
                                {isSubmitting ? <Loader2 /> : "Log In"}
                            </button>
                        </form>
                        <p className={styles.para}>Don&apos;t have an account? <Link href={`/sign-up/?redirect=${redirect}`}>Sign up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
