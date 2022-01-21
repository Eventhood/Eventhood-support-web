import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Table, Card, Form, FormControl, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GetAuthUser, IsSignedIn, UploadImage } from '../Services/FirebaseService';
import env from 'react-dotenv';

export default function ManageStaffComponent() {

    const [ staff, setStaff ] = useState([]);
    const [ positions, setPositions ] = useState([]);
    const [ resultMessage, setResultMessage ] = useState();

    let navigate = useNavigate();

    useEffect(() => {
        if (!IsSignedIn()) {
            navigate('/login');
        } else {

            fetch(`${env.STAFF_API_URL}api/positions`).then((pos) => {
                return pos.json();
            }).then((data) => {
                setPositions(data.data);
            }).catch((err) => console.log(err));

            fetch(`${env.STAFF_API_URL}api/staff`).then((user) => {
                return user.json();
            }).then((staffList) => {
                setStaff(staffList.data);
            }).catch((err) => { console.log(err); });

        }
    }, []);

    useEffect(() => {
        console.log("Staff Updated");
    }, [ staff ]);

    useEffect(() => {
        console.log("Positions Updated");
    }, [ positions ]);

    const handleCreateStaffUser = (e) => {
        e.preventDefault();
        
        const { name, email, password, position, photo } = e.target.elements

        let objToSend = {
            displayName: name.value,
            email: email.value,
            photoURL: photo.value,
            password: password.value
        }

        fetch(`${env.STAFF_API_URL}api/staff/account`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accountObject: objToSend,
                position: position.value
            })
        }).then((data) => {
            return data.json();
        }).then((user) => {
            console.log(user);
            
            let staffDupe = staff;
            staffDupe.push(user.data);

            setStaff(staffDupe);

            e.target.reset();
        }).catch((err) => console.log(err));

    }

    const handleCreatePosition = (e) => {
        e.preventDefault();
        
        const { accessPermission, title } = e.target.elements;

        fetch(`${env.STAFF_API_URL}api/positions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                positionData: {
                    accessPermission: accessPermission.value,
                    title: title.value
                }
            })
        }).then((data) => {
            return data.json();
        }).then((result) => {
            if (!result.error) {
                setResultMessage(result.message);

                let dupPos = positions;
                dupPos.push(result.data);

                setPositions(dupPos);

                e.target.reset();
            }
        }).catch((err) => {
            setResultMessage(err);
        });
    }

    return (
        <Container fluid className="mt-4 fs-6">
            <Row>
                <Col sm={12} md={8} className="text-start">
                    <p className="fs-1" style={{marginBottom: "0rem"}}>Staff List</p>
                    <p className="text-muted fs-6">All staff members are listed below.</p>

                    <Table striped bordered variant="dark" style={{verticalAlign: "middle"}}>
                        <thead>
                            <tr>
                                <th style={{width: "50px"}}></th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                staff.length > 0 ? staff.map((s) => {
                                    return <tr>
                                        <td style={{width: "50px"}}><Image rounded src={s.photo} width={50} height={50}/></td>
                                        <td>{s.name}</td>
                                        <td>{s.email}</td>
                                        <td>{s.position.title}</td>
                                    </tr>
                                }) : <tr><td>There are currently no staff accounts.</td></tr>
                            }
                        </tbody>
                    </Table>
                </Col>
                <Col sm={12} md={4} className="text-start">
                    <div className="text-end">
                        <p className="fs-1" style={{marginBottom: "0rem"}}>Staff Controls</p>
                        <p className="text-muted fs-6">The below controls can be used to manage staff members.</p>
                        <p className="fs-6 text-success font-monospace">{resultMessage}</p>
                    </div>

                    <Card bg="dark" text="white" className="mb-3">
                        <Card.Header className="fs-4">Create New Position</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleCreatePosition}>
                            <Form.Group className="mb-3">
                                    <Form.Label className="fs-4 w-100">
                                        <Container fluid style={{padding: "0px 16px"}}>
                                            <Row>
                                                <Col style={{padding: "0"}}>
                                                    <span>Title</span>
                                                </Col>
                                                <Col style={{padding: "0"}} className="text-end">
                                                    <span className="text-danger font-monospace" style={{fontSize: "0.8rem"}}>Required</span>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Form.Label>
                                    <FormControl className="darkForm" type="text" name="title" placeholder="The name of the position title." required/>
                                    <Form.Text>The position title must be entirely unique.</Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fs-4 w-100">
                                        <Container fluid style={{padding: "0px 16px"}}>
                                            <Row>
                                                <Col style={{padding: "0"}}>
                                                    <span>Permission Level</span>
                                                </Col>
                                                <Col style={{padding: "0"}} className="text-end">
                                                    <span className="text-danger font-monospace" style={{fontSize: "0.8rem"}}>Required</span>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Form.Label>
                                    <FormControl className="darkForm" type="number" min={0} name="accessPermission" placeholder="The numerical permission number for the new position." required/>
                                    <Form.Text>This affects which pages in the staff panel can be accessed by users with this position.</Form.Text>
                                </Form.Group>

                                <Button type="submit" variant="primary" className="w-100">Create Position</Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card bg="dark" text="white" className="mb-3">
                        <Card.Header className="fs-4">
                            Create New Staff Account
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleCreateStaffUser}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fs-4 w-100">
                                        <Container fluid style={{padding: "0px 16px"}}>
                                            <Row>
                                                <Col style={{padding: "0"}}>
                                                    <span>Name</span>
                                                </Col>
                                                <Col style={{padding: "0"}} className="text-end">
                                                    <span className="text-danger font-monospace" style={{fontSize: "0.8rem"}}>Required</span>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Form.Label>
                                    <FormControl className="darkForm" type="text" name="name" placeholder="The staff member's real name." required/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fs-4 w-100">
                                        <Container fluid style={{padding: "0px 16px"}}>
                                            <Row>
                                                <Col style={{padding: "0"}}>
                                                    <span>Email</span>
                                                </Col>
                                                <Col style={{padding: "0"}} className="text-end">
                                                    <span className="text-danger font-monospace" style={{fontSize: "0.8rem"}}>Required</span>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Form.Label>
                                    <FormControl className="darkForm" type="email" name="email" placeholder="staff.name@domain.ca" required/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fs-4 w-100">
                                        <Container fluid style={{padding: "0px 16px"}}>
                                            <Row>
                                                <Col style={{padding: "0"}}>
                                                    <span>Password</span>
                                                </Col>
                                                <Col style={{padding: "0"}} className="text-end">
                                                    <span className="text-danger font-monospace" style={{fontSize: "0.8rem"}}>Required</span>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Form.Label>
                                    <FormControl className="darkForm" type="password" name="password" placeholder="The desired account password." required/>
                                    <Form.Text>Password must be a minimum of six characters long.</Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fs-4 w-100">
                                        <Container fluid style={{padding: "0px 16px"}}>
                                            <Row>
                                                <Col style={{padding: "0"}}>
                                                    <span>Position</span>
                                                </Col>
                                                <Col style={{padding: "0"}} className="text-end">
                                                    <span className="text-danger font-monospace" style={{fontSize: "0.8rem"}}>Required</span>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Form.Label>
                                    <Form.Select className="darkForm" name="position" required>
                                        {
                                            positions.map((pos) => {
                                                return <option value={pos._id}>{pos.title}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text>Leave as the default to use the default profile image.</Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fs-4 w-100">
                                        <Container fluid style={{padding: "0px 16px"}}>
                                            <Row>
                                                <Col style={{padding: "0"}}>
                                                    <span>Profile Image URL</span>
                                                </Col>
                                                <Col style={{padding: "0"}} className="text-end">
                                                    <span className="text-muted font-monospace" style={{fontSize: "0.8rem"}}>Optional</span>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Form.Label>
                                    <FormControl className="darkForm" type="text" name="photo" placeholder="The image URL of the desired profile photo." value='https://firebasestorage.googleapis.com/v0/b/theneighborhood-staff.appspot.com/o/Defaults%2FDefaultPfp.png?alt=media&token=a0765f92-395c-45bc-b902-123314c278c3' readOnly required/>
                                    <Form.Text>Leave as the default to use the default profile image.</Form.Text>
                                </Form.Group>

                                <Button type="submit" variant="primary" className="w-100">Create Staff User</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )

}