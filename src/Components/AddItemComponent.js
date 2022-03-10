import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, FormControl, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UploadImage } from '../Services/FirebaseService';
import env from 'react-dotenv';

const dataTypes = [
    {
        name: 'User',
        id: 'user',
        urlExtension: 'api/users',
        reqName: 'userData',
        fields: [
            {
                name: 'uuid',
                type: 'text',
                placeholder: 'Firebase UUID',
                label: 'Firebase UUID',
                required: true
            },
            {
                name: 'displayName',
                type: 'text',
                placeholder: 'Account Display Name',
                label: 'Display Name',
                required: true
            },
            {
                name: 'accountHandle',
                type: 'text',
                placeholder: '@AccountHandle',
                label: 'Account Handle',
                required: true
            },
            {
                name: 'photoURL',
                type: 'text',
                placeholder: 'Profile Picture URL',
                label: 'Profile Picture',
                required: true
            },
            {
                name: 'email',
                type: 'email',
                placeholder: 'name@domain.com',
                label: 'Email',
                required: true
            }
        ]
    },
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
                type: 'select',
                selectData: {
                    property: 'users',
                    text: 'accountHandle',
                    value: '_id'
                },
                label: 'Host',
                required: true,
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
                type: 'select',
                selectData: {
                    property: 'eventCategories',
                    text: 'name',
                    value: '_id'
                },
                label: 'Event Category',
                required: true,
            },
            {
                name: 'maxParticipants',
                type: 'number',
                placeholder: 'Maximum number of users who can register for the event.',
                label: 'Maximum Participants',
                required: false,
                min: 0,
                subText: 'Leave blank or set to zero if you want the event to have no maximum number of participants.'
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
    },
    {
        name: "Event Report",
        id: "eventReport",
        reqName: "reportData",
        urlExtension: "api/eventreports",
        fields: [
            {
                name: 'event',
                type: 'select',
                selectData: {
                    property: 'events',
                    text: 'name',
                    value: '_id'
                },
                label: 'Event',
                required: true
            },
            {
                name: 'reportedBy',
                type: 'select',
                selectData: {
                    property: 'users',
                    text: 'accountHandle',
                    value: '_id'
                },
                label: 'Reported By',
                required: true
            },
            {
                name: 'topic',
                type: 'select',
                selectData: {
                    property: 'reportTopics',
                    text: 'name',
                    value: '_id'
                },
                label: 'Topic',
                required: true
            },
            {
                name: 'reason',
                type: 'text',
                placeholder: 'The reason for reporting this event.',
                label: 'Reason',
                required: true
            }
        ]
    },
    {
        name: 'Event Registration',
        id: 'eventRegistration',
        reqName: "registrationData",
        urlExtension: "api/eventregistrations",
        fields: [
            {
                name: 'event',
                type: 'select',
                selectData: {
                    property: 'events',
                    value: '_id',
                    text: 'name'
                },
                label: 'Event',
                required: true
            },
            {
                name: 'user',
                type: 'select',
                selectData: {
                    property: 'users',
                    value: '_id',
                    text: 'accountHandle'
                },
                label: 'User',
                required: true
            }
        ]
    },
    {
        name: 'FAQ Topic',
        id: 'faqTopic',
        reqName: 'faqTopicData',
        urlExtension: 'api/FAQTopics',
        fields: [
            {
                name: 'name',
                type: 'text',
                label: 'Topic Name',
                placeholder: 'The name of the FAQ topic.',
                required: true
            }
        ]
    },
    {
        name: 'FAQ Question',
        id: 'faqQuestion',
        reqName: 'faqQuestionData',
        urlExtension: 'api/FAQQuestions',
        fields: [
            {
                name: 'topic',
                type: 'select',
                label: 'Question Topic',
                selectData: {
                    property: 'faqTopics',
                    text: 'name',
                    value: '_id'
                },
                required: true
            },
            {
                name: 'question',
                type: 'text',
                label: 'Question',
                placeholder: 'The question text to be displayed.',
                required: true
            },
            {
                name: 'answer',
                type: 'text',
                label: 'Answer',
                placeholder: 'The answer to the question.',
                required: true
            }
        ]
    }/*,
    {
        name: '',
        id: '',
        reqName: '',
        urlExtension: '',
        fields: [
            {
                name: '',
                type: '',
                label: '',
                placeholder: '',
                required: true
            }
        ]
    }*/
];

const apiRoutes = [
    {
        name: 'users',
        route: 'api/users'
    },
    {
        name: 'events',
        route: 'api/events'
    },
    {
        name: 'reportTopics',
        route: 'api/reporttopics'
    },
    {
        name: 'eventCategories',
        route: 'api/eventcategories'
    },
    {
        name: 'faqTopics',
        route: 'api/FAQTopics'
    }
];

var loadedData = {};

async function loadData() {

    for (const dataRoute in apiRoutes) {
        
        await fetch(`${env.API_URL}${apiRoutes[dataRoute].route}`).then((result) => {
            return result.json();
        }).then((response) => {
            if (response.data) {
                loadedData[apiRoutes[dataRoute].name] = response.data;
            } else {
                loadedData[apiRoutes[dataRoute].name] = [];
            }
        }).catch((err) => {
            alert(err);
        });

    }

}

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
        } else {

            loadData();

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
        let form = <Card bg="dark" text="white" className="mb-5">
            <Card.Header style={{textAlign: "start"}}>Adding New {type.name}</Card.Header>
            <Card.Body>
                <Form onSubmit={(e) => handleSubmit(e, type.id)} style={{textAlign: "start"}}>
                    {
                        type.fields.map((field) => {
                            if (field.type !== 'select') {
                                return <Form.Group className="mb-3">
                                    <Form.Label className="fs-4 w-100">
                                        <Container fluid style={{padding: '0px 16px'}}>
                                            <Row>
                                                <Col style={{padding: '0'}}>
                                                    <span>{field.label}</span>
                                                </Col>
                                                <Col style={{padding: '0'}} className="text-end">
                                                    { field.required ? <span className="text-danger font-monospace" style={{fontSize: '0.8rem'}}>Required</span> : <span className="text-muted font-monospace" style={{fontSize: '0.8rem'}}>Optional</span> }
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Form.Label>
                                    <FormControl className="darkForm" type={field.type} name={field.name} placeholder={field.placeholder} required={field.required}/>
                                    <Form.Text className="text-muted fs-6">{field.subText}</Form.Text>
                                </Form.Group>;
                            } else {

                                return <Form.Group className="mb-3">
                                    <Form.Label className="fs-4 w-100">
                                        <Container fluid style={{padding: '0px 16px'}}>
                                            <Row>
                                                <Col style={{padding: '0'}}>
                                                    <span>{field.label}</span>
                                                </Col>
                                                <Col style={{padding: '0'}} className="text-end">
                                                    { field.required ? <span className="text-danger font-monospace" style={{fontSize: '0.8rem'}}>Required</span> : null }
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Form.Label>
                                    <Form.Select className="darkForm" name={field.name} required={field.required}>
                                        {
                                            loadedData[field.selectData.property].map((dataRow) => {
                                                return <option value={dataRow[field.selectData.value]}>{field.selectData.property === 'users' && field.selectData.text === 'accountHandle' ? '@' : null}{dataRow[field.selectData.text]}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-muted fs-6">{field.subText}</Form.Text>
                                </Form.Group>

                            }
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