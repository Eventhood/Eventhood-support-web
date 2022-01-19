import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Logout } from '../Services/FirebaseService';

export default function NavigationComponent() {

    let navigate = useNavigate();

    let signOutOfAccount = () => {
        Logout();
        navigate('/login');
    }

    const token = sessionStorage.getItem('authToken');
    if (token) {
        return (
            <>
                <Nav.Link><Link to="/home" className="navLink">Home</Link></Nav.Link>
                <Nav.Link><Link to="/add" className="navLink">Add Data</Link></Nav.Link>
                <Nav.Link onClick={signOutOfAccount}><Link to="/login" className="navLink">Logout</Link></Nav.Link>
            </>
        )
    }
    else {
        return <Nav.Link><Link to="/login" className="navLink">Login</Link></Nav.Link>
    }

}