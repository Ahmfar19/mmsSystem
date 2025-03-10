/* eslint-disable solid/style-prop */
import { useI18n } from '@solid-primitives/i18n';
import { A, useNavigate } from '@solidjs/router';
import * as bootstrap from 'bootstrap';
import { Button } from 'solid-bootstrap';
import { Component, createEffect, createSignal } from 'solid-js';
import { useAppContext } from '../AppContext';
import { collapse } from './NavComponent';

const [collapseName, setCollapseName] = createSignal<{ collapse: string; page: string }>();

const SidebarComponent: Component = () => {
    const [t] = useI18n();
    const { clearAllCookies, setStore } = useAppContext();
    const navigate = useNavigate();

    createEffect(() => {
        if (collapseName()) {
            const collapseElementList = document.getElementById(collapseName()?.collapse!);
            const isOpen = collapseElementList?.classList.contains('show');
            if (!isOpen) {
                const collapseElement = new bootstrap.Collapse(collapseElementList!);
                collapseElement.toggle();
            }
        }
    });

    function handleLogout() {
        clearAllCookies();
        setStore('isInlogged', false);
        navigate(`/login`, { replace: true });
    }

    return (
        <nav id='sidebar' class='sidebar js-sidebar' classList={{ collapsed: collapse() }}>
            <div class='sidebar-content js-simplebar' data-simplebar='init'>
                <div class='simplebar-wrapper' style='margin: 0px;'>
                    <div class='simplebar-height-auto-observer-wrapper'>
                        <div class='simplebar-height-auto-observer' />
                    </div>
                    <div class='simplebar-mask'>
                        <div class='simplebar-offset' style='right: 0px; bottom: 0px;'>
                            <div
                                class='simplebar-content-wrapper'
                                tabindex='0'
                                role='region'
                                aria-label='scrollable content'
                                style='height: 100%; overflow: hidden scroll;'
                            >
                                <div class='simplebar-content' style='padding: 0px;'>
                                    <A class='sidebar-brand' href='/home'>
                                        <span class='sidebar-brand-text align-middle'>
                                            {t('ipaz_sidebar_companyName')}
                                        </span>
                                        <svg
                                            class='sidebar-brand-icon align-middle'
                                            width='32px'
                                            height='32px'
                                            viewBox='0 0 24 24'
                                            fill='none'
                                            stroke='#FFFFFF'
                                            stroke-width='1.5'
                                            stroke-linecap='square'
                                            stroke-linejoin='miter'
                                            color='#FFFFFF'
                                            style='margin-left: -3px'
                                        >
                                            <path d='M12 4L20 8.00004L12 12L4 8.00004L12 4Z' />
                                            <path d='M20 12L12 16L4 12' />
                                            <path d='M20 16L12 20L4 16' />
                                        </svg>
                                    </A>

                                    <div class='sidebar-user'>
                                        <div class='d-flex justify-content-center'>
                                            <div class='flex-shrink-0'>
                                                <img
                                                    src='/img/logo/logo_mini.png'
                                                    class='avatar img-fluid rounded me-1 bg-light'
                                                    alt='Charles Hall'
                                                />
                                            </div>
                                            <div class='flex-grow-1 ps-2'>
                                                <span class='sidebar-user-title'>
                                                    {t('iapz_company_name')}
                                                </span>
                                                <div class='sidebar-user-subtitle'>{t('iapz_company_title')}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <ul class='sidebar-nav'>
                                        <li class='sidebar-header display-2'>
                                            {t('ipaz_sidebar_pages')}
                                        </li>
                                        <li
                                            class='sidebar-item'
                                            classList={{ active: collapseName()?.collapse === 'marks' }}
                                        >
                                            <a
                                                data-bs-target='#marks'
                                                data-bs-toggle='collapse'
                                                class='sidebar-link'
                                            >
                                                <i class='align-middle' data-feather='sliders' />
                                                <span class='align-middle'>{t('ipaz_sidebar_tradMarks')}</span>
                                            </a>
                                            <ul
                                                id='marks'
                                                class='sidebar-dropdown list-unstyled collapse'
                                                data-bs-parent='#sidebar'
                                            >
                                                <li
                                                    class='sidebar-item'
                                                    classList={{ active: collapseName()?.page === 'home' }}
                                                >
                                                    <A class='sidebar-link' href='/home'>
                                                        {t('ipaz_sidebar_home')}
                                                    </A>
                                                </li>

                                                <li
                                                    class='sidebar-item'
                                                    classList={{ active: collapseName()?.page === 'newMark' }}
                                                >
                                                    <A class='sidebar-link' href='/newMark'>
                                                        {t('ipaz_sidebar_newMark')}
                                                    </A>
                                                </li>

                                                <li
                                                    class='sidebar-item'
                                                    classList={{ active: collapseName()?.page === 'searchMark' }}
                                                >
                                                    <A class='sidebar-link' href='/searchMark'>
                                                        {t('ipaz_sidebar_markSearch')}
                                                    </A>
                                                </li>

                                                <li
                                                    class='sidebar-item'
                                                    classList={{ active: collapseName()?.page === 'manageMark' }}
                                                >
                                                    <A class='sidebar-link' href='/managemark'>
                                                        {t('ipaz_sidebar_markManage')}
                                                    </A>
                                                </li>
                                            </ul>
                                        </li>

                                        <li
                                            class='sidebar-item'
                                            classList={{ active: collapseName()?.collapse === 'customers' }}
                                        >
                                            <a
                                                data-bs-target='#customers'
                                                data-bs-toggle='collapse'
                                                class='sidebar-link collapsed'
                                            >
                                                <i class='align-middle' data-feather='users' />
                                                <span class='align-middle'>
                                                    {t('ipaz_sidebar_customers')}
                                                </span>
                                            </a>
                                            <ul
                                                id='customers'
                                                class='sidebar-dropdown list-unstyled collapse '
                                                data-bs-parent='#sidebar'
                                            >
                                                <li
                                                    class='sidebar-item'
                                                    classList={{ active: collapseName()?.page === 'newCustomer' }}
                                                >
                                                    <A class='sidebar-link' href='/newCustomer'>
                                                        {t('ipaz_sidebar_addCustomers')}
                                                    </A>
                                                </li>
                                                <li
                                                    class='sidebar-item'
                                                    classList={{ active: collapseName()?.page === 'allCustomers' }}
                                                >
                                                    <A class='sidebar-link' href='/allCustomers'>
                                                        {t('ipaz_sidebar_adllCustomers')}
                                                    </A>
                                                </li>
                                            </ul>
                                        </li>

                                        <li
                                            class='sidebar-item'
                                            classList={{ active: collapseName()?.collapse === 'agents' }}
                                        >
                                            <a
                                                data-bs-target='#agents'
                                                data-bs-toggle='collapse'
                                                class='sidebar-link collapsed'
                                            >
                                                <i class='align-middle' data-feather='briefcase' />
                                                <span class='align-middle'>
                                                    {t('ipaz_mark_agents')}
                                                </span>
                                            </a>
                                            <ul
                                                id='agents'
                                                class='sidebar-dropdown list-unstyled collapse '
                                                data-bs-parent='#sidebar'
                                            >
                                                <li
                                                    class='sidebar-item'
                                                    classList={{ active: collapseName()?.page === 'newAgent' }}
                                                >
                                                    <A class='sidebar-link' href='/newagent'>
                                                        {t('ipaz_agent_add')}
                                                    </A>
                                                </li>
                                                <li
                                                    class='sidebar-item'
                                                    classList={{ active: collapseName()?.page === 'AllAgents' }}
                                                >
                                                    <A class='sidebar-link' href='/allagents'>
                                                        {t('ipaz_agent_all')}
                                                    </A>
                                                </li>
                                            </ul>
                                        </li>

                                        <li
                                            class='sidebar-item'
                                            classList={{ active: collapseName()?.collapse === 'settings' }}
                                        >
                                            <a
                                                data-bs-target='#settings'
                                                data-bs-toggle='collapse'
                                                class='sidebar-link collapsed'
                                            >
                                                <i class='align-middle' data-feather='settings' />
                                                <span class='align-middle'>
                                                    {t('ipaz_settings_name')}
                                                </span>
                                            </a>
                                            <ul
                                                id='settings'
                                                class='sidebar-dropdown list-unstyled collapse '
                                                data-bs-parent='#sidebar'
                                            >
                                                <li
                                                    class='sidebar-item'
                                                    classList={{ active: collapseName()?.page === 'accountSettings' }}
                                                >
                                                    <A class='sidebar-link' href='/settings'>
                                                        {t('ipaz_settings_accountSettings')}
                                                    </A>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>

                                    <div class='sidebar-cta w-100'>
                                        <div class='sidebar-cta-content'>
                                            <div class='d-grid'>
                                                <Button
                                                    class='btn btn-outline-primary'
                                                    onClick={handleLogout}
                                                >
                                                    {t('ipaz_sidebar_logout')}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='simplebar-placeholder' style='width: auto; height: 1321px;' />
                </div>
                <div class='simplebar-track simplebar-horizontal' style='visibility: hidden;'>
                    <div class='simplebar-scrollbar' style='width: 0px; display: none;' />
                </div>
                <div class='simplebar-track simplebar-vertical' style='visibility: visible;'>
                    <div
                        class='simplebar-scrollbar'
                        style='height: 836px; transform: translate3d(0px, 0px, 0px); display: block;'
                    />
                </div>
            </div>
        </nav>
    );
};
export default SidebarComponent;
export { setCollapseName };
