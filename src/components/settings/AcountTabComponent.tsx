import { useI18n } from '@solid-primitives/i18n';
import { Button, Card, Col, Form, Row, Spinner } from 'solid-bootstrap';
import { Component, createResource, createSignal, Show } from 'solid-js';
import { useAppContext } from '../../AppContext';
import { getData, updateData } from '../../utils/api';
import { updateResource } from '../../utils/dataStore';
import { hashPassword } from '../../utils/functions';
import showToast from '../../utils/ToastMessage';

const AccountTabComponent: Component = () => {
    const [t] = useI18n();
    let formElement: HTMLFormElement;

    const { store } = useAppContext();

    const [loading, setLoading] = createSignal(false);
    const [validated, setValidated] = createSignal(false);
    const [values, setValues] = createSignal<{ [key: string]: any }>();

    const handleValidate = () => {
        setValidated(true);
        return formElement.checkValidity();
    };

    function handleChange(e: Event): void {
        const target = e.target as HTMLInputElement;
        const { name, value }: { name: string; value: string | number } = target;
        setValues(signalValues => ({ ...signalValues, [name]: value }));
    }

    const [user, { mutate: mutateUser }] = createResource(
        () => store.staffID,
        (staff_id) => getData('staff', `staff_id=${staff_id}`),
    );

    const handleSave = async () => {
        if (!handleValidate() || !values()) return;
        setLoading(true);

        if (values()!.password) {
            const passHash = await hashPassword(values()!.password);
            setValues(signalValues => ({ ...signalValues, password: passHash }));
        }

        const { error } = await updateData(store.staffID!, values(), 'staff', 'staff_id');
        if (error) {
            showToast({ message: t('ipaz_alert_fail_editData'), type: 'error' });
        } else {
            updateResource(mutateUser, store.staffID!, 'staff_id', values());
            setValues({});
            showToast({ message: t('ipaz_alert_success_editData'), type: 'success' });
        }
        setLoading(false);
    };

    return (
        <Show when={user()}>
            <Card>
                <Card.Header class='pb-0'>
                    <h5 class='card-title'>{t('ipaz_settings_accountSettings')}</h5>
                </Card.Header>
                <Form
                    class='card-body'
                    validated={validated()}
                    ref={r => {
                        formElement = r;
                    }}
                >
                    <Row class='mb-3'>
                        <Form.Group as={Col} md='6'>
                            <Form.Label>{t('ipaz_settings_username')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='username'
                                type='text'
                                onInput={handleChange}
                                value={user()[0].username ?? ''}
                                placeholder={t('ipaz_settings_username')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md='6'>
                            <Form.Label>{t('ipaz_settings_password')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='password'
                                type='password'
                                onInput={handleChange}
                                value={''}
                                placeholder={t('ipaz_settings_password')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row class='mb-3'>
                        <Form.Group as={Col} md='6'>
                            <Form.Label>{t('ipaz_sidebar_customoerFirstName')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='fname'
                                type='text'
                                onInput={handleChange}
                                value={user()[0].fname ?? ''}
                                placeholder={t('ipaz_sidebar_customoerFirstName')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md='6'>
                            <Form.Label>{t('ipaz_sidebar_customoerLasrName')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='lname'
                                type='text'
                                onInput={handleChange}
                                value={user()[0].lname ?? ''}
                                placeholder={t('ipaz_sidebar_customoerLasrName')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row class='mb-3'>
                        <Form.Group as={Col} md='6'>
                            <Form.Label>{t('ipaz_settings_email')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='email'
                                type='text'
                                onInput={handleChange}
                                value={user()[0].email ?? ''}
                                placeholder={t('ipaz_settings_email')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md='6'>
                            <Form.Label>{t('ipaz_settings_phone')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='phone'
                                type='phone'
                                onInput={handleChange}
                                value={user()[0].phone ?? ''}
                                placeholder={t('ipaz_settings_phone')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row class='mt-4'>
                        <Col>
                            <Button
                                variant='primary'
                                onClick={handleSave}
                            >
                                {t('ipaz_title_save')}
                                <Show when={loading()}>
                                    <Spinner
                                        as='span'
                                        animation='border'
                                        size='sm'
                                        role='status'
                                        aria-hidden='true'
                                        class='mx-2'
                                    />
                                </Show>
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Show>
    );
};

export default AccountTabComponent;
