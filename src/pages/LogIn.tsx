import { useI18n } from '@solid-primitives/i18n';
import { Title } from '@solidjs/meta';
import { useNavigate } from '@solidjs/router';
import { Button, Card, Col, Form, Spinner } from 'solid-bootstrap';
import { Component, createSignal, Show } from 'solid-js';
import { setCookie } from 'typescript-cookie';
import { useAppContext } from '../AppContext';
import { postData } from '../utils/api';
import showToast from '../utils/ToastMessage';
import { StaffType } from '../utils/types';
import { generateDeviceFingerprint, handleEncrypt } from '../utils/utils';

export const [isInlogged, setIsInloged] = createSignal<boolean>(false);

const LogIn: Component = () => {
    let formElement: HTMLFormElement;
    const [t, { locale }] = useI18n();
    const navigate = useNavigate();
    const { setStore } = useAppContext();

    const [loading, setLoading] = createSignal(false);
    const [validated, setValidated] = createSignal(false);
    const [loginValues, setLoginValues] = createSignal<any>({});

    const handleValidate = (form: HTMLFormElement) => {
        setValidated(true);
        return form.checkValidity();
    };

    function handleValuesChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const { name, value }: { name: string; value: string | number; type: string } = target;
        setLoginValues((signalValues: any) => ({
            ...signalValues,
            [name]: value,
        }));
    }

    async function handleLogin() {
        if (!handleValidate(formElement)) return;
        setLoading(true);
        const res = await postData(loginValues(), 'login');
        if (res.error) {
            showToast({ message: t('ipaz_login_fail'), type: 'error' });
        } else {
            const fp = await generateDeviceFingerprint();
            const staffData = res as unknown as StaffType;
            setStore('staff', staffData);
            setStore('isInlogged', true);
            setStore('isAdmin', +(staffData.role || 0) === 1);

            const cidHash = handleEncrypt(String(staffData.staff_id), String(fp));
            setCookie('cidHash', cidHash);
            setCookie('verifier', fp);
            navigate(`/home`);
        }
        setLoading(false);
    }

    return (
        <>
            <Title>{t('ipaz_login_login')}</Title>
            <div class='container-fluid d-flex flex-column h-100'>
                <div
                    class='mx-auto d-table h-100 w-100'
                    style={{
                        'max-width': '700px',
                    }}
                >
                    <div class='d-table-cell align-middle'>
                        <Card classList={{ 'rtl': locale() === 'ar' }}>
                            <Card.Body>
                                <div class='m-sm-4'>
                                    <div class='text-center'>
                                        <img
                                            src='/img/logo/logo_mini.png'
                                            alt='Charles Hall'
                                            class='img-fluid rounded-circle'
                                            width='200'
                                            height='200'
                                        />
                                    </div>

                                    <div class='text-center mt-4'>
                                        <h1 class='h2'>{t('ipaz_login_title')}</h1>
                                        <p class='lead'>
                                            {t('ipaz_login_title2')}
                                        </p>
                                    </div>

                                    <Form
                                        validated={validated()}
                                        ref={r => {
                                            formElement = r;
                                        }}
                                    >
                                        <div class='mb-3'>
                                            <Form.Group as={Col} md='12' class='mb-2'>
                                                <Form.Label>{t('ipaz_login_email')}</Form.Label>
                                                <Form.Control
                                                    size='lg'
                                                    type='text'
                                                    name='email'
                                                    onInput={handleValuesChange}
                                                    value={loginValues()?.email ?? ''}
                                                    placeholder={t('ipaz_login_emailPlaceHolder')}
                                                    required
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                    {t('ipaz_validation_required')}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div class='mb-3'>
                                            <Form.Group as={Col} md='12' class='mb-2'>
                                                <Form.Label>{t('ipaz_login_passowrd')}</Form.Label>
                                                <Form.Control
                                                    size='lg'
                                                    type='password'
                                                    name='password'
                                                    onInput={handleValuesChange}
                                                    value={loginValues()?.password ?? ''}
                                                    placeholder={t('ipaz_login_passowrdPlaceHolder')}
                                                    required
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                    {t('ipaz_validation_required')}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            {
                                                /* <small>
                                                <a href='/login'>
                                                    {t('ipaz_login_ForgotPassword')}
                                                </a>
                                            </small> */
                                            }
                                        </div>
                                        <div>
                                            <label class='form-check'>
                                                <div class='col d-inline-block'>
                                                    <input
                                                        class='form-check-input'
                                                        type='checkbox'
                                                        value='remember-me'
                                                        name='remember-me'
                                                        checked
                                                    />
                                                    {t('ipaz_login_rememberMe')}
                                                </div>
                                            </label>
                                        </div>
                                        <div class='text-center mt-3'>
                                            <Button
                                                onClick={handleLogin}
                                                disabled={loading()}
                                                variant='primary'
                                                size='lg'
                                            >
                                                {t('ipaz_login_signin')}
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
                                        </div>
                                    </Form>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LogIn;
