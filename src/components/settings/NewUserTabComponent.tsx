import { useI18n } from '@solid-primitives/i18n';
import { Button, Card, Col, Form, Row, Spinner } from 'solid-bootstrap';
import { Accessor, Component, createEffect, createSignal, For, Setter, Show } from 'solid-js';
import { postData, updateData } from '../../utils/api';
import { roles } from '../../utils/dataStore';
import { hashPassword } from '../../utils/functions';
import showToast from '../../utils/ToastMessage';
import { refetchUser, users } from './UsersTabComponent';

const NewUserTabComponent: Component<{
    setKey: Setter<string>;
    edit: Accessor<number | undefined>;
    setEdit: Setter<number | undefined>;
}> = (props) => {
    const [t, { locale }] = useI18n();
    let formElement: HTMLFormElement;

    const [loading, setLoading] = createSignal(false);
    const [validated, setValidated] = createSignal(false);
    const [values, setValues] = createSignal<{ [key: string]: any }>({});

    createEffect(() => {
        if (props.edit()) {
            props.setKey('newUser');
            const found = users().find((element: any) => +element.staff_id === props.edit()!);
            delete found.password;
            setValues(found);
            if (!found) {
                props.setKey('user');
            }
        }
    });

    const handleValidate = () => {
        setValidated(true);
        return formElement.checkValidity();
    };

    function handleChange(e: Event): void {
        const target = e.target as HTMLInputElement;
        const { name, value }: { name: string; value: string | number } = target;
        setValues(signalValues => ({ ...signalValues, [name]: value }));
    }

    const handleSave = async () => {
        if (!handleValidate() || !values()) return;
        setLoading(true);

        if (values()!.password) {
            const passHash = await hashPassword(values()!.password);
            setValues(signalValues => ({ ...signalValues, password: passHash }));
        }

        const { error } = await postData(values(), 'staff');
        if (error) {
            showToast({ message: t('ipaz_alert_fail_addUser'), type: 'error' });
        } else {
            refetchUser();
            showToast({ message: t('ipaz_alert_success_addUser'), type: 'success' });
        }
        setLoading(false);
        setValidated(false);
        setValues({});
    };

    const hanleEdit = async (id: number) => {
        if (!handleValidate()) return;

        setLoading(true);

        if (values()!.password) {
            const passHash = await hashPassword(values()!.password);
            setValues(signalValues => ({ ...signalValues, password: passHash }));
        }

        const { error } = await updateData(id, values(), 'staff', 'staff_id');

        if (error) {
            showToast({ message: t('ipaz_alert_fail_editData'), type: 'error' });
        } else {
            setValidated(false);
            setValues({});
            refetchUser();
            props.setEdit();
            props.setKey('users');
            showToast({ message: t('ipaz_alert_success_editData'), type: 'success' });
        }
        setLoading(false);
    };

    const handleCancelEdit = () => {
        setValues({});
        props.setEdit();
        props.setKey('users');
    };

    return (
        <Card>
            <Card.Header class='pb-0'>
                <h5 class='card-title'>{t('ipaz_settings_newUser')}</h5>
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
                            value={values().username ?? ''}
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
                            value={values().password ?? ''}
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
                            value={values().fname ?? ''}
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
                            value={values().lname ?? ''}
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
                            value={values().email ?? ''}
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
                            value={values().phone ?? ''}
                            placeholder={t('ipaz_settings_phone')}
                            required
                        />
                        <Form.Control.Feedback type='invalid'>
                            {t('ipaz_validation_required')}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row class='mb-6'>
                    <Form.Group class='mb-3' md='6' as={Col}>
                        <Form.Label>{t('ipaz_settings_role')}</Form.Label>
                        <Form.Select
                            size='lg'
                            name='role'
                            value={values().role ?? ''}
                            onInput={handleChange}
                            required
                        >
                            <option disabled selected value=''>Choose...</option>
                            <For each={roles[locale()!]}>
                                {(role) => (
                                    <option value={role.id}>
                                        {role.role}
                                    </option>
                                )}
                            </For>
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>
                            {t('ipaz_validation_required')}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row class='mt-4'>
                    <Col>
                        <Show
                            when={props.edit()}
                            fallback={
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
                            }
                        >
                            <Button
                                onClick={() => hanleEdit(props.edit()!)}
                                variant='success'
                            >
                                {t('ipaz_buttonTooltip_edit')}
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

                            <Button
                                variant='danger'
                                class='mx-2'
                                onClick={handleCancelEdit}
                            >
                                {t('ipaz_modal_cancel')}
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
                        </Show>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default NewUserTabComponent;
