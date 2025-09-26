import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';

const Login = () => {

    const { register, handleSubmit, formState:{errors} } = useForm();
    const {signIn} = useAuth();
    const location = useLocation();
    console.log(location);
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const onSubmit = data => {
        signIn(data.email, data.password)
        .then( result=>{
            console.log(result.user);
            navigate(from);
        } )
        .catch(error=> console.log(error) )
    }


    return (
        <div className='w-full mx-auto' >
            <form onSubmit={handleSubmit(onSubmit)} >
                <div className="hero-content flex-col ">
                    <div className="text-center ">
                        <h1 className="text-5xl font-bold">Login now!</h1>

                    </div>
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <div className="card-body">
                            <fieldset className="fieldset">
                                <label className="label">Email</label>
                                <input type="email" {...register('email')} className="input" placeholder="Email" />
                                <label className="label">Password</label>
                                <input type="password" {...register('password', {
                                    required: true,
                                    minLength: 6
                                })}
                                    className="input" placeholder="Password" />
                                    {
                                        errors.password?.type === 'required' && 
                                        <p className='text-red-500' > 
                                            Password is required
                                        </p>
                                    }
                                    {
                                        errors.password?.type === 'minLength' &&
                                        <p className='text-red-500' >
                                            Pass word must be  6 characters minimum.
                                        </p>
                                    }
                                <div><a className="link link-hover">Don't have an account?</a></div>
                                <Link to='/register' > Register </Link>
                               
                            </fieldset>
                             <button className="btn btn-neutral mt-4">Login</button>
                        </div>
                    </div>
                </div>
            </form>
           <div className='w-full mx-auto' >
             <SocialLogin></SocialLogin>
           </div>
        </div>
    );
};

export default Login;