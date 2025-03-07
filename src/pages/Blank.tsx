/* eslint-disable arrow-body-style */
import { Component } from 'solid-js';
import { setCollapseName } from '../components/SidebarComponent';

const Blank: Component = () => {
    setCollapseName({ collapse: 'blank', page: 'blank' });

    return (
        <>
            <h2>
                This is the blank page
            </h2>
        </>
    );
};

export default Blank;
