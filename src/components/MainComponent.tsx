import { useI18n } from '@solid-primitives/i18n';
import { useLocation } from '@solidjs/router';
import feather from 'feather-icons';
import { createEffect, createMemo, createSignal, JSX, onMount, Show } from 'solid-js';
import { useAppContext } from '../AppContext';
import FooterComponent from './FooterComponent';
import NavComponent from './NavComponent';
import SettingsComponent from './SettingsComponent';
import SidebarComponent from './SidebarComponent';
import SpinnerComponent from './SpinnerComponent';

interface MainLayoutProps {
    children: JSX.Element;
}

const MainComponent = (props: MainLayoutProps) => {
    const { store } = useAppContext();
    const [, { locale }] = useI18n();

    const location = useLocation();
    const pathname = createMemo(() => location.pathname);

    const [showMain, setShowMain] = createSignal(false);

    const blackList = ['login', 'invoiveMark', 'blank'];

    createEffect(() => {
        if (blackList.includes(pathname().split('/')[1])) {
            setShowMain(false);
        } else if (store.staff.staff_id) {
            setShowMain(true);
        } else {
            setShowMain(true);
        }
    });

    onMount(() => {
        feather.replace();
    });

    return (
        <Show when={!store.onAuthenticate} fallback={<SpinnerComponent />}>
            <Show
                when={store.isInlogged}
                fallback={
                    <div class='main'>
                        {props.children}
                    </div>
                }
            >
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
            </Show>
        </Show>
    );
};

export default MainComponent;
