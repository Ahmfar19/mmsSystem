import { Col } from 'solid-bootstrap';
import { Component } from 'solid-js';

const LoadingComponent: Component = () => (
    <Col lg={12} md={12} sm={12} class='text-center'>
        <div class='spinner-border text-primary' role='status'>
            <span class='visually-hidden'>Loading...</span>
        </div>
    </Col>
);
export default LoadingComponent;
