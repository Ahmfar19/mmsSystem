import { useI18n } from '@solid-primitives/i18n';
import feather from 'feather-icons';
import { Component, createSignal, onMount } from 'solid-js';
import { useAppContext } from '../AppContext';

const SettingsComponent: Component = () => {
    const [open, setOpen] = createSignal(false);
    const { store, changeTheme, changeSideBarLayout, changeSideBarPosition } = useAppContext();
    const [, { locale }] = useI18n();

    onMount(() => {
        feather.replace();
    });

    return (
        <div
            class='settings js-settings'
            classList={{ open: open() }}
        >
            <div class='settings-toggle js-settings-toggle' onClick={() => setOpen(!open())}>
                <i class='align-middle' data-feather='sliders' />
            </div>

            <div class='settings-panel'>
                <div class='settings-content'>
                    <div class='settings-title d-flex align-items-center'>
                        <button
                            type='button'
                            class='btn-close float-right js-settings-toggle'
                            onClick={() => setOpen(false)}
                        />
                        <h4 class='mb-0 ms-2 d-inline-block'>
                            Settings
                        </h4>
                    </div>

                    <div class='settings-body'>
                        <div class='alert alert-primary' role='alert'>
                            <div class='alert-message'>
                                <strong>Hey there!</strong> Choose the color scheme, sidebar and layout.
                            </div>
                        </div>

                        <div class='mb-3'>
                            <span class='d-block fw-bold'>Color scheme</span>{' '}
                            <span class='d-block text-muted mb-2'>The perfect color mode for your app.</span>
                            <div class='row g-0 text-center mx-n1 mb-2'>
                                <div class='col'>
                                    <label class='mx-1 d-block mb-1'>
                                        <input
                                            class='settings-scheme-label'
                                            type='radio'
                                            name='default'
                                            value='default'
                                            checked={store.theme === 'default'}
                                            onClick={() => changeTheme('default')}
                                        />
                                        <div class='settings-scheme'>
                                            <div class='settings-scheme-theme settings-scheme-theme-default' />
                                        </div>
                                    </label>
                                    Default
                                </div>

                                <div class='col'>
                                    <label class='mx-1 d-block mb-1'>
                                        <input
                                            class='settings-scheme-label'
                                            type='radio'
                                            name='colored'
                                            value='colored'
                                            checked={store.theme === 'colored'}
                                            onClick={() => changeTheme('colored')}
                                        />
                                        <div class='settings-scheme'>
                                            <div class='settings-scheme-theme settings-scheme-theme-colored' />
                                        </div>
                                    </label>
                                    Colored
                                </div>
                            </div>

                            <div class='row g-0 text-center mx-n1'>
                                <div class='col'>
                                    <label class='mx-1 d-block mb-1'>
                                        <input
                                            class='settings-scheme-label'
                                            type='radio'
                                            name='dark'
                                            value='dark'
                                            checked={store.theme === 'dark'}
                                            onClick={() => changeTheme('dark')}
                                        />
                                        <div class='settings-scheme'>
                                            <div class='settings-scheme-theme settings-scheme-theme-dark' />
                                        </div>
                                    </label>
                                    Dark
                                </div>

                                <div class='col'>
                                    <label class='mx-1 d-block mb-1'>
                                        <input
                                            class='settings-scheme-label'
                                            type='radio'
                                            name='light'
                                            value='light'
                                            checked={store.theme === 'light'}
                                            onClick={() => changeTheme('light')}
                                        />
                                        <div class='settings-scheme'>
                                            <div class='settings-scheme-theme settings-scheme-theme-light' />
                                        </div>
                                    </label>
                                    Light
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div class='mb-3'>
                            <span class='d-block fw-bold'>Language</span>{' '}
                            <span class='d-block text-muted mb-2'>Change the labguage of the app.</span>
                            <div>
                                <label>
                                    <input
                                        class='settings-button-label'
                                        type='radio'
                                        name='sidebarLanguage'
                                        value='default'
                                        checked={store.locale === 'en'}
                                    />
                                    <div
                                        class='settings-button mx-1'
                                        onClick={() => {
                                            locale('en');
                                        }}
                                    >
                                        English
                                    </div>
                                </label>

                                <label>
                                    <input
                                        class='settings-button-label'
                                        type='radio'
                                        name='sidebarLanguage'
                                        value='compact'
                                        checked={store.locale === 'ar'}
                                    />
                                    <div
                                        class='settings-button mx-1'
                                        onClick={() => {
                                            locale('ar');
                                        }}
                                    >
                                        Arabic
                                    </div>
                                </label>
                            </div>
                        </div>

                        <hr />

                        <div class='mb-3'>
                            <span class='d-block fw-bold'>Sidebar layout</span>{' '}
                            <span class='d-block text-muted mb-2'>Change the layout of the sidebar.</span>
                            <div>
                                <label>
                                    <input
                                        class='settings-button-label'
                                        type='radio'
                                        name='sidebarLayout'
                                        value='default'
                                        checked={store.sidebarLayout === 'default'}
                                    />
                                    <div
                                        class='settings-button mx-1'
                                        onClick={() => changeSideBarLayout('default')}
                                    >
                                        Default
                                    </div>
                                </label>

                                <label>
                                    <input
                                        class='settings-button-label'
                                        type='radio'
                                        name='sidebarLayout'
                                        value='compact'
                                        checked={store.sidebarLayout === 'compact'}
                                    />
                                    <div
                                        class='settings-button mx-1'
                                        onClick={() => changeSideBarLayout('compact')}
                                    >
                                        Compact
                                    </div>
                                </label>
                            </div>
                        </div>

                        <hr />

                        <div class='mb-3'>
                            <span class='d-block fw-bold'>Sidebar position</span>{' '}
                            <span class='d-block text-muted mb-2'>Toggle the position of the sidebar.</span>
                            <div>
                                <label>
                                    <input
                                        class='settings-button-label'
                                        type='radio'
                                        name='sidebarPosition'
                                        value='left'
                                        checked={store.sidebarPosition === 'left'}
                                    />
                                    <div
                                        class='settings-button mx-1'
                                        onClick={() => changeSideBarPosition('left')}
                                    >
                                        Left
                                    </div>
                                </label>

                                <label>
                                    <input
                                        class='settings-button-label'
                                        type='radio'
                                        name='sidebarPosition'
                                        value='right'
                                        checked={store.sidebarPosition === 'right'}
                                    />
                                    <div
                                        class='settings-button mx-1'
                                        onClick={() => changeSideBarPosition('right')}
                                    >
                                        Right
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsComponent;
