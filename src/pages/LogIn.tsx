import { useI18n } from '@solid-primitives/i18n';
import { Title } from '@solidjs/meta';
import { useNavigate } from '@solidjs/router';
import { Button, Card, Col, Form } from 'solid-bootstrap';
import { Component, createEffect, createSignal, Show } from 'solid-js';
import { useAppContext } from '../AppContext';
import { getData } from '../utils/api';
import { comparePassword, isInlogged, setIsInloged } from '../utils/functions';
import showToast from '../utils/ToastMessage';

const LogIn: Component = () => {
    const [t] = useI18n();
    const { updateStore } = useAppContext();
    const navigate = useNavigate();

    let formElement: HTMLFormElement;

    const [validated, setValidated] = createSignal(false);
    const [loginValues, setLoginValues] = createSignal<any>({});

    const handleValidate = (form: HTMLFormElement) => {
        setValidated(true);
        return form.checkValidity();
    };

    function handleValuesChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const { type, name, value, checked }: { name: string; value: string | number; type: string; checked: boolean } =
            target;

        setLoginValues((signalValues: any) => ({
            ...signalValues,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    async function handleLogin() {
        if (!handleValidate(formElement)) return;

        const result = await getData('staff', `email="${loginValues().email}" OR username="${loginValues().email}"`);
        let match = false;
        let loggedUser = null;
        for (const user of result) {
            // eslint-disable-next-line no-await-in-loop
            match = await comparePassword(loginValues().password, user.password);
            loggedUser = user;
        }
        if (!match) {
            showToast({ message: t('ipaz_login_fail'), type: 'error' });
        } else {
            updateStore('staffID', loggedUser.staff_id);
            updateStore('staff_role', loggedUser.role);
            setIsInloged(true);

            if (loginValues().rememberMe) {
                localStorage.setItem('inlogged', '1');
            }
            navigate(`/home`);
        }
    }

    createEffect(() => {
        if (isInlogged()) {
            navigate(`/home`);
        }
    });

    return (
        <Show when={!isInlogged()}>
            <Title>{t('ipaz_login_login')}</Title>
            <div class='container d-flex flex-column'>
                <div class='row mt-5'>
                    <div class='col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100'>
                        <div class='d-table-cell align-middle'>
                            <div class='text-center mt-4'>
                                <h1 class='h2'>{t('ipaz_login_title')}</h1>
                                <p class='lead'>
                                    {t('ipaz_login_title2')}
                                </p>
                            </div>
                            <Card>
                                <Card.Body>
                                    <div class='m-sm-4'>
                                        <div class='text-center'>
                                            <img
                                                src='/img/logo/logo.jpg'
                                                alt='Charles Hall'
                                                class='img-fluid rounded-circle'
                                                width='250'
                                                height='200'
                                            />
                                        </div>
                                        <Form
                                            validated={validated()}
                                            ref={r => {
                                                formElement = r;
                                            }}
                                        >
                                            <div class='mb-3'>
                                                <Form.Group as={Col} md='12' class='mb-2'>
                                                    <Form.Label>
                                                        {t('ipaz_login_email')}/{t('ipaz_settings_username')}
                                                    </Form.Label>
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
                                                            name='rememberMe'
                                                            onInput={handleValuesChange}
                                                        />
                                                        {t('ipaz_login_rememberMe')}
                                                    </div>
                                                </label>
                                            </div>
                                            <div class='text-center mt-3'>
                                                <Button
                                                    onClick={handleLogin}
                                                    variant='primary'
                                                    size='lg'
                                                >
                                                    {t('ipaz_login_signin')}
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    );
};

export default LogIn;
