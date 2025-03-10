import { useI18n } from '@solid-primitives/i18n';
import { Card, Table } from 'solid-bootstrap';
import { Component, createSignal, For, Show } from 'solid-js';
import { useAppContext } from '../../AppContext';
import { deleteData } from '../../utils/api';
import { getRole } from '../../utils/functions';
import { refetchStaffs, staffs } from '../../utils/staff';
import showToast from '../../utils/ToastMessage';
import DialogController from '../Dialog/DialogController';
import NewUserComponent from './NewUserComponent';

const UsersManageComponent: Component = () => {
    const [t] = useI18n();
    const { store } = useAppContext();
    const [editMode, setEditMode] = createSignal<number | undefined>();

    async function onUserDelete(id: number) {
        new DialogController({
            title: t('ipaz_modal_confirmTitle'),
            body: t('ipaz_modal_confirm'),
            t,
            buttons: [
                {
                    text: t('ipaz_modal_yes'),
                    variant: 'primary',
                    submit: true,
                },
                {
                    text: t('ipaz_modal_no'),
                    variant: 'danger',
                },
            ],
            done: async (ok) => {
                if (!ok) return false;

                const { error } = await deleteData('table', id, 'staff');
                if (error) {
                    showToast({ message: t('ipaz_alert_fail_deleteUser'), type: 'error' });
                    return false;
                }
                refetchStaffs();
                showToast({ message: t('ipaz_alert_success_deleteUser'), type: 'success' });
                return true;
            },
        }).show();
    }

    function handleUpdate(id: number): void {
        setEditMode(id);
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
                    <h5 class='card-title'>{t('dek_settings_AllUsers')}</h5>
                </Card.Header>

                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>{t('ipaz_settings_username')}</th>
                                <th>{t('ipaz_sidebar_customoerFirstName')}</th>
                                <th>{t('ipaz_sidebar_customoerLasrName')}</th>
                                <th>{t('ipaz_login_email')}</th>
                                <th>{t('ipaz_settings_phone')}</th>
                                <th>{t('ipaz_settings_role')}</th>
                                <th>{t('ipaz_mark_managPage_appOptions')}</th>
                            </tr>
                        </thead>

                        <tbody>
                            <For each={staffs()}>
                                {(staff) => (
                                    <Show when={staff.staff_id !== store.staff.staff_id}>
                                        <tr>
                                            <td>{staff.username}</td>
                                            <td>{staff.fname}</td>
                                            <td>{staff.lname}</td>
                                            <td>{staff.email}</td>
                                            <td>{staff.phone}</td>
                                            <td>{t(getRole(staff.role))}</td>
                                            <td class='d-flex'>
                                                <button
                                                    class='btn btn-primary px-2 mx-1'
                                                    title={t('ec_button_edit')}
                                                    onClick={() => handleUpdate(+staff.staff_id!)}
                                                >
                                                    <i class='align-middle fas fa-fw fa-user-edit' />
                                                </button>
                                                <button
                                                    class='btn btn-danger px-2'
                                                    title={t('ec_button_delete')}
                                                    onClick={() => onUserDelete(+staff.staff_id!)}
                                                >
                                                    <i class='align-middle fas fa-fw fa-trash' />
                                                </button>
                                            </td>
                                        </tr>
                                    </Show>
                                )}
                            </For>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Show>
    );
};

export default UsersManageComponent;
