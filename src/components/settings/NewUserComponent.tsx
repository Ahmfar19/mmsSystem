import { useI18n } from '@solid-primitives/i18n';
import { Button, Card, Col, Form, Row, Spinner } from 'solid-bootstrap';
import { Component, createEffect, createSignal, For, onCleanup, Setter, Show, untrack } from 'solid-js';
import { postData, updateData } from '../../utils/api';
import { getRoles } from '../../utils/functions';
import { refetchStaffs, staffs } from '../../utils/staff';
import showToast from '../../utils/ToastMessage';
import { StaffType } from '../../utils/types';

const NewUserComponent: Component<{
    setEditMode?: Setter<number | undefined>;
    id?: number;
}> = (props) => {
    let formElement: HTMLFormElement;
    const [t] = useI18n();

    const [loading, setLoading] = createSignal(false);
    const [validated, setValidated] = createSignal(false);
    const [values, setValues] = createSignal<StaffType>({} as StaffType);

    createEffect(() => {
        const staff = staffs()?.find((s: StaffType) => +s.staff_id! === +(props.id || 0));
        if (staff) {
            delete (staff as any).password;
            setValues(staff);
        } else {
            untrack(() => props.setEditMode?.());
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
        const { error } = await postData(values(), 'table', 'staff');
        if (error) {
            showToast({ message: t('ipaz_alert_fail_addUser'), type: 'error' });
        } else {
            showToast({ message: t('ipaz_alert_success_addUser'), type: 'success' });
            refetchStaffs();
        }

        setLoading(false);
        setValidated(false);
        setValues({} as StaffType);
    };

    const hanleEdit = async () => {
        if (!handleValidate()) return;

        if (!props.id) {
            showToast({ message: t('ec_error_message'), type: 'error' });
            return;
        }

        setLoading(true);
        const { error } = await updateData('table', values().staff_id!, values(), 'staff');

        if (error) {
            showToast({ message: t('ipaz_alert_fail_updateUser'), type: 'error' });
        } else {
            setValidated(false);
            setValues({} as StaffType);
            await refetchStaffs();
            showToast({ message: t('ipaz_alert_success_updateUser'), type: 'success' });
            untrack(() => props.setEditMode?.());
        }
        setLoading(false);
    };

    const handleCancelEdit = () => {
        setValues({} as StaffType);
        untrack(() => props.setEditMode?.());
    };

    onCleanup(() => {
        setValues({} as StaffType);
        untrack(() => props.setEditMode?.());
    });

    return (
        <Card>
            <Card.Header class='pb-0'>
                <Card.Title>
                    {t('ec_settings_account_createNew')}
                </Card.Title>
            </Card.Header>
            <Form
                class='card-body'
                validated={validated()}
                ref={r => {
                    formElement = r;
                }}
            >
                <Row class='mb-2'>
                    <Form.Group as={Col} md='6'>
                        <Form.Label>{t('ipaz_settings_username')}</Form.Label>
                        <Form.Control
                            size='lg'
                            name='username'
                            type='text'
                            onChange={handleChange}
                            value={values()?.username ?? ''}
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
                            onChange={handleChange}
                            value={values()?.password ?? ''}
                            placeholder={t('ipaz_settings_password')}
                            required={!props.id}
                            disabled={Boolean(props.id)}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {t('ipaz_validation_required')}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row class='mb-2'>
                    <Form.Group as={Col} md='6'>
                        <Form.Label>{t('ipaz_sidebar_customoerFirstName')}</Form.Label>
                        <Form.Control
                            size='lg'
                            name='fname'
                            type='text'
                            onChange={handleChange}
                            value={values()?.fname ?? ''}
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
                            onChange={handleChange}
                            value={values()?.lname ?? ''}
                            placeholder={t('ipaz_sidebar_customoerLasrName')}
                            required
                        />
                        <Form.Control.Feedback type='invalid'>
                            {t('ipaz_validation_required')}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row class='mb-2'>
                    <Form.Group as={Col} md='6'>
                        <Form.Label>{t('ipaz_login_email')}</Form.Label>
                        <Form.Control
                            size='lg'
                            name='email'
                            type='text'
                            onChange={handleChange}
                            value={values()?.email ?? ''}
                            placeholder={t('ipaz_login_email')}
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
                            type='number'
                            onChange={handleChange}
                            value={values()?.phone ?? ''}
                            placeholder={t('ipaz_settings_phone')}
                            required
                        />
                        <Form.Control.Feedback type='invalid'>
                            {t('ipaz_validation_required')}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row class='mb-4'>
                    <Form.Group>
                        <Form.Label>{t('ipaz_settings_role')}</Form.Label>
                        <Form.Select
                            size='lg'
                            name='role'
                            value={values().role ?? ''}
                            onChange={handleChange}
                            required
                        >
                            <option selected disabled value=''>{t('ipaz_title_select')}</option>
                            <For each={Object.entries(getRoles())}>
                                {([value, text]: any) => (
                                    <option value={value}>
                                        {t(text)}
                                    </option>
                                )}
                            </For>
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>
                            {t('ipaz_validation_required')}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row>
                    <Col>
                        <Show
                            when={Boolean(props.id)}
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
                                onClick={() => hanleEdit()}
                                variant='success'
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

export default NewUserComponent;
