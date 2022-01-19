import { browserLocalPersistence, getAuth, setPersistence } from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useState, useEffect, useContext, createContext } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialise the Firebase app object.
export const firebaseApp = initializeApp({
    apiKey: "AIzaSyBGiziD2o_rFvmuS2TdpOELg4aLs0dun6U",
    authDomain: "theneighborhood-staff.firebaseapp.com",
    projectId: "theneighborhood-staff",
    storageBucket: "theneighborhood-staff.appspot.com",
    messagingSenderId: "1044239785614",
    appId: "1:1044239785614:web:b36919729355331938b3df"
  });

setPersistence(getAuth(), browserLocalPersistence).then(() => null).catch(err => {
    console.log(`There was a problem updating the app's authentication persistence.`);
});

// Firebase helper functions.
export const LoginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(getAuth(), email, password).then((userCredential) => {
        sessionStorage.setItem('authToken', userCredential.user.refreshToken);
        return { success: true };
    }).catch(err => {
        return { success: false, error: parseErrorMessage(err.code) };
    });
};

export const Logout = () => {
    signOut(getAuth());
    sessionStorage.removeItem('authToken');
};

// Storage Helper Functions
export const UploadImage = async (image, directory) => {
    const storage = getStorage();
    const imageRef = ref(storage, `${directory}/${image.name}`);

    return uploadBytes(imageRef, image).then((snapshot) => {
        return getDownloadURL(imageRef).then((url) => {
            return { success: true, imageURL: url };
        }).catch((err) => {
            console.log(err);
            return { success: false, error: parseErrorMessage(err.code) };
        })
    }).catch((err) => {
        console.log(err);
        return { success: false, error: parseErrorMessage(err.code) };
    })
}

// Generic Helper Functions
export const parseErrorMessage = (errorCode) => {
    let errorMessage = undefined;

    switch(errorCode) {
        case 'auth/user-not-found':
            errorMessage = "There is no account registered with that email address.";
            break;
        case 'auth/wrong-password':
            errorMessage = "The password you have entered is incorrect.";
            break;
        case 'auth/user-disabled':
            errorMessage = "The account with the provided credentials is currently banned.";
            break;
        case 'auth/weak-password':
            errorMessage = "The password entered is too weak.";
            break;
        default:
            errorMessage = "An unknown error has occurred.";
            break;
    }

    return errorMessage;
}