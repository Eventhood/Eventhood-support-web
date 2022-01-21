import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, FormControl, InputGroup, ListGroup, Row, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { GetCurrentUser, IsSignedIn, SendPasswordReset } from '../Services/FirebaseService';

import { EnvelopeCheckFill, EnvelopeX, EnvelopeXFill, Person, PersonFill, ShieldFill, ShieldLockFill, ShieldShaded } from 'react-bootstrap-icons';

import '../index.css';

export default function HomeComponent(props) {

    const [ sendResetEmail, setSendResetEmail ] = useState(false);
    const [ showToast, setShowToast ] = useState(false);

    const [ user, setUser ] = useState(null);

    let loadUser = async () => {
        setUser(await GetCurrentUser());
    };

    let navigate = useNavigate();

    useEffect(() => {
        if (!IsSignedIn()) {
            navigate('/login');
        } else {

            loadUser();

        }
    }, []);

    let sendEmail = () => {
        SendPasswordReset();
        setShowToast(true);
        setSendResetEmail(true);
    }

    useEffect(() => {
    }, [ sendResetEmail ]);


    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h1>Dashboard</h1>
                    <p className='text-muted fs-4'>This is the staff panel dashboard. I'll put stuff here eventually, but for now this is just a landing page.</p>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col md={6} sm={12}>
                    <Card bg="dark" text="white" className="mb-5">
                        <Card.Header className="text-start">
                            Account Overview
                        </Card.Header>
                        <Card.Body className="text-start fs-5">
                            <ListGroup variant="flush">
                                <ListGroup.Item className='darker-list-item w-100 text-white'>
                                    <Container fluid>
                                        <Row>
                                            <Col md={11}>
                                                <span>{user?.firebaseUser?.email}</span>
                                            </Col>
                                            <Col md={1} className="text-end">
                                                {
                                                    user?.firebaseUser?.emailVerified ? <EnvelopeCheckFill/> : <EnvelopeXFill/>
                                                }
                                            </Col>
                                        </Row>
                                    </Container>
                                </ListGroup.Item>
                                <ListGroup.Item className='darker-list-item w-100 text-white'>
                                    <Container fluid>
                                        <Row>
                                            <Col md={11}>
                                                <span>
                                                    {
                                                        user?.firebaseUser?.displayName ? `${user?.firebaseUser?.displayName}` : <i>Display Name Not Set</i>
                                                    }
                                                </span>
                                            </Col>
                                            <Col md={1} className="text-end">
                                                <PersonFill/>
                                            </Col>
                                        </Row>
                                    </Container>
                                </ListGroup.Item>
                                <ListGroup.Item className='darker-list-item w-100 text-white'>
                                    <Container fluid>
                                        <Row>
                                            <Col md={11}>
                                                <span>
                                                    {
                                                        user?.position?.position?.title
                                                    }
                                                </span>
                                            </Col>
                                            <Col md={1} className="text-end">
                                                <ShieldLockFill/>
                                            </Col>
                                        </Row>
                                    </Container>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} sm={12}>
                    <h4>Quick Links</h4>

                    <hr style={{margin: "0.5rem auto", width: "33%"}}/>

                    <ListGroup variant="flush">
                        <ListGroup.Item className="w-75 dark-list-item"><Link to="/add"><Button className="w-75" variant="primary">Add Database Item</Button></Link></ListGroup.Item>
                        <ListGroup.Item className="w-75 dark-list-item"><Button className="w-75" variant={sendResetEmail ? "secondary" : "primary"} onClick={sendEmail} disabled={sendResetEmail}>Reset Password</Button></ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ToastContainer position="bottom-start">
                        <Toast onClose={() => setShowToast(false) } show={showToast} delay={4000} autohide bg="dark" className="m-3">
                            <Toast.Header>
                                <strong className="me-auto">Password Reset Sent</strong>
                                <small>Now</small>
                            </Toast.Header>
                            <Toast.Body>
                                <span>A password reset link has been sent to the email address associated with your account.</span>
                            </Toast.Body>
                        </Toast>
                    </ToastContainer>
                </Col>
            </Row>
        </Container>
    )

}