import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, FormControl, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UploadImage } from '../Services/FirebaseService';
import env from 'react-dotenv';

const dataTypes = [
    {
        name: "Event Category",
        id: "eventCategory",
        urlExtension: "api/eventcategories",
        reqName: 'categoryData',
        fields: [
            {
                name: 'name',
                type: 'text',
                placeholder: 'Sports',
                label: 'Category Name',
                required: true
            },
            {
                name: 'header',
                type: 'file',
                imageDirectory: 'EventCategoryHeaders',
                label: 'Header Image',
                required: true
            }
        ]
    },
    {
        name: "Support Topic",
        id: "supportTopic",
        reqName: 'topicData',
        urlExtension: "api/supporttopics",
        fields: [
            {
                name: 'name',
                type: 'text',
                placeholder: 'Support Topic Name',
                label: 'Topic Name',
                required: true
            }
        ]
    },
    {
        name: "Event Report Topic",
        id: "reportTopic",
        reqName: "topicData",
        urlExtension: "api/reporttopics",
        fields: [
            {
                name: 'name',
                type: 'text',
                placeholder: 'Inappropriate, Duplicate, etc...',
                label: 'Topic Name',
                required: true
            }
        ]
    },
    {
        name: "Event",
        id: "event",
        reqName: "eventData",
        urlExtension: "api/events",
        fields: [
            {
                name: 'host',
                type: 'text',
                placeholder: 'User ObjectId',
                label: 'Host Id',
                required: true,
                subText: 'Must be a valid MongoDB ObjectId.'
            },
            {
                name: 'name',
                type: 'text',
                placeholder: 'Enter event name...',
                label: 'Event Name',
                required: true
            },
            {
                name: 'location',
                type: 'text',
                placeholder: '290 Bremner Blvd, Toronto, ON M5V 3L9',
                label: 'Event Location',
                required: true,
                subText: 'Must be a valid street address.'
            },
            {
                name: 'category',
                type: 'text',
                placeholder: 'Event Category ObjectId',
                label: 'Event Category',
                required: true,
                subText: 'Must be a valid MongoDB ObjectId.'
            },
            {
                name: 'maxParticipants',
                type: 'number',
                placeholder: 'Maximum number of users who can register for the event.',
                label: 'Maximum Participants',
                required: false,
                min: 0,
                subText: 'Leave at zero if you want the event to have no maximum number of participants.'
            },
            {
                name: 'description',
                label: 'Event Description',
                type: 'text',
                placeholder: 'Describe the new event.',
                required: true,
            },
            {
                name: 'startTime',
                label: 'Start Time',
                type: 'datetime-local',
                required: true,
                subText: 'This should reflect the starting time of the event, on the hosting date.'
            }
        ]
    }
];

async function handleUpload(file, directory) {
    return new Promise((resolve, reject) => {
        UploadImage(file, directory).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

export default function AddItemComponent() {
    const [ form, setForm ] = useState();
    const [ resultMessage, setResultMessage ] = useState();

    let navigate = useNavigate();
    useEffect(() => {
        let token = sessionStorage.getItem('authToken');

        if (!token) {
            navigate('/login');
        }
    }, []);

    let handleSubmit = async (e, id) => {
        e.preventDefault();

        const dataType = dataTypes.filter((type) => type.id === id)[0];
        let requestData = {};

        requestData[dataType.reqName] = {};
        for (const field of dataType.fields) {
            if (field.type !== "file") {
                requestData[dataType.reqName][field.name] = e.target.elements[field.name].value;
            } else {
                const image = e.target.elements[field.name].files[0];
                let newImage = new File([image], `${dataType.id}-${Math.round(Date.now() / 1000)}`, { type: image.type });

                let data = await handleUpload(newImage, `${dataType.id}Images`);
                if (data.success) {
                    requestData[dataType.reqName][field.name] = data.imageURL;
                } else {
                    alert(`There was a problem uploading the image!`);
                }
            }
        }

        fetch(`${env.API_URL}${dataType.urlExtension}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        }).then((data) => {
            return data.json();
        }).then((result) => {
            if (!result.error) {
                setResultMessage(result.message);

                e.target.reset();
            }
        }).catch((err) => {
            setResultMessage(err);
        });
        
    }

    let buildForm = (id) => {
        let type = dataTypes.filter(elem => elem.id === id)[0];
        let form = <Card bg="dark" text="white">
            <Card.Header style={{textAlign: "start"}}>Adding New {type.name}</Card.Header>
            <Card.Body>
                <Form onSubmit={(e) => handleSubmit(e, type.id)} style={{textAlign: "start"}}>
                    {
                        type.fields.map((field) => {
                            return <Form.Group className="mb-3">
                                <Form.Label className="fs-4">{field.label}</Form.Label>
                                <FormControl className="darkForm" type={field.type} name={field.name} placeholder={field.placeholder} required={field.required}/>
                                <Form.Text className="text-muted fs-6">{field.subText}</Form.Text>
                            </Form.Group>;
                        })
                    }

                    <Button variant="primary" type="submit" className="w-100">Submit</Button>
                </Form>
            </Card.Body>
        </Card>;

        setForm(form);
    }

    return (
        <Container className="mt-5">
            <Row className="mb-5">
                <Col>
                    <h1 className="fs-3 mb-4">Data Type to Add</h1>
                    <Container fluid>
                        <Row>
                            {
                                dataTypes.map((dataType) => {
                                    return <Col key={dataType.id} sm={12} md={4}><Button variant="primary" onClick={() => { buildForm(dataType.id); }} className="w-100 mb-3">{dataType.name}</Button></Col>
                                })
                            }
                        </Row>
                    </Container>
                </Col>
            </Row>
            <Row id="formRow">
                <Col>
                    <div style={{textAlign: "end"}} className="w-100"><span className="text-success fs-5">{resultMessage}</span></div>
                    {form}
                </Col>
            </Row>
        </Container>
    )
}