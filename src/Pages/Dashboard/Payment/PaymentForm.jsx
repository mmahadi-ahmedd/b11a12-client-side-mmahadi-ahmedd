import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const{reqId} = useParams();
    console.log(reqId);
    const [error, setError] = useState('');
    const axiosSecure = useAxiosSecure();

    const {} = useQuery({
        queryKey:[ 'charityRequests', reqId ],
        queryFn: async () =>{
            const res = await axiosSecure.get(`api/charityrequests/${reqId}`);
            return res.data;    
        }
    })

    


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (!card) {
            return;
        }


        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            setError(error.message);
        } else {
            setError('');
            console.log('payment method', paymentMethod);
        }


    }


    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto " >
                <CardElement className="p-2 border rounded" >

                </CardElement>
                <button type='submit'
                    className="btn btn-primary w-full"
                    disabled={!stripe} >
                    Pay For Charity Role
                </button>
                {
                    error && <p className='text-red-500' >{error}</p>
                }
            </form>
        </div>
    );
};

export default PaymentForm;