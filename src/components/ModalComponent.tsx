import { useI18n } from '@solid-primitives/i18n';
import { Button, Modal } from 'solid-bootstrap';
import { Accessor, Component, createEffect, createSignal, JSX, Setter, Show } from 'solid-js';

interface ModalComponentProps {
    header: string;
    children: JSX.Element | JSX.Element[];
    onOpen: Accessor<boolean>;
    setOnOpen: Setter<boolean>;
    editMode: Accessor<boolean>;
    setEditMode: Setter<boolean>;
    validate?: Function;
    sumbit: (ediit: boolean) => void;
}

const ModalComponent: Component<ModalComponentProps> = (props) => {
    const [t, { locale }] = useI18n();

    const [show, setShow] = createSignal(false);

    const handleOpen = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        props.setOnOpen(false);
        props.setEditMode(false);
    };

    const handleSubmit = (mode: boolean) => {
        if (typeof props.validate === 'function') {
            if (!props.validate()) return;
        }
        props.sumbit(mode);
        setShow(false);
        props.setOnOpen(false);
        props.setEditMode(false);
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
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            // centered
            classList={{ rtl: locale() === 'ar' }}
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
                <Show
                    when={props.editMode()}
                    fallback={
                        <Button
                            variant='primary'
                            onClick={() => handleSubmit(false)}
                        >
                            {t('ipaz_title_save')}
                        </Button>
                    }
                >
                    <Button variant='success' onClick={() => handleSubmit(true)}>{t('ipaz_buttonTooltip_edit')}</Button>
                </Show>

                <Button variant='secondary' onClick={handleClose}>{t('ipaz_modal_close')}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalComponent;
