import { useI18n } from '@solid-primitives/i18n';
import { Title } from '@solidjs/meta';
import { useNavigate } from '@solidjs/router';
import { Card } from 'solid-bootstrap';
import { Component, createEffect, createSignal, Show } from 'solid-js';
import { setCollapseName } from '../components/SidebarComponent';
import TableComponent from '../components/TableComponent';
import { deleteData } from '../utils/api';
import { agent, mutateAgent } from '../utils/dataStore';
import showToast from '../utils/ToastMessage';

const AllAgents: Component = () => {
    const [t] = useI18n();
    setCollapseName({ collapse: 'agents', page: 'AllAgents' });
    const navigate = useNavigate();

    const [dataIsFetched, setDataIsFetched] = createSignal(false);

    const headers = [
        'ipaz_sidebar_ID',
        'ipaz_agent_name',
        'ipaz_agent_register',
        'ipaz_agent_adress',
        'ipaz_mark_managPage_appOptions',
    ];

    const keys = [
        'agent_id',
        'agent',
        'agent_register',
        'agent_Adress',
    ];

    async function handleDelete(id: number): Promise<boolean> {
        const { error } = await deleteData('table', id, 'agent');
        if (error) {
            showToast({ message: t('ipaz_alert_fail_deleteData'), type: 'error' });
            return false;
        }

        mutateAgent(agent().filter((item: any) => +item.agent_id !== +id));
        showToast({ message: t('ipaz_alert_success_deleteData'), type: 'success' });
        return true;
    }

    function handleUpdate(id: number): void {
        navigate(`/newagent/edit/${id}`);
    }

    createEffect(() => {
        if (!agent.loading) {
            setDataIsFetched(true);
        }
    });

    return (
        <>
            <Title>{t('ipaz_agent_all')}</Title>
            <Card>
                <Card.Header class='h2'>{t('ipaz_agent_all')}</Card.Header>
                <Card.Header class='mt-0 pt-0'>{t('ipaz_cardTitle_searchDeleteEdit')}</Card.Header>
                <Card.Body dir='ltr'>
                    <Show when={dataIsFetched()}>
                        <TableComponent
                            id='allAgents'
                            columnsHeader={headers}
                            keys={keys}
                            data={agent}
                            handleDelete={handleDelete}
                            handleUpdate={handleUpdate}
                            options={{ edit: true, delete: true, id: 'agent_id' }}
                        />
                    </Show>
                </Card.Body>
            </Card>
        </>
    );
};

export default AllAgents;
