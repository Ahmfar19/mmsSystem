import { useI18n } from '@solid-primitives/i18n';
import { Button, Card, Col, Form, Row, Table } from 'solid-bootstrap';
import { Accessor, Component, createEffect, createResource, createSignal, For, Setter } from 'solid-js';
import { getData, postData, updateData } from '../utils/api';
import { applicationType } from '../utils/dataStore';
import { calculateDateAfter10Years, createNote, getDate } from '../utils/functions';
import showToast from '../utils/ToastMessage';
import ModalComponent from './ModalComponent';
import { setNewNote } from './NotesComponent';

const ApplicationComponent: Component<{
    mark: Accessor<Record<string, string>>;
    setMarkValue: Setter<any>;
}> = (props) => {
    const [t, { locale }] = useI18n();
    let appFormElement: HTMLFormElement;

    const [editMode, setEditMode] = createSignal<boolean>(false);

    const [applications, { mutate: mutateApp }] = createResource(
        () => props.mark().mark_id,
        (mark_id) => getData('table', 'application', `mark_id=${mark_id}`),
    );

    const [validated, setValidated] = createSignal(false);
    const [openNewApp, setOpenNewApp] = createSignal<boolean>(false);

    const [appValues, setAppValues] = createSignal<any>({});
    const [markUpdate, setMarkUpdate] = createSignal<any>({});

    const handleValidate = (form: HTMLFormElement) => {
        setValidated(true);
        return form.checkValidity();
    };

    createEffect(() => {
        if (openNewApp()) {
            setAppValues({});
        }
    });

    async function submitNewApplication() {
        setAppValues(signalValues => ({
            ...signalValues,
            mark_id: props.mark().mark_id,
            staff_id: 1,
            type_id: 2,
        }));
        setMarkUpdate(signalValues => ({
            ...signalValues,
            mark_id: props.mark().mark_id,
            protection_end: calculateDateAfter10Years(props.mark().protection_end),
        }));

        const values = appValues();

        const { error, id } = await postData(appValues(), 'table', 'application');

        if (error) {
            showToast({ message: t('ipaz_alert_fail_addApp'), type: 'error' });
        } else {
            showToast({ message: t('ipaz_alert_success_addApp'), type: 'success' });
            values.application_id = id;
            mutateApp((prevApp) => [...prevApp, values]);

            const notTitle = (applicationType()![Number(values.type_id) - 1])?.type_name
                ?? t('ipaz_note_marApplicationkRenew');

            const newNote = await createNote(
                props.mark().mark_id,
                notTitle,
                getDate(),
                t('ipaz_note_marApplicationkRegisterdDone') + ` (${values?.custom_app_id})`,
            );

            if (newNote) {
                setNewNote(newNote);
            }

            updateMark();
            setAppValues({});
            setValidated(false);
        }
    }

    function handleNewApplicationChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const { name, value, type }: { name: string; value: string | number; type: string } = target;
        setAppValues(signalValues => ({
            ...signalValues,
            [name]: type === 'number' ? +value : value,
        }));
    }

    async function updateMark() {
        const { error } = await updateData('table', markUpdate().mark_id, markUpdate(), 'mark');
        if (error) {
            showToast({ message: t('ipaz_alert_fail_editData'), type: 'error' });
        } else {
            showToast({ message: t('ipaz_alert_success_editData'), type: 'default' });
            const newValues = markUpdate();
            props.setMarkValue(signalValues => ({
                ...signalValues,
                ...newValues,
            }));
        }
    }

    return (
        <>
            <Card>
                <Card.Header class='card-title h5'>{t('ipaz_mark_managPage_Applicaions')}</Card.Header>
                <Card.Body
                    classList={{ 'rtl': locale() === 'ar' }}
                >
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>{t('ipaz_mark_managPage_applicaionType')}</th>
                                <th>{t('ipaz_mark_applicationId')}</th>
                                <th>{t('ipaz_mark_applicationDate')}</th>
                                <th>{t('ipaz_mark_certificate_number')}</th>
                                <th>{t('ipaz_mark_certificate_date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={applications()}>
                                {(app) => (
                                    <tr>
                                        <td>
                                            {(applicationType()![Number(app.type_id) - 1])?.type_name}
                                        </td>
                                        <td>{app.custom_app_id}</td>
                                        <td>{app.application_date}</td>
                                        <td class='text-primary'>{app.certificate_number}</td>
                                        <td class='text-primary'>{app.certificate_date}</td>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                    </Table>
                    <Row>
                        <Col>
                            <Button class='mx-1' onClick={() => setOpenNewApp(true)} variant='info'>
                                {t('ipaz_mark_renewApplication')}
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <ModalComponent
                header={'ipaz_mark_renewApplication'}
                onOpen={openNewApp}
                setOnOpen={setOpenNewApp}
                editMode={editMode}
                setEditMode={setEditMode}
                validate={() => handleValidate(appFormElement)}
                sumbit={submitNewApplication}
            >
                <Form
                    validated={validated()}
                    ref={r => {
                        appFormElement = r;
                    }}
                >
                    <Row>
                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_nameArabic')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='text'
                                name='mark'
                                value={props.mark()?.name_ar ?? ''}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_nameArabic')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='text'
                                name='name_en'
                                value={props.mark()?.name_en ?? ''}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_applicationId')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='number'
                                name='custom_app_id'
                                onInput={handleNewApplicationChange}
                                value={appValues().custom_app_id ?? ''}
                                placeholder={t('ipaz_mark_applicationId')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_applicationDate')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='date'
                                name='application_date'
                                onInput={handleNewApplicationChange}
                                value={appValues().application_date ?? ''}
                                placeholder={t('ipaz_mark_registerDate')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_certificate_number')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='text'
                                name='certificate_number'
                                onInput={handleNewApplicationChange}
                                placeholder={t('ipaz_mark_certificate_number')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_certificate_date')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='date'
                                name='certificate_date'
                                onInput={handleNewApplicationChange}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </Form>
            </ModalComponent>
        </>
    );
};

export default ApplicationComponent;
