import { useI18n } from '@solid-primitives/i18n';
import { Button, Modal } from 'solid-bootstrap';
import { Accessor, Component, createEffect, createSignal, JSX, Setter } from 'solid-js';

interface ModalComponentProps {
    header: string;
    children: JSX.Element | JSX.Element[];
    onOpen: Accessor<boolean>;
    setOnOpen: Setter<boolean>;
    sumbit: () => void;
}

const ConfirmModel: Component<ModalComponentProps> = (props) => {
    const [t, { locale }] = useI18n();

    const [show, setShow] = createSignal(false);

    const handleOpen = () => setShow(true);

    const handleClose = () => {
        setShow(false);
        props.setOnOpen(false);
    };

    const handleSubmit = () => {
        props.sumbit();
        setShow(false);
        props.setOnOpen(false);
    };

    createEffect(() => {
        if (props.onOpen()) {
            handleOpen();
        }
    });

    return (
        <Modal
            show={show()}
            onHide={handleClose}
            classList={{ rtl: locale() === 'ar' }}
            // size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            // centered
        >
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>
                    {t(props.header)}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onclick={handleSubmit}>{t('ipaz_title_confirm')}</Button>
                <Button variant='danger' onClick={handleClose}>{t('ipaz_modal_close')}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModel;
