import React, { useEffect } from 'react';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export default function HomeComponent(props) {

    
    let navigate = useNavigate();

    useEffect(() => {
        let token = sessionStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        }
    }, []);

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h1>Dashboard</h1>
                    <p className='text-muted fs-4'>This is the staff panel dashboard. I'll put stuff here eventually, but for now this is just a landing page.</p>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col md={6}>
                    <h4>Quick Links</h4>

                    <hr style={{margin: "0.5rem auto", width: "33%"}}/>

                    <ListGroup variant="flush">
                        <ListGroup.Item style={{backgroundColor: "rgb(40, 44, 52)"}}><Link to="/add"><Button variant="primary">Add Database Item</Button></Link></ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )

}