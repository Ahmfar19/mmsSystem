import { useI18n } from '@solid-primitives/i18n';
import feather from 'feather-icons';
import { Card, Table } from 'solid-bootstrap';
import { Component, createEffect, createResource, For, Setter, Show } from 'solid-js';
import { deleteData, getData } from '../../utils/api';
import { roles } from '../../utils/dataStore';
import showToast from '../../utils/ToastMessage';

export const [users, { refetch: refetchUser, mutate: mutateUsers }] = createResource(
    () => getData('staff', 'staff_id != 1'),
);

const UsersTabComponent: Component<{
    setKey: Setter<string>;
    setEdit: Setter<number | undefined>;
}> = (props) => {
    const [t, { locale }] = useI18n();

    createEffect(() => {
        if (users()) {
            feather.replace();
        }
    });

    async function onUserDelete(id: number): Promise<boolean> {
        const { error } = await deleteData(id, 'staff', 'staff_id');
        if (error) {
            showToast({ message: t('ipaz_alert_fail_deleteData'), type: 'error' });
            return false;
        }
        refetchUser();
        showToast({ message: t('ipaz_alert_success_deleteData'), type: 'success' });
        return true;
    }

    function handleUpdate(id: number): void {
        props.setEdit(id);
        props.setKey('newUser');
    }

    return (
        <Show when={users()}>
            <Card>
                <Card.Header class='pb-0'>
                    <h5 class='card-title'>{t('ipaz_settings_allUsers')}</h5>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>{t('ipaz_sidebar_ID')}</th>
                                <th>{t('ipaz_settings_username')}</th>
                                <th>{t('ipaz_sidebar_customoerFirstName')}</th>
                                <th>{t('ipaz_sidebar_customoerLasrName')}</th>
                                <th>{t('ipaz_login_email')}</th>
                                <th>{t('ipaz_sidebar_customoerPhoneNumber')}</th>
                                <th>{t('ipaz_settings_role')}</th>
                                <th>{t('ipaz_mark_managPage_appOptions')}</th>
                            </tr>
                        </thead>

                        <tbody>
                            <For each={users()}>
                                {(user) => (
                                    <tr>
                                        <td>{user.staff_id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.fname}</td>
                                        <td>{user.lname}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{roles[locale()!][user.role]?.role}</td>
                                        <td>
                                            <button
                                                class='btn btn-primary mx-1 my-1'
                                                title={t('ipaz_buttonTooltip_edit')}
                                                onClick={() => handleUpdate(+user.staff_id)}
                                            >
                                                <i class='align-middle' data-feather='edit' />
                                            </button>
                                            <button
                                                class='btn btn-danger mx-1 my-1'
                                                title={t('ipaz_buttonTooltip_delete')}
                                                onClick={() => onUserDelete(+user.staff_id)}
                                            >
                                                <i class='align-middle' data-feather='trash-2' />
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

export default UsersTabComponent;
