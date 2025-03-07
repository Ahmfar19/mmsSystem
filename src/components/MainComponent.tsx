import { useI18n } from '@solid-primitives/i18n';
import { useLocation } from '@solidjs/router';
import feather from 'feather-icons';
import { createEffect, createMemo, createSignal, JSX, onMount, Show } from 'solid-js';
import { useAppContext } from '../AppContext';
import FooterComponent from './FooterComponent';
import NavComponent from './NavComponent';
import SettingsComponent from './SettingsComponent';
import SidebarComponent from './SidebarComponent';

interface MainLayoutProps {
    children: JSX.Element;
}

const MainComponent = (props: MainLayoutProps) => {
    const blackList = ['login', 'invoiveMark', 'blank'];
    const [showMain, setShowMain] = createSignal(true);
    const { store } = useAppContext();
    const [, { locale }] = useI18n();

    const location = useLocation();
    const pathname = createMemo(() => location.pathname);

    if (store.theme === 'dark') {
        document.querySelector('.js-light')?.remove();
    } else {
        document.querySelector('.js-dark')?.remove();
    }

    createEffect(() => {
        if (blackList.includes(pathname().split('/')[1])) {
            setShowMain(false);
        } else if (store.staffID) {
            setShowMain(true);
        }
    });

    onMount(() => {
        feather.replace();
    });

    return (
        <>
            <Show when={showMain()}>
                <SidebarComponent />
            </Show>
            <div class='main'>
                <Show when={showMain()}>
                    <NavComponent />
                </Show>
                <main
                    class='content'
                    classList={{ rtl: locale() === 'ar' }}
                >
                    <div class='container-fluid p-0'>
                        {props.children}
                    </div>
                </main>
                <Show when={showMain()}>
                    <FooterComponent />
                    <SettingsComponent />
                </Show>
            </div>
        </>
    );
};

export default MainComponent;
