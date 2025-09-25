import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {auth } from '../../Firebase/firebase.init'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password)=>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signIn = (email, password)=>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);

    }

    const logOut = ()=>{
        setLoading(true);
        return signOut (auth);
    }

    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, currentUser=>{
            setUser(currentUser);
            setLoading(false);
        } );
        return() =>{
            unSubscribe();
        }
    },[])

    const authInfo={
        createUser,
        signIn,
        logOut,
        user,
        loading

    }



    return (
        <div>
            <AuthContext value={authInfo} >
                {children}
            </AuthContext>
        </div>
    );
};

export default AuthProvider;