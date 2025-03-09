import { useI18n } from '@solid-primitives/i18n';
import { Title } from '@solidjs/meta';
import { useNavigate, useParams } from '@solidjs/router';
import { Button, Card, Col, Form, Row, Spinner } from 'solid-bootstrap';
import { Component, createEffect, createSignal, Show, untrack } from 'solid-js';
import { setCollapseName } from '../components/SidebarComponent';
import { postData, updateData } from '../utils/api';
import { agent, mutateAgent, updateResource } from '../utils/dataStore';
import showToast from '../utils/ToastMessage';
import { AgentType } from '../utils/types';

const NewAgent: Component = () => {
    setCollapseName({ collapse: 'agents', page: 'newAgent' });
    let formElement: HTMLFormElement;

    const [t] = useI18n();
    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = createSignal(false);
    const [validated, setValidated] = createSignal(false);

    const [values, setValues] = createSignal<AgentType | { [key: string]: any }>({});

    createEffect(() => {
        if (params.id && !agent.loading) {
            const found = agent().find((element: AgentType) => +element.agent_id === +params.id);
            setValues(found);
            if (!found) {
                navigate(`/newagent`);
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
        const { error, id } = await postData(values(), 'table', 'agent');

        if (error) {
            showToast({ message: t('ipaz_alert_fail_addAgent'), type: 'error' });
        } else {
            showToast({ message: t('ipaz_alert_success_addAgent'), type: 'success' });

            // Mutate the agents instead of refetching
            setValues(signalValues => ({ ...signalValues, agent_id: id }));
            mutateAgent((prevAgent) => [...prevAgent, untrack(() => values())]);

            setValues({});
            setValidated(false);
        }
        setLoading(false);
    }

    async function hanleEdit(id: number) {
        if (!handleValidate()) return;

        setLoading(true);
        const { error } = await updateData('table', id, values(), 'agent');

        if (error) {
            showToast({ message: t('ipaz_alert_fail_editData'), type: 'error' });
        } else {
            // Mutate the agents instead of refetching
            updateResource(mutateAgent, id, 'agent_id', values());

            setValues({});
            navigate(`/allagents`);
            showToast({ message: t('ipaz_alert_success_editData'), type: 'success' });
        }
        setLoading(false);
    }

    return (
        <>
            <Title>{t('ipaz_agent_title')}</Title>
            <Col md='12'>
                <Card>
                    <Card.Header>
                        <h5 class='card-title'>{t('ipaz_agent_title')}</h5>
                        <h6 class='card-subtitle text-muted'>{t('ipaz_agent_title2')}</h6>
                    </Card.Header>
                    <Form
                        class='card-body'
                        validated={validated()}
                        ref={r => {
                            formElement = r;
                        }}
                    >
                        <Row class='mb-3'>
                            <Form.Group as={Col} md='12' class='mb-2'>
                                <Form.Label>{t('ipaz_agent_name')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='agent'
                                    type='text'
                                    onInput={handleChange}
                                    value={values()?.agent ?? ''}
                                    placeholder={t('ipaz_agent_name')}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {t('ipaz_validation_required')}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md='12' class='mb-2'>
                                <Form.Label>{t('ipaz_agent_register')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='agent_register'
                                    type='text'
                                    onInput={handleChange}
                                    value={values()?.agent_register ?? ''}
                                    placeholder={t('ipaz_agent_register')}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md='12' class='mb-2'>
                                <Form.Label>{t('ipaz_agent_adress')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='agent_Adress'
                                    type='text'
                                    onInput={handleChange}
                                    value={values()?.agent_Adress ?? ''}
                                    placeholder={t('ipaz_agent_adress')}
                                />
                            </Form.Group>
                        </Row>

                        <Show when={!params.id}>
                            <Button
                                size='lg'
                                onClick={handleSubmit}
                                variant='primary'
                            >
                                {t('ipaz_agent_add')}
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
                                {t('ipaz_agent_edit')}
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

export default NewAgent;
