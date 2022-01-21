import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { GetCurrentUser, IsSignedIn, Logout } from '../Services/FirebaseService';

export default function NavigationComponent() {

    const [ user, setUser ] = useState(null);

    let navigate = useNavigate();

    let signOutOfAccount = () => {
        Logout();
        navigate('/login');
    }

    useEffect(() => {
        if (IsSignedIn()) {

            GetCurrentUser().then((userObj) => {
                setUser(userObj)
            });

        }
    }, [])

    useEffect(() => {
        console.log(user);
    }, [user]);

    if (IsSignedIn()) {
        return (
            <>
                <Nav.Link><Link to="/home" className="navLink">Home</Link></Nav.Link>
                <Nav.Link><Link to="/add" className="navLink">Add Database Data</Link></Nav.Link>
                {
                    user?.position?.position?.accessPermission >= 255 ? <Nav.Link><Link to="/managestaff" className="navLink">Manage Staff</Link></Nav.Link> : null
                }
                <Nav.Link onClick={signOutOfAccount}><Link to="/login" className="navLink">Logout</Link></Nav.Link>
            </>
        )
    }
    else {
        return <Nav.Link><Link to="/login" className="navLink">Login</Link></Nav.Link>
    }

}