import { useI18n } from '@solid-primitives/i18n';
import { Spinner } from 'solid-bootstrap';
import { Component, onCleanup, onMount } from 'solid-js';

const SpinnerComponent: Component = () => {
    const [t] = useI18n();

    onMount(() => {
        document.body.classList.add('no-scroll');
    });

    onCleanup(() => {
        document.body.classList.remove('no-scroll');
    });

    return (
        <div class='overlay'>
            <div class='loader' />
            <div class='spanner show'>
                <Spinner animation='border' role='status' />
                <div class='loading-text'>
                    {/* {t('ipaz_spinner_loading')} */}
                </div>
            </div>
        </div>
    );
};

export default SpinnerComponent;
