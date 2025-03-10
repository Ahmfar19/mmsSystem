import { useI18n } from '@solid-primitives/i18n';
import { Title } from '@solidjs/meta';
import { useNavigate, useParams } from '@solidjs/router';
import { Button, Card, Col, Form, Row, Spinner } from 'solid-bootstrap';
import { Component, createEffect, createSignal, Show, untrack } from 'solid-js';
import { setCollapseName } from '../components/SidebarComponent';
import { postData, updateData } from '../utils/api';
import { customers, mutateCustomers, updateResource } from '../utils/dataStore';
import showToast from '../utils/ToastMessage';
import { CustomerType } from '../utils/types';

const NewCustomer: Component = () => {
    setCollapseName({ collapse: 'customers', page: 'newCustomer' });
    let formElement: HTMLFormElement;

    const [t] = useI18n();
    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = createSignal(false);
    const [validated, setValidated] = createSignal(false);
    const [values, setValues] = createSignal<CustomerType | { [key: string]: any }>({});

    createEffect(() => {
        if (params.id && !customers.loading) {
            const found = customers().find((element: CustomerType) => +element.customer_id === +params.id);
            setValues(found);
            if (!found) {
                navigate(`/newcustomer`);
            }
        }
    });

    function handleChange(e: Event): void {
        const target = e.target as HTMLInputElement;
        const { name, value }: { name: string; value: string | number } = target;

        setValues(signalValues => ({ ...signalValues, [name]: value }));
    }

    const handleValidate = () => {
        setValidated(true);
        return formElement.checkValidity();
    };

    async function handleSubmit() {
        if (!handleValidate()) return;

        setLoading(true);
        const { error, id } = await postData(values(), 'table', 'customer');

        if (error) {
            showToast({ message: t('ipaz_alert_fail_addCustomer'), type: 'error' });
        } else {
            showToast({ message: t('ipaz_alert_success_addCustomer'), type: 'success' });

            // Mutate the customers instead of refetching
            setValues(signalValues => ({ ...signalValues, customer_id: String(id) }));
            mutateCustomers((prevCustomers) => [...prevCustomers, untrack(() => values())]);

            setValues({});
            setValidated(false);
        }
        setLoading(false);
    }

    async function hanleEdit(id: number) {
        if (!handleValidate()) return;

        setLoading(true);
        const { error } = await updateData('table', id, values(), 'customer');
        if (error) {
            showToast({ message: t('ipaz_alert_fail_editData'), type: 'error' });
        } else {
            // Mutate the customers instead of refetching
            updateResource(mutateCustomers, id, 'customer_id', values());

            setValues({});
            navigate(`/allCustomers`);
            showToast({ message: t('ipaz_alert_success_editData'), type: 'success' });
        }
        setLoading(false);
    }

    return (
        <>
            <Title>{t('ipaz_sidebar_addCustomers')}</Title>
            <Col md='12'>
                <Card>
                    <Card.Header>
                        <h5 class='card-title'>{t('ipaz_sidebar_addNewCustomers')}</h5>
                        <h6 class='card-subtitle text-muted'>{t('ipaz_sidebar_addCustomersTitle')}</h6>
                    </Card.Header>
                    <Form
                        class='card-body'
                        validated={validated()}
                        ref={r => {
                            formElement = r;
                        }}
                    >
                        <Row class='mb-3'>
                            <Form.Group as={Col} md='4'>
                                <Form.Label>{t('ipaz_sidebar_customoerFirstName')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='firstname'
                                    type='text'
                                    onInput={handleChange}
                                    value={values()?.firstname ?? ''}
                                    placeholder={t('ipaz_sidebar_customoerFirstName')}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {t('ipaz_validation_required')}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md='4'>
                                <Form.Label>{t('ipaz_sidebar_customoerLasrName')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='lastname'
                                    type='text'
                                    onInput={handleChange}
                                    value={values()?.lastname ?? ''}
                                    placeholder={t('ipaz_sidebar_customoerLasrName')}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {t('ipaz_validation_required')}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md='4'>
                                <Form.Label>{t('ipaz_sidebar_customoerFatherName')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='fathername'
                                    type='text'
                                    onInput={handleChange}
                                    value={values()?.fathername ?? ''}
                                    placeholder={t('ipaz_sidebar_customoerFatherName')}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {t('ipaz_validation_required')}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row class='mb-3'>
                            <Form.Group as={Col} md='4'>
                                <Form.Label>{t('ipaz_sidebar_customoerMotherName')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='mothername'
                                    type='text'
                                    onInput={handleChange}
                                    value={values()?.mothername ?? ''}
                                    placeholder={t('ipaz_sidebar_customoerMotherName')}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {t('ipaz_validation_required')}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md='4'>
                                <Form.Label>{t('ipaz_sidebar_customoerPersonNumber')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='personnumber'
                                    type='number'
                                    onInput={handleChange}
                                    value={values()?.personnumber ?? ''}
                                    placeholder={t('ipaz_sidebar_customoerPersonNumber')}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {t('ipaz_validation_required')}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md='4'>
                                <Form.Label>{t('ipaz_sidebar_customoerNationality')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='nationality'
                                    type='text'
                                    onInput={handleChange}
                                    value={values()?.nationality ?? ''}
                                    placeholder={t('ipaz_sidebar_customoerNationality')}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {t('ipaz_validation_required')}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row class='mb-3'>
                            <Form.Group as={Col} md='4'>
                                <Form.Label>{t('ipaz_sidebar_customoerAdress')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='adress'
                                    type='text'
                                    onInput={handleChange}
                                    value={values()?.adress ?? ''}
                                    placeholder={t('ipaz_sidebar_customoerAdress')}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {t('ipaz_validation_required')}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md='4'>
                                <Form.Label>{t('ipaz_sidebar_customoerPhoneNumber')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='phonenumber'
                                    type='number'
                                    onInput={handleChange}
                                    value={values()?.phonenumber ?? ''}
                                    placeholder={t('ipaz_sidebar_customoerPhoneNumber')}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {t('ipaz_validation_required')}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md='4'>
                                <Form.Label>{t('ipaz_sidebar_customoerMailAdress')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='mail'
                                    type='text'
                                    onInput={handleChange}
                                    value={values()?.mail ?? ''}
                                    placeholder={t('ipaz_sidebar_customoerMailAdress')}
                                />
                            </Form.Group>
                        </Row>

                        <Show when={!params.id}>
                            <Button
                                size='lg'
                                onClick={handleSubmit}
                                variant='primary'
                            >
                                {t('ipaz_sidebar_customoerAddCustomer')}
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
                        <Show when={params.id}>
                            <Button
                                size='lg'
                                onClick={() => hanleEdit(+params.id)}
                                variant='success'
                            >
                                {t('ipaz_sidebar_customoerEditCustomer')}
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
                    </Form>
                </Card>
            </Col>
        </>
    );
};

export default NewCustomer;
