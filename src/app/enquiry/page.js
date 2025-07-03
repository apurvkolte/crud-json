'use client';

import React from 'react'
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export const metadata = {
    title: 'Enquiry Page',
    description: 'Contact us via this enquiry form',
};

const enquiry = () => {
    const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset, } = useForm();

    const onSubmit = async (data) => {
        const res = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        console.log(result);
        reset();
    };

    return (
        <div className="py-5 p-5">
            <div className="col-md-4 mx-auto border rounded p-4 d-flex flex-column justify-content-center align-items-center">
                <h4 className="text-primary mb-3">Send a Message</h4>

                {isSubmitSuccessful && (
                    <div className="alert alert-success w-100">
                        Message sent successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="w-100">
                    <div className="form-group mb-3">
                        <label className='mb-2'>Name</label>
                        <input
                            type="text"
                            className={`form-control mb-1 ${errors.name ? 'is-invalid' : ''}`}
                            placeholder="Enter the name"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <small className="text-danger">{errors.name.message}</small>}
                    </div>

                    <div className="form-group mb-3">
                        <label className='mb-2'>Email</label>
                        <input
                            type="email"
                            className={`form-control mb-1 ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="Enter the email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email format',
                                },
                            })}
                        />
                        {errors.email && <small className="text-danger">{errors.email.message}</small>}
                    </div>

                    <div className="form-group mb-3">
                        <label className='mb-2'>Mobile</label>
                        <input
                            type="text"
                            className={`form-control mb-1 ${errors.mobile ? 'is-invalid' : ''}`}
                            placeholder="Contact Number"
                            {...register('mobile', {
                                required: 'Mobile number is required',
                                pattern: {
                                    value: /^[0-9]{10,15}$/,
                                    message: 'Mobile must be 10 to 15 digits',
                                },
                            })}
                        />
                        {errors.mobile && <small className="text-danger">{errors.mobile.message}</small>}
                    </div>

                    <div className="form-group mb-4">
                        <label className='mb-2'>Message</label>
                        <textarea
                            className={`form-control mb-1 ${errors.message ? 'is-invalid' : ''}`}
                            rows="4"
                            placeholder="Write your message"
                            {...register('message', {
                                required: 'Message is required',
                                minLength: {
                                    value: 10,
                                    message: 'Message must be at least 10 characters',
                                },
                            })}
                        ></textarea>
                        {errors.message && <small className="text-danger">{errors.message.message}</small>}
                    </div>

                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <button type="submit" className="btn btn-md btn-primary">Send</button>
                        <Link href="/" className="btn btn-md btn-secondary">Home</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default enquiry;
