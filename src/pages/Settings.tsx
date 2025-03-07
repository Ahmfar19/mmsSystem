import { useI18n } from '@solid-primitives/i18n';
import { Tab, Tabs } from 'solid-bootstrap';
import { Component, createSignal } from 'solid-js';
import { useAppContext } from '../AppContext';
import AccountTabComponent from '../components/settings/AcountTabComponent';
import NewUserTabComponent from '../components/settings/NewUserTabComponent';
import UsersTabComponent from '../components/settings/UsersTabComponent';
import { setCollapseName } from '../components/SidebarComponent';

const Settings: Component = () => {
    setCollapseName({ collapse: 'settings', page: 'accountSettings' });

    const [t] = useI18n();
    const { store } = useAppContext();
    const [key, setKey] = createSignal('account');
    const [edit, setEdit] = createSignal<number | undefined>();

    return (
        <Tabs
            id='controlled-tab-example'
            activeKey={key()}
            onSelect={(k: any) => setKey(k)}
            class='mb-3'
        >
            <Tab eventKey='account' title={t('ipaz_settings_account')}>
                <AccountTabComponent />
            </Tab>
            <Tab
                eventKey='users'
                title={t('ipaz_settings_users')}
                disabled={!store.isAdmin}
            >
                <UsersTabComponent
                    setKey={setKey}
                    setEdit={setEdit}
                />
            </Tab>
            <Tab
                eventKey='newUser'
                title={t('ipaz_settings_newUser')}
                disabled={!store.isAdmin}
            >
                <NewUserTabComponent
                    setKey={setKey}
                    edit={edit}
                    setEdit={setEdit}
                />
            </Tab>
        </Tabs>
    );
};

export default Settings;
