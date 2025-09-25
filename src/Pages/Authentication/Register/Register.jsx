import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router';
const Register = () => {

    const { register, handleSubmit, formState:{errors} } = useForm();
    const {createUser} = useAuth();
    const onSubmit = data => {
        console.log(data);
        createUser(data.email, data.password)
        .then(
            result=>{
                console.log(result.user)
            }
        )
        .catch(
            error=>{
                console.error(error);
            }
        )
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


                                <div><a className="link link-hover">Already have an account?</a></div>
                                <Link to='/login' > Login </Link>
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