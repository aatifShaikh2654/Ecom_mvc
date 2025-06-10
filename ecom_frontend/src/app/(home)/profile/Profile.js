'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '@/app/(home)/styles/Profile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import { updateProfile } from '@/app/api-integeration/auth';
import { toast } from '@/lib/toast';

const Profile = ({user}) => {
    const dispatch = useDispatch();
    const router = useRouter();

    // Initialize react-hook-form
    const cookies = new Cookies()
    const url = process.env.API_URL
    const token = cookies.get('token')
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
        }
    });

    const [Error, setError] = useState('');

    const onSubmit = async (data) => {
        const json = await updateProfile(data)
        if(json.success){
            toast.success(json.message)
            router.refresh();
        } else {
            toast.error(json.message)
        }
    }

    return (
        <form className={styles.form_container} onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <h3 className={`${styles.heading} mb-3`}><b>Edit Profile</b></h3>
                {/* Full Name */}
                <div className="col-md-6">
                    <div className="input-field">
                        <label htmlFor="name">Full Name</label>
                        <div className="input">
                            <input
                                id="name"
                                type="text"
                                {...register('name',
                                    {
                                        required: 'Full name is required',
                                        maxLength: {
                                            value: 35,
                                            message: 'Full Name must not exceed 35 characters'
                                        },
                                    }
                                )}
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>
                </div>

                {/* Phone Number */}
                <div className="col-md-6">
                    <div className="input-field">
                        <label htmlFor="phone_number">Phone No</label>
                        <div className="input">
                            <input
                                type="text"
                                placeholder="Enter your Phone Number"
                                id="phone"
                                {...register('phone_number', {
                                    required: 'Phone Number is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Phone number must be 10 digits',
                                    },
                                })}
                            />
                        </div>
                        {errors.phone_number && (
                            <p className="text-red-500 text-xs">{errors.phone_number.message}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="col-md-6">
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <div className="input">
                            <input
                                id="email"
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                </div>
                {Error && <p className="text-red-500 text-xs">{Error}</p>}
                {/* Buttons */}
                <div className={styles.button_container}>
                    <button type="submit" className={styles.button}>
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Profile;
