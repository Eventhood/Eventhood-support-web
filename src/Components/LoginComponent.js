import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, FormControl, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LoginWithEmail } from '../Services/FirebaseService';

export default function LoginComponent(props) {
    const [ error, setError ] = useState();

    let navigate = useNavigate();
    useEffect(() => {
        let token = sessionStorage.getItem('authToken');

        if (token) {
            navigate('/home');
        }
    }, []);

    let handleSubmit = (e) => {
        e.preventDefault();
        
        const { email, password } = e.target.elements;
        
        LoginWithEmail(email.value, password.value).then((result) => {
            if (result.success) {
                setError(null);
                navigate('/home');
            } else {
                setError(result.error);
            }
        }).catch((err) => {
            setError(err);
        });

    }

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <Card bg="dark" text="white">
                        <Card.Header style={{textAlign: "start"}}>Staff Panel Login</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit} style={{textAlign: "start"}}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fs-4">Email Address</Form.Label>
                                    <FormControl className="darkForm" type="email" name="email" placeholder="name@domain.ca" required/>
                                    <Form.Text className="text-muted fs-6">You must use your 'The Neighborhood' staff email.</Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fs-4">Password</Form.Label>
                                    <FormControl className="darkForm" type="password" name="password" placeholder="Password" required/>
                                </Form.Group>
                                <span className="text-danger fs-6">{error}</span>
                                <Button variant="primary" type="submit" className="w-100">Login</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}