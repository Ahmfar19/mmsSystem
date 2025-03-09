import { useI18n } from '@solid-primitives/i18n';
import { Button, Card, Form, Row, Spinner } from 'solid-bootstrap';
import { Component, createSignal, Show } from 'solid-js';
import { useAppContext } from '../../AppContext';
import { updateData } from '../../utils/api';
import showToast from '../../utils/ToastMessage';
import { PasswordFormType } from '../../utils/types';

const PasswordComponent: Component = () => {
    let formElement: HTMLFormElement;

    const [t] = useI18n();
    const { store } = useAppContext();

    const [loading, setLoading] = createSignal(false);
    const [validated, setValidated] = createSignal(false);
    const [values, setValues] = createSignal<any>({});
    const [errors, setErrors] = createSignal<PasswordFormType>({} as PasswordFormType);

    const handleValidate = () => {
        setValidated(true);
        const formElements = Array.from(formElement.elements) as HTMLInputElement[];
        let validationErrors: PasswordFormType = {} as PasswordFormType;
        formElements.forEach((element: HTMLInputElement) => {
            if (!element.checkValidity()) {
                validationErrors = { ...validationErrors, [element.name]: element.validationMessage };
            }

            if (element.name === 'verify_password') {
                if (element.value !== values().new_password) {
                    element.setCustomValidity('Passwords do not match');
                    validationErrors = { ...validationErrors, [element.name]: 'Passwords do not match' };
                } else {
                    element.setCustomValidity('');
                }
            }
        });
        setErrors(validationErrors);
        const valid = formElement.checkValidity();
        return valid;
    };

    const emptyForm = () => {
        const formElements = Array.from(formElement.elements) as HTMLInputElement[];
        formElements.forEach((element: HTMLInputElement) => {
            element.value = '';
        });
    };

    function handleChange(e: Event): void {
        const target = e.target as HTMLInputElement;
        const { name, value }: { name: string; value: string | number } = target;
        setValues(signalValues => ({ ...signalValues, [name]: value }));
    }

    const handleSave = async () => {
        if (!handleValidate() || !values()) return;

        setLoading(true);
        const { error } = await updateData('password', store.staff.staff_id!, values(), 'staff');
        if (error) {
            showToast({ message: String(error), type: 'error' });
        } else {
            setValues({});
            emptyForm();
            showToast({ message: t('ipaz_password_updating_successfully'), type: 'success' });
        }
        setLoading(false);
        setValidated(false);
    };

    return (
        <Card>
            <Card.Header class='pb-0'>
                <Card.Title>
                    {t('ipaz_settings_changePassword')}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Form
                    validated={validated()}
                    ref={r => {
                        formElement = r;
                    }}
                >
                    <Row>
                        <Form.Group class='mb-3'>
                            <Form.Label>{t('ipaz_settings_currentPassword')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='password'
                                type='password'
                                onInput={handleChange}
                                placeholder={t('ipaz_settings_currentPassword')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors().password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group class='mb-3'>
                            <Form.Label>{t('ipaz_settings_newPassword')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='new_password'
                                type='password'
                                minlength={8}
                                onInput={handleChange}
                                placeholder={t('ipaz_settings_newPassword')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors().new_password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group class='mb-3'>
                            <Form.Label>{t('ipaz_settings_verifyPassword')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='verify_password'
                                type='password'
                                minlength={8}
                                onInput={handleChange}
                                placeholder={t('ipaz_settings_verifyPassword')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors().verify_password}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </Form>
                <Button
                    variant='primary'
                    onClick={handleSave}
                    class='mt-2'
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
            </Card.Body>
        </Card>
    );
};

export default PasswordComponent;
