import { useI18n } from '@solid-primitives/i18n';
import { Title } from '@solidjs/meta';
import { useParams } from '@solidjs/router';
import Choices from 'choices.js';
import { Card, Col, Form, Row } from 'solid-bootstrap';
import { Component, createEffect, createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import MarkManageComponent from '../components/MarkManageComponent';
import { setCollapseName } from '../components/SidebarComponent';
import SpinnerComponent from '../components/SpinnerComponent';
import { getCustomData, getData } from '../utils/api';
import { agent, category, customers } from '../utils/dataStore';
import showToast from '../utils/ToastMessage';

const [marks, setMarks] = createStore<any>([]);

const ManageMark: Component = () => {
    let markNameChoise: Choices;
    let customerIDChoise: Choices;
    let categoryIDChoise: Choices;
    let agentIDChoise: Choices;

    setCollapseName({ collapse: 'marks', page: 'manageMark' });
    const [t] = useI18n();
    const params = useParams();

    const [SearchValue, setSearchValue] = createSignal<any>({});
    const [paramsValue, setParamsValue] = createSignal<any>(params.id);
    const [markManage, setMarkManage] = createSignal<any>();
    const [loading, setLoading] = createSignal(false);

    // eslint-disable-next-line solid/reactivity
    createEffect(async () => {
        if (paramsValue()) {
            setLoading(true);
            setCollapseName({ collapse: 'marks', page: 'manageMark' });
            const res = await getData('table', 'mark', `mark_id=${params.id}`);
            setMarkManage(res[0]);
            setParamsValue(false);
            setLoading(false);
        }
    });

    function handleChangeMark(e: Event): void {
        const target = e.target as HTMLInputElement;
        const { value }: { name: string; value: string | number } = target;
        setMarkManage(
            marks.find((item: { [x: string]: string }) => +item.mark_id === +value),
        );
    }

    function cleanChoice(name?: string) {
        markNameChoise?.setChoiceByValue('');
        if (name) {
            const choiceComponents: { [key: string]: Choices[] } = {
                'agent_id': [categoryIDChoise, customerIDChoise],
                'customer_id': [categoryIDChoise, agentIDChoise],
                'category_id': [customerIDChoise, agentIDChoise],
            };
            const componentsToReset = choiceComponents[name];
            componentsToReset?.forEach(component => component?.setChoiceByValue(''));
        } else {
            categoryIDChoise?.setChoiceByValue('');
            customerIDChoise?.setChoiceByValue('');
            agentIDChoise?.setChoiceByValue('');
        }
    }

    async function handleChangeDropdown(e: Event) {
        const target = e.target as HTMLInputElement;
        const { name, value }: { name: string; value: string | number } = target;

        cleanChoice(name);
        setSearchValue({});

        if (value === '') {
            setMarkManage();
            setMarks([]);
            refreshChoicesInstance([]);
            return;
        }

        setLoading(true);
        const result = await getData('table', 'mark', `${name}=${value}`);
        if (result.length === 1) {
            setMarkManage(result[0]);
            setLoading(false);
            return;
        }
        if (result?.length === 0) {
            showToast({ message: t('ipaz_markSearch_notFound'), type: 'default', duration: 1000 });
            setLoading(false);
        }
        setMarkManage();
        setMarks(result);
    }

    async function handleChangeMarkSearch(e: Event) {
        const target = e.target as HTMLInputElement;
        const { name, value, type }: { name: string; value: string | number; type: string } = target;

        cleanChoice();
        setSearchValue({});

        if (value === '') {
            setMarkManage();
            setMarks([]);
            refreshChoicesInstance([]);
            return;
        }

        setLoading(true);
        setSearchValue(signalValues => ({
            ...signalValues,
            [name]: type === 'number' ? +value : value,
        }));

        let result;
        if (name === 'mark_name') {
            const where = `name_en LIKE '%${value}%' OR name_ar LIKE '%${value}%';`;
            result = await getData('table', 'mark', where);
        } else {
            result = await getData('table', 'mark', `${name}=${value}`);
        }
        if (result.length === 1) {
            setMarkManage(result[0]);
            setLoading(false);
            return;
        }
        if (result?.length === 0) {
            showToast({ message: t('ipaz_markSearch_notFound'), type: 'default', duration: 1000 });
            setLoading(false);
        }
        setMarkManage();
        setMarks(result);
    }

    async function handleChangeAppSearch(e: Event) {
        const target = e.target as HTMLInputElement;
        const { name, value, type }: { name: string; value: string | number; type: string } = target;

        cleanChoice();
        setSearchValue({});

        if (value === '') {
            setMarkManage();
            setMarks([]);
            refreshChoicesInstance([]);
            return;
        }

        setLoading(true);
        setSearchValue(signalValues => ({
            ...signalValues,
            [name]: type === 'number' ? +value : value,
        }));

        const result = await getCustomData('custom', name, value);
        if (result.length === 1) {
            setMarkManage(result[0]);
            setLoading(false);
            return;
        }
        if (result?.length === 0) {
            showToast({ message: t('ipaz_markSearch_notFound'), type: 'default', duration: 1000 });
            setLoading(false);
        }
        setMarkManage();
        setMarks(result);
    }

    async function refreshChoicesInstance(values: any[]) {
        const markID: { value: any; label: any; selected?: any }[] = [{
            value: '',
            label: 'Choose...',
            selected: true,
        }];
        const markName: { value: any; label: any; selected?: any }[] = [{
            value: '',
            label: 'Choose...',
            selected: true,
        }];

        values.forEach(({ mark_id, name_ar, name_en }) => {
            markID.push({ value: mark_id, label: mark_id });
            markName.push({ value: mark_id, label: `${name_ar} - ${name_en}` });
        });
        markNameChoise?.setChoices(markName, 'value', 'label', true);
    }

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
        markNameChoise = new Choices(document.querySelector('.mark_name') as HTMLInputElement, {
            choices: [{ value: ' ', label: 'Choose...', selected: true }],
            shouldSort: false,
            renderChoiceLimit: 500,
            allowHTML: false,
            position: 'bottom',
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

    onCleanup(() => {
        markNameChoise?.destroy();
        customerIDChoise?.destroy();
        categoryIDChoise?.destroy();
        agentIDChoise?.destroy();
    });

    createEffect(() => {
        if (marks) {
            refreshChoicesInstance(marks).then(() => {
                setLoading(false);
            });
        }
    });

    return (
        <>
            <Show when={loading()}>
                <SpinnerComponent />
            </Show>
            <Title>{t('ipaz_mark_managPage_title')}</Title>
            <Card>
                <Card.Header>
                    <h5 class='card-title'>{t('ipaz_mark_managPage_CardTitle')}</h5>
                    <h6 class='card-subtitle text-muted'>{t('ipaz_mark_managPage_CardTitle2')}</h6>
                </Card.Header>

                <Form class='card-body'>
                    <Row>
                        <Form.Group as={Col} md='6' class='mb-3'>
                            <Form.Label>{t('ipaz_mark_nameCustomer')}</Form.Label>
                            <Form.Select
                                size='lg'
                                class='customer_id'
                                name='customer_id'
                                onChange={handleChangeDropdown}
                            />
                        </Form.Group>

                        <Form.Group as={Col} md='6' class='mb-3'>
                            <Form.Label>{t('ipaz_mark_agent')}</Form.Label>
                            <Form.Select
                                size='lg'
                                name='agent_id'
                                class='agent'
                                onChange={handleChangeDropdown}
                            />
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group as={Col} md='4' class='mb-3'>
                            <Form.Label>{t('ipaz_mark_category')}</Form.Label>
                            <Form.Select
                                size='lg'
                                name='category_id'
                                class='category_id'
                                onChange={handleChangeDropdown}
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
                        <Form.Group as={Col} md='4' class='mb-3'>
                            <Form.Label>{t('ipaz_mark_applicationId')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='custom_app_id'
                                step={1}
                                type='number'
                                placeholder={t('ipaz_mark_applicationId')}
                                onChange={handleChangeAppSearch}
                                value={SearchValue().custom_app_id ?? ''}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='4' class='mb-3'>
                            <Form.Label>{t('ipaz_mark_applicationDate')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='application_date'
                                step={1}
                                type='number'
                                placeholder={t('ipaz_mark_applicationDate')}
                                value={SearchValue().application_date ?? ''}
                                onChange={handleChangeAppSearch}
                            />
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group as={Col} md='4' class='mb-3'>
                            <Form.Label>{t('ipaz_mark_name')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='mark_name'
                                type='text'
                                onChange={handleChangeMarkSearch}
                                placeholder={t('ipaz_mark_name')}
                                value={SearchValue().mark_name ?? ''}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='4' class='mb-3'>
                            <Form.Label>{t('ipaz_mark_certificate_number')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='certificate_number'
                                step={1}
                                type='number'
                                placeholder={t('ipaz_mark_certificate_number')}
                                onChange={handleChangeMarkSearch}
                                value={SearchValue().certificate_number ?? ''}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='4' class='mb-3'>
                            <Form.Label>{t('ipaz_mark_marID')}</Form.Label>
                            <Form.Control
                                size='lg'
                                name='mark_id'
                                step={1}
                                type='number'
                                placeholder={t('ipaz_mark_marID')}
                                onChange={handleChangeMarkSearch}
                                value={SearchValue().mark_id ?? ''}
                            />
                        </Form.Group>
                    </Row>

                    <hr class='mt-4 mb-3' />

                    <h5 class='card-title mb-3'>{t('ipaz_mark_managPage_marksFound')}</h5>

                    <Row class='mb-3'>
                        <Form.Group as={Col} md='12'>
                            <Form.Label>{t('ipaz_mark_name')}</Form.Label>
                            <Form.Select
                                size='lg'
                                name='mark_name'
                                class='mark_name'
                                onChange={handleChangeMark}
                            />
                        </Form.Group>
                    </Row>
                </Form>
            </Card>

            <Show when={markManage()}>
                <MarkManageComponent
                    mark={markManage}
                    setMarks={setMarks}
                />
            </Show>
        </>
    );
};

export default ManageMark;
