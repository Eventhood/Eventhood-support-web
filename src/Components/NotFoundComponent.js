import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export default class NotFoundComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h1>Uh-oh!</h1>
                        <h4>The page that you're looking for doesn't exist!</h4>
                    </Col>
                </Row>
            </Container>
        );
    }

}