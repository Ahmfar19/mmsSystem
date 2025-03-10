import { createI18nContext, I18nContext } from '@solid-primitives/i18n';
import { useLocation, useNavigate } from '@solidjs/router';
import {
    createContext,
    createEffect,
    createResource,
    createSignal,
    onMount,
    ParentComponent,
    untrack,
    useContext,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { getCookie, removeCookie } from 'typescript-cookie';
import { getData } from './utils/api';
import { AppContextState, AppContextValue } from './utils/types';
import { generateDeviceFingerprint, handleDecrypt } from './utils/utils';

const defaultState: AppContextState = {
    theme: localStorage.getItem('theme') || 'default',
    locale: localStorage.getItem('locale') || 'ar',
    sidebarPosition: localStorage.getItem('sidebarPosition') || 'left',
    sidebarLayout: localStorage.getItem('sidebarLayout') || 'default',
    accessToken: getCookie('accessToken'),
    fingerprint: '',
    staff: { staff_id: getCookie('staff_id') } as any,
    isAdmin: false,
    isInlogged: false,
    onAuthenticate: false,
};

const AppContext = createContext<AppContextValue>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const langs: { [langName: string]: () => Promise<any> } = {
    en: async () => (await import('../lang/en.json')).default,
    ar: async () => (await import('../lang/ar.json')).default,
};

export const [fetchInventoryId, setFetchInventoryId] = createSignal<string>();
export const [shouldFetch, setShouldFetch] = createSignal();

export const AppContextProvider: ParentComponent = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [store, setStore] = createStore(defaultState);

    const i18n = createI18nContext({}, localStorage.getItem('locale') || defaultState.locale);
    const [, { add, locale }] = i18n;

    const [lang] = createResource(() => i18n[1].locale(), (language) => langs[language]());

    onMount(() => {
        if (!localStorage.getItem('theme')) {
            localStorage.setItem('theme', 'default');
        }

        if (localStorage.getItem('theme') === 'dark') {
            document.querySelector('.js-light')?.remove();
        } else {
            document.querySelector('.js-dark')?.remove();
        }
    });

    createEffect(() => {
        if (!lang.loading) {
            add(i18n[1].locale(), lang() as Record<string, any>);
        }
        document.documentElement.lang = locale();
        localStorage.setItem('locale', locale());
    });

    createEffect(() => {
        document.body.setAttribute('data-sidebar-position', store.sidebarPosition);
        document.body.setAttribute('data-sidebar-layout', store.sidebarLayout);
        document.body.setAttribute('data-theme', store.theme);
    });

    const changeTheme = (theme: string) => {
        if (store.theme === theme) {
            return;
        }
        document.body.setAttribute('data-theme', theme);
        setStore('theme', theme);
        const prevTheme = localStorage.getItem('theme');
        if (prevTheme === 'dark' || theme === 'dark') {
            window.location.replace(window.location.pathname);
        }
        localStorage.setItem('theme', theme);
    };

    const changeSideBarLayout = (layout: string) => {
        localStorage.setItem('sidebarLayout', layout);
        setStore('sidebarLayout', layout);
    };

    const changeSideBarPosition = (position: string) => {
        localStorage.setItem('sidebarPosition', position);
        setStore('sidebarPosition', position);
    };

    const setState = (key: keyof AppContextState, value: any) => {
        setStore(key, value);
    };

    const clearAllCookies = () => {
        removeCookie('cidHash');
        removeCookie('verifier');
    };

    const fetchAndSetUser = async (staff_id: number) => {
        const [staff] = await getData('table', 'staff', `staff_id=${staff_id}`);
        if (staff.staff_id) {
            setStore('isAdmin', +staff!.role === 1);
            setStore('staff', staff);
        } else {
            // await logout();
            setState('isInlogged', false);
            navigate('/login', { replace: true });
        }
    };

    const redirectToLogin = () => {
        navigate(`/login`, { replace: true });
        setState('onAuthenticate', false);
    };

    const onAuthenticate = async () => {
        const path = untrack(() => location.pathname);
        const whiteList = ['/resetpassword', '/login'];
        if (whiteList.includes(path)) {
            return;
        }

        setState('onAuthenticate', true);

        const cidHash = getCookie('cidHash');
        const fp = await generateDeviceFingerprint();

        if (!cidHash || !fp) {
            redirectToLogin();
            return;
        }

        const decStaffID = handleDecrypt(cidHash, fp);

        if (!Number(decStaffID)) {
            redirectToLogin();
            return;
        }

        setStore('isInlogged', true);
        await fetchAndSetUser(Number(decStaffID));
        if (whiteList.includes(path)) {
            navigate(`/home`, { replace: true });
        }
        setState('onAuthenticate', false);
    };

    onAuthenticate();

    return (
        <AppContext.Provider
            value={{
                store,
                changeTheme,
                changeSideBarPosition,
                changeSideBarLayout,
                setState,
                clearAllCookies,
                setStore,
            }}
        >
            <I18nContext.Provider value={i18n}>
                {props.children}
            </I18nContext.Provider>
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext)!;
