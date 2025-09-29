import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';
const Register = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const [profilePic, setProfilePic] = useState(false);
    const axiosInstance = useAxios();





    const onSubmit = data => {
        console.log(data);
        createUser(data.email, data.password)
            .then(
                async (result) => {
                    console.log(result.user);


                    const userInfo = {
                        email: data.email,
                        name:data.name,
                        profilePic:profilePic,
                        role: 'user',
                        created_at: new Date().toISOString(),
                        last_log_in: new Date().toISOString()

                    }

                    const userRes = await axiosInstance.post('/users', userInfo)
                    console.log(userRes.data);




                    const userProfile = {
                        displayName: data.name,
                        photoURL: profilePic
                    }
                    updateUserProfile(userProfile)
                        .then(
                            () => {
                                console.log('profile name pic updated')
                            }
                        )
                        .catch(error => {
                            console.log(error)
                        })


                }
            )
            .catch(
                error => {
                    console.error(error);
                }
            )
    }

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        console.log(image)
        const formData = new FormData();
        formData.append('image', image);
        const imageURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`
        const res = await axios.post(imageURL, formData)
        setProfilePic(res.data.data.url);


    }

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col ">
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <fieldset className="fieldset">
                                <h1 className="text-5xl font-bold">Creat an Account now</h1>




                                {/* Name field */}
                                <label className="label">Your Name</label>
                                <input type="text" {...register('name', { required: true })} className="input" placeholder="Your Name" />
                                {
                                    errors.email?.type === 'required' &&
                                    <p className='text-red-500' >Name is required</p>
                                }

                                {/* File field */}
                                <label className="label">Your Photo</label>
                                <input type="file"
                                    onChange={handleImageUpload}
                                    className="input" placeholder="Your Profile Picture" />



                                {/* Email field */}
                                <label className="label">Email</label>
                                <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                                {
                                    errors.email?.type === 'required' &&
                                    <p className='text-red-500' >Email is required</p>
                                }




                                {/* Password field */}
                                <label className="label">Password</label>
                                <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Password" />
                                {
                                    errors.password?.type === 'minLength' &&
                                    <p> Password must be 6 characters minimum. </p>
                                }


                                <div><a className="link link-hover">Already have an account?</a></div>
                                <Link to='/login' > Login </Link>
                                <button className="btn btn-neutral mt-4" disabled={!profilePic} >Register</button>
                            </fieldset>
                        </form>
                        <SocialLogin></SocialLogin>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;