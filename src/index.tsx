/* eslint-disable import/extensions */
import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';
import App from './App';

// Lib
import 'bootstrap';
// import * as bootstrap from 'bootstrap'

// css
import './index.css';
import './assets/spinner.css';

const root = document.getElementById('Application');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    );
}

render(() => (
    <Router>
        <App />
    </Router>
), root as HTMLElement);
