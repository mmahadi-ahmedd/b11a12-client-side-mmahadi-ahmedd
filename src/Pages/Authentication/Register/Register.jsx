import React from 'react';
import { useForm } from 'react-hook-form';

const Register = () => {

    const { register, handleSubmit, formState:{errors} } = useForm();
    const onSubmit = data => {
        console.log(data);
    }

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col ">
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <fieldset className="fieldset">
                                <h1 className="text-5xl font-bold">Creat an Account now</h1>
                                <label className="label">Email</label>
                                <input type="email" {...register('email', {required:true})} className="input" placeholder="Email" />
                                    {
                                        errors.email?.type === 'required' && 
                                        <p className='text-red-500' >Email is required</p>
                                    }

                                <label className="label">Password</label>
                                <input type="password" {...register('password', { required:true , minLength:6})} className="input" placeholder="Password" />
                                {
                                    errors.password?.type === 'minLength' && 
                                    <p> Password must be 6 characters minimum. </p>
                                }


                                <div><a className="link link-hover">Forgot password?</a></div>
                                <button className="btn btn-neutral mt-4">Register</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;