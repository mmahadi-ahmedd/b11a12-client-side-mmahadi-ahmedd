import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {auth } from '../../Firebase/firebase.init'
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';




const googleProvider = new GoogleAuthProvider();


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

    const signInWithGoogle = () =>{
        setLoading(true);
        signInWithPopup(auth, googleProvider);
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
        signInWithGoogle,
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