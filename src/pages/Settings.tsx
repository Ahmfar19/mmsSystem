import { useI18n } from '@solid-primitives/i18n';
import { Title } from '@solidjs/meta';
import { Card, Col, Row } from 'solid-bootstrap';
import { Component, Show } from 'solid-js';
import { useAppContext } from '../AppContext';
import AccountComponent from '../components/settings/AccountComponent';
import NewUserComponent from '../components/settings/NewUserComponent';
import PasswordComponent from '../components/settings/PasswordComponent';
import UsersManageComponent from '../components/settings/UsersManageComponent';
import { setCollapseName } from '../components/SidebarComponent';

const Settings: Component = () => {
    setCollapseName({ collapse: 'settings', page: 'accountSettings' });
    const [t] = useI18n();
    const { store } = useAppContext();

    return (
        <>
            <Title>{t('ipaz_settings_name')}</Title>
            <Row>
                <Col md={3} cl={2}>
                    <Card>
                        <Card.Header>
                            <Card.Title>
                                {t('ipaz_settings_accountSettings')}
                            </Card.Title>
                        </Card.Header>
                        <div class='list-group list-group-flush' role='tablist'>
                            <a
                                class='list-group-item list-group-item-action active'
                                data-bs-toggle='list'
                                href='#account'
                                role='tab'
                            >
                                {t('ipaz_settings_account')}
                            </a>
                            <a
                                class='list-group-item list-group-item-action'
                                data-bs-toggle='list'
                                href='#password'
                                role='tab'
                            >
                                {t('ipaz_settings_password')}
                            </a>
                            <Show when={store.isAdmin}>
                                <a
                                    class='list-group-item list-group-item-action'
                                    data-bs-toggle='list'
                                    href='#newAccount'
                                    role='tab'
                                >
                                    {t('ipaz_settings_newUser')}
                                </a>
                                <a
                                    class='list-group-item list-group-item-action'
                                    data-bs-toggle='list'
                                    href='#manageAccount'
                                    role='tab'
                                >
                                    {t('ipaz_settings_manageAccount')}
                                </a>
                            </Show>
                        </div>
                    </Card>
                </Col>

                <Col md={9} cl={10}>
                    <div class='tab-content'>
                        <div class='tab-pane fade show active' id='account' role='tabpanel'>
                            <AccountComponent />
                        </div>
                        <div class='tab-pane fade show' id='password' role='tabpanel'>
                            <PasswordComponent />
                        </div>
                        <div class='tab-pane fade show' id='newAccount' role='tabpanel'>
                            <NewUserComponent />
                        </div>

                        <div class='tab-pane fade show' id='manageAccount' role='tabpanel'>
                            <UsersManageComponent />
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default Settings;
