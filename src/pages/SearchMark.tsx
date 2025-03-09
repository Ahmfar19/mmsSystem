import { useI18n } from '@solid-primitives/i18n';
import { Title } from '@solidjs/meta';
import { useNavigate } from '@solidjs/router';
import Choices from 'choices.js';
import { Card, Col, Form, Row } from 'solid-bootstrap';
import { Component, createEffect, createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { setCollapseName } from '../components/SidebarComponent';
import SpinnerComponent from '../components/SpinnerComponent';
import TableComponent from '../components/TableComponent';
import { getCustomData } from '../utils/api';
import { agent, category, customers } from '../utils/dataStore';

const [markSearch, setMarkSearch] = createSignal([]);

const SearchMark: Component = () => {
    const [t] = useI18n();
    setCollapseName({ collapse: 'marks', page: 'searchMark' });
    const navigate = useNavigate();
    const [loading, setLoading] = createSignal(false);
    const [SearchValue, setSearchValue] = createSignal<any>({});

    let customerIDChoise: Choices;
    let agentIDChoise: Choices;
    let categoryIDChoise: Choices;

    onMount(() => {
        categoryIDChoise = new Choices(document.querySelector('.category_id') as HTMLInputElement);
        customerIDChoise = new Choices(document.querySelector('.customer_id') as HTMLInputElement, {
            choices: [],
            shouldSort: false,
            renderChoiceLimit: 500,
            allowHTML: false,
        });
        agentIDChoise = new Choices(document.querySelector('.agent') as HTMLInputElement, {
            choices: [],
            shouldSort: false,
            renderChoiceLimit: 500,
            allowHTML: false,
        });
    });

    createEffect(() => {
        if (customers()) {
            setTimeout(() => {
                const customerData: any[] = customers();
                const customerID: { value: any; label: any; selected?: any }[] = [{
                    value: '',
                    label: 'Choose...',
                    selected: true,
                }];
                customerData.forEach(({ customer_id, firstname, lastname }) => {
                    customerID.push({ value: customer_id, label: firstname + ' ' + lastname });
                });
                customerIDChoise?.setChoices(customerID, 'value', 'label', true);
            }, 0);
        }
    });

    createEffect(() => {
        if (agent()) {
            setTimeout(() => {
                const agentData: any[] = agent();
                const agentID: { value: any; label: any; selected?: any }[] = [{
                    value: '',
                    label: 'Choose...',
                    selected: true,
                }];
                // eslint-disable-next-line @typescript-eslint/no-shadow
                agentData.forEach(({ agent_id, agent }) => {
                    agentID.push({ value: agent_id, label: agent });
                });
                agentIDChoise?.setChoices(agentID, 'value', 'label', true);
            }, 0);
        }
    });

    const headers = [
        'ipaz_sidebar_ID',
        'ipaz_mark_nameArabic',
        'ipaz_mark_nameEnglish',
        'ipaz_mark_category',
        'ipaz_mark_nameCustomer',
        'ipaz_mark_certificate_number',
        'ipaz_mark_certificate_date',
        'ipaz_mark_managPage_appOptions',
    ];

    const keys = [
        'mark_id',
        'name_ar',
        'name_en',
        'category_id',
        'customer_name',
        'certificate_number',
        'certificate_date',
    ];

    async function handleDelete(): Promise<boolean> {
        return false;
    }

    const handleUpdate = (id: number): void => {
        navigate(`/managemark/edit/${id}`);
    };

    const handleChangeSearch = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const { name, value }: { name: string; value: string | number; type: string } = target;

        if (name === 'agent_id') {
            categoryIDChoise?.setChoiceByValue('');
            customerIDChoise?.setChoiceByValue('');
        } else if (name === 'customer_id') {
            categoryIDChoise?.setChoiceByValue('');
            agentIDChoise?.setChoiceByValue('');
        } else if (name === 'category_id') {
            customerIDChoise?.setChoiceByValue('');
            agentIDChoise?.setChoiceByValue('');
        } else {
            categoryIDChoise?.setChoiceByValue('');
            customerIDChoise?.setChoiceByValue('');
            agentIDChoise?.setChoiceByValue('');
        }

        setSearchValue({});
        if (value === '') {
            setMarkSearch([]);
            return;
        }

        let result;
        setLoading(true);
        if (name === 'allMarks') {
            if (target.checked) {
                result = await getCustomData('custom', 'all', '1');
                setSearchValue(signalValues => ({
                    ...signalValues,
                    [name]: value,
                }));
            } else {
                setMarkSearch([]);
                setLoading(false);
                return;
            }
        } else {
            setSearchValue(signalValues => ({
                ...signalValues,
                [name]: value,
            }));
            result = await getCustomData('custom', name, value);
        }
        setMarkSearch(result);
        setLoading(false);
    };

    onCleanup(() => {
        customerIDChoise?.destroy();
        agentIDChoise?.destroy();
        categoryIDChoise?.destroy();
        setMarkSearch([]);
    });

    return (
        <>
            <Show when={loading()}>
                <SpinnerComponent />
            </Show>
            <Title>{t('ipaz_card_allMarks')}</Title>

            <Card>
                <Card.Header>
                    <h5 class='card-title'>{t('ipaz_mark_managPage_CardTitle')}</h5>
                    <h6 class='card-subtitle text-muted'>{t('ipaz_mark_managPage_CardTitle2')}</h6>
                </Card.Header>

                <Form class='card-body'>
                    <Row>
                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_nameCustomer')}</Form.Label>
                            <Form.Select
                                size='lg'
                                class='customer_id'
                                name='customer_id'
                                onChange={handleChangeSearch}
                            >
                                <option selected value=''>Choose...</option>
                                <For each={customers()}>
                                    {(customer) => (
                                        <option value={customer.customer_id}>
                                            {customer.firstname}, {customer.lastname}
                                        </option>
                                    )}
                                </For>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_agent')}</Form.Label>
                            <Form.Select
                                size='lg'
                                name='agent_id'
                                class='agent'
                                onChange={handleChangeSearch}
                            >
                                <option selected value=''>Choose...</option>
                                <For each={agent()}>
                                    {(item) => (
                                        <option value={item.agent_id}>
                                            {item.agent}
                                        </option>
                                    )}
                                </For>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_category')}</Form.Label>
                            <Form.Select
                                size='lg'
                                name='category_id'
                                class='category_id'
                                onChange={handleChangeSearch}
                            >
                                <option selected value=''>Choose...</option>
                                <For each={category()}>
                                    {(cat) => (
                                        <option value={cat.category_id}>
                                            {cat.category_name}
                                        </option>
                                    )}
                                </For>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_applicationDate')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='number'
                                name='application_date'
                                step={1}
                                value={SearchValue().application_date ?? ''}
                                onChange={handleChangeSearch}
                                placeholder={t('ipaz_mark_applicationDate')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <hr />

                    <Row class='mb-3'>
                        <Col>
                            <Form.Group class='d-inline-block'>
                                <Form.Check
                                    type='checkbox'
                                    label={t('ipaz_card_allMarks')}
                                    name='allMarks'
                                    checked={!!SearchValue().allMarks}
                                    onInput={handleChangeSearch}
                                />
                            </Form.Group>
                        </Col>
                        <small>{t('ipaz_markSearch_undeTitle')}</small>
                    </Row>
                </Form>
            </Card>

            <Card>
                <Card.Header class='card-title h5'>{t('ipaz_mark_managPage_marksFound')}</Card.Header>
                <Card.Body dir='ltr'>
                    <TableComponent
                        id='markSearch'
                        columnsHeader={headers}
                        keys={keys}
                        data={markSearch}
                        handleDelete={handleDelete}
                        handleUpdate={handleUpdate}
                        options={{ edit: true, delete: false, id: 'mark_id' }}
                    />
                </Card.Body>
            </Card>
        </>
    );
};

export default SearchMark;
