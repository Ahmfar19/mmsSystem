import { useI18n } from '@solid-primitives/i18n';
import { Title } from '@solidjs/meta';
import { useNavigate } from '@solidjs/router';
import { Card } from 'solid-bootstrap';
import { Component, createEffect, createSignal, Show } from 'solid-js';
import { setCollapseName } from '../components/SidebarComponent';
import SpinnerComponent from '../components/SpinnerComponent';
import TableComponent from '../components/TableComponent';
import { deleteData } from '../utils/api';
import { customers, mutateCustomers } from '../utils/dataStore';
import showToast from '../utils/ToastMessage';

const AllCustomers: Component = () => {
    const [t] = useI18n();
    setCollapseName({ collapse: 'customers', page: 'allCustomers' });
    const navigate = useNavigate();

    const [dataIsFetched, setDataIsFetched] = createSignal(false);

    const headers = [
        'ipaz_sidebar_ID',
        'ipaz_sidebar_customoerFirstName',
        'ipaz_sidebar_customoerLasrName',
        'ipaz_sidebar_customoerFatherName',
        'ipaz_sidebar_customoerMotherName',
        'ipaz_sidebar_customoerAdress',
        'ipaz_sidebar_customoerPhoneNumber',
        'ipaz_sidebar_customoerPersonNumber',
        'ipaz_sidebar_customoerNationality',
        'ipaz_mark_managPage_appOptions',
    ];

    const keys = [
        'customer_id',
        'firstname',
        'lastname',
        'fathername',
        'mothername',
        'adress',
        'phonenumber',
        'personnumber',
        'nationality',
    ];

    async function handleDelete(id: number): Promise<boolean> {
        const { error } = await deleteData('table', id, 'customer');
        if (error) {
            showToast({ message: t('ipaz_alert_fail_deleteData'), type: 'error' });
            return false;
        }
        mutateCustomers(customers().filter((item: any) => +item.customer_id !== +id));
        showToast({ message: t('ipaz_alert_success_deleteData'), type: 'success' });
        return true;
    }

    function handleUpdate(id: number): void {
        navigate(`/newcustomer/edit/${id}`);
    }

    createEffect(() => {
        if (!customers.loading) {
            setDataIsFetched(true);
        }
    });

    return (
        <>
            <Title>{t('ipaz_sidebar_adllCustomers')}</Title>
            <Card>
                <Card.Header class='h2'>{t('ipaz_sidebar_adllCustomers')}</Card.Header>
                <Card.Header class='mt-0 pt-0'>{t('ipaz_cardTitle_searchDeleteEdit')}</Card.Header>
                <Card.Body dir='ltr'>
                    <Show when={dataIsFetched()} fallback={<SpinnerComponent />}>
                        <TableComponent
                            id='AllCustomers'
                            columnsHeader={headers}
                            keys={keys}
                            data={customers}
                            handleDelete={handleDelete}
                            handleUpdate={handleUpdate}
                            options={{ edit: true, delete: true, id: 'customer_id' }}
                        />
                    </Show>
                </Card.Body>
            </Card>
        </>
    );
};

export default AllCustomers;
