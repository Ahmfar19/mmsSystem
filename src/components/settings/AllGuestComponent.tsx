import { useI18n } from '@solid-primitives/i18n';
import { Card, Table } from 'solid-bootstrap';
import { Accessor, Component, createSignal, For, Show } from 'solid-js';
import { delteGuestAccount } from '../../api/employee';
import { CompanyType } from '../../types';
import { showToast } from '../../utils/ToastMessage';
import DialogController from '../Dialog/DialogController';
import NewUserComponent from './NewUserComponent';

const AllGuestComponent: Component<{
    guestAccounts: Accessor<CompanyType[] | undefined>;
    mutateGuests: Function;
}> = (props) => {
    const [t] = useI18n();

    const [editMode, setEditMode] = createSignal<number | undefined>();

    async function onGuestDelete(id: number) {
        new DialogController({
            title: t('dek_modal_confirmTitle'),
            body: t('dek_modal_confirm'),
            t,
            buttons: [
                {
                    text: t('dek_button_yes'),
                    variant: 'primary',
                    submit: true,
                },
                {
                    text: t('dek_button_no'),
                    variant: 'danger',
                },
            ],
            done: async (ok) => {
                if (!ok) {
                    return false;
                }

                const { error } = await delteGuestAccount(id);

                if (error) {
                    showToast({ message: t('dek_guest_FailddeletingAccount'), type: 'error' });
                    return false;
                }
                props.mutateGuests((prev: CompanyType[]) => prev.filter((item) => +item.company_id! !== +id));
                showToast({ message: t('dek_guest_sccessdeltedAccount'), type: 'success' });
                return true;
            },
        }).show();
    }

    return (
        <Show
            when={!editMode()}
            fallback={
                <NewUserComponent
                    setEditMode={setEditMode}
                    id={editMode()}
                />
            }
        >
            <Card>
                <Card.Header class='pb-0'>
                    <h5 class='card-title'>
                        {t('dek_guest_allGuestAccounts')} ({props.guestAccounts()?.length || 0})
                    </h5>
                </Card.Header>

                <Card.Body class='card-scroll'>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>{t('dek_company_id')}</th>
                                <th>{t('dek_company_companyName')}</th>
                                <th>{t('dek_company_companyType')}</th>
                                <th>{t('dek_company_email')}</th>
                                <th>{t('dek_settings_phone')}</th>
                                <th>{t('dek_table_options')}</th>
                            </tr>
                        </thead>

                        <tbody>
                            <For each={props.guestAccounts()}>
                                {(account) => (
                                    <tr>
                                        <td>{account.company_id}</td>
                                        <td>{account.company_name}</td>
                                        <td>{account.type_name}</td>
                                        <td>{account.email}</td>
                                        <td>{account.phone}</td>
                                        <td class='d-flex'>
                                            <button
                                                class='btn btn-danger px-2'
                                                title={t('dek_button_delete')}
                                                onClick={() => onGuestDelete(+account.company_id!)}
                                            >
                                                <i class='align-middle fas fa-fw fa-trash' />
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Show>
    );
};

export default AllGuestComponent;
