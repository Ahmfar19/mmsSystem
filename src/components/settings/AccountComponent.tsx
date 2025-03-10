import { useI18n } from '@solid-primitives/i18n';
import { Button, Card, Col, Form, Row, Spinner } from 'solid-bootstrap';
import { Component, createEffect, createSignal, For, Show } from 'solid-js';
import { produce } from 'solid-js/store';
import { useAppContext } from '../../AppContext';
import { updateData } from '../../utils/api';
import { getRoles } from '../../utils/functions';
import showToast from '../../utils/ToastMessage';
import { StaffType } from '../../utils/types';

const AccountComponent: Component = () => {
    const { store, setStore } = useAppContext();
    const [t] = useI18n();
    let formElement: HTMLFormElement;

    const [loading, setLoading] = createSignal(false);
    const [validated, setValidated] = createSignal(false);
    const [values, setValues] = createSignal<StaffType>({} as StaffType);
    const [previewImage, setPreviewImage] = createSignal<string>();

    createEffect(() => {
        if (store.staff) {
            setValues(store.staff);
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

        const { error } = await updateData('table', store.staff.staff_id!, values(), 'staff');

        if (error) {
            showToast({ message: t('ipaz_alert_fail_editData'), type: 'error' });
            setValues(store.staff);
        } else {
            setStore(produce((s) => {
                s.staff = values();
                s.isAdmin = +values().role === 1;
            }));
            showToast({ message: t('ipaz_alert_success_editData'), type: 'success' });
        }
        setLoading(false);
    };

    const uploadImage = (e: Event) => {
        const fileInput = e.target as HTMLInputElement;
        const file = fileInput.files && fileInput.files[0];

        const reader = new FileReader();
        reader.onload = (ev: ProgressEvent<FileReader>) => {
            const result = ev.target!.result;
            if (typeof result === 'string') {
                setPreviewImage(result);
            }
        };
        if (file) {
            reader.readAsDataURL(file);
            setValues((prev) => ({ ...prev, image: file }));
        }
    };

    return (
        <Form
            validated={validated()}
            ref={r => {
                formElement = r;
            }}
        >
            <Card>
                <Card.Header class='pb-0'>
                    <Card.Title>
                        {t('ipaz_settings_account')}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={8}>
                            <Form.Group class='mb-3'>
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
                            <Show when={store.isAdmin}>
                                <Form.Group class='mb-3'>
                                    <Form.Label>{t('ipaz_settings_role')}</Form.Label>
                                    <Form.Select
                                        size='lg'
                                        name='role'
                                        value={values().role ?? ''}
                                        onInput={handleChange}
                                        required
                                        disabled={!store.isAdmin}
                                    >
                                        <For each={Object.entries(getRoles())}>
                                            {([value, text]: any) => (
                                                <option
                                                    value={value}
                                                    selected={+store.staff.role === +value}
                                                >
                                                    {t(text)}
                                                </option>
                                            )}
                                        </For>
                                    </Form.Select>
                                    <Form.Control.Feedback type='invalid'>
                                        {t('ipaz_validation_required')}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Show>
                        </Col>

                        {
                            /* <Col md={4}>
                            <div class='text-center'>
                                <img
                                    alt='Charles Hall'
                                    src={previewImage() || store.staff.userImage || '/img/profile.png'}
                                    class='rounded-circle img-responsive mt-2'
                                    width='128'
                                    height='128'
                                />
                                <div class='mt-2'>
                                    <label for='fileInput' class='btn btn-primary'>
                                        <i class='fas fa-upload me-2' />
                                        {t('ipaz_settings_upload')}
                                    </label>
                                    <input
                                        id='fileInput'
                                        type='file'
                                        class='d-none'
                                        accept='image/*'
                                        onChange={uploadImage}
                                    />
                                </div>
                                <small>{t('ipaz_settings_imageInfo')}</small>
                            </div>
                        </Col> */
                        }
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group class='mb-3'>
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
                        </Col>
                        <Col md={6}>
                            <Form.Group class='mb-3'>
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
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group class='mb-3'>
                                <Form.Label>{t('ipaz_login_email')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='email'
                                    type='text'
                                    onInput={handleChange}
                                    value={values().email ?? ''}
                                    placeholder={t('ipaz_login_email')}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {t('ipaz_validation_required')}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group class='mb-3'>
                                <Form.Label>{t('ipaz_settings_phone')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='phone'
                                    type='text'
                                    onInput={handleChange}
                                    value={values().phone ?? ''}
                                    placeholder={t('ipaz_settings_phone')}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {t('ipaz_validation_required')}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button
                        variant='primary'
                        onClick={handleSave}
                        disabled={loading()}
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
        </Form>
    );
};

export default AccountComponent;
