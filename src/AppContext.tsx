/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createI18nContext, I18nContext } from '@solid-primitives/i18n';
import { useNavigate } from '@solidjs/router';
import { createContext, createEffect, createResource, ParentComponent, useContext } from 'solid-js';
import { createStore, Part } from 'solid-js/store';

type AppContextState = {
    theme: string;
    locale: string;
    sidebarPosition: string;
    sidebarLayout: string;
    color: string;
    staffID?: number;
    isAdmin?: boolean;
    staff_role?: string;
};

type AppContextValue = {
    store: AppContextState;
    updateStore: (key: Part<AppContextState>, value: string) => void;
};

const defaultState: AppContextState = {
    theme: 'default',
    locale: 'en',
    sidebarPosition: 'left',
    sidebarLayout: 'default',
    color: 'colored',
};

const AppContext = createContext<AppContextValue>({
    store: defaultState,
    updateStore: () => undefined,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const langs: { [lang: string]: () => Promise<any> } = {
    en: async () => ((await import('../lang/en/en.json')).default),
    ar: async () => ((await import('../lang/ar/ar.json')).default),
};

export const AppContextProvider: ParentComponent = (props) => {
    const navigate = useNavigate();

    // Navigation when not inlogged
    if (!localStorage.getItem('staff_id')) {
        navigate(`/login`);
    }

    if (!localStorage.getItem('theme') && !localStorage.getItem('color')) {
        localStorage.setItem('color', 'default');
    }

    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'light');
    }

    if (localStorage.getItem('color')) {
        document.body.setAttribute('data-theme', localStorage.getItem('color')!);
    } else {
        document.body.setAttribute('data-theme', localStorage.getItem('theme')!);
    }

    // Language
    const i18n = createI18nContext({}, (localStorage.getItem('locale') || 'ar') as string);
    const [t, { add, locale, dict }] = i18n;

    const [lang] = createResource(() => i18n[1].locale(), (locale) => langs[locale]());

    createEffect(() => {
        if (!lang.loading) {
            add(i18n[1].locale(), lang() as Record<string, any>);
        }
    });

    createEffect(() => {
        document.documentElement.lang = locale();
    });

    createEffect(() => localStorage.setItem('locale', i18n[1].locale()));

    const [store, setStore] = createStore<AppContextState>({
        theme: localStorage.getItem('color') ? '' : localStorage.getItem('theme') || '',
        locale: localStorage.getItem('locale') || defaultState.locale,
        sidebarPosition: localStorage.getItem('sidebarPosition') || defaultState.sidebarPosition,
        sidebarLayout: localStorage.getItem('sidebarLayout') || defaultState.sidebarLayout,
        color: localStorage.getItem('color') || '',
        staffID: Number(localStorage.getItem('staff_id')),
        isAdmin: false,
    });

    const updateStore = (key: Part<AppContextState>, value: string) => {
        if (key === 'staff_role') {
            localStorage.setItem('staff_role', value);
            setStore('isAdmin', +value === 1);
            return;
        }

        setStore(key, value);

        if (key === 'theme') {
            localStorage.removeItem('color');
            setStore('color', '');

            const prevTheme = localStorage.getItem('theme');
            localStorage.setItem('theme', value);
            document.body.setAttribute('data-theme', value);

            if (prevTheme !== value) {
                window.location.replace(window.location.pathname);
            }
        }

        if (key === 'color') {
            document.body.setAttribute('data-theme', value);
            localStorage.setItem('color', value);
            setStore('theme', '');

            if (localStorage.getItem('theme') === 'dark') {
                localStorage.setItem('theme', 'light');
                window.location.replace(window.location.pathname);
            }
        }

        if (key === 'staffID') {
            localStorage.setItem('staff_id', value);
        }
    };

    createEffect(() => {
        document.body.setAttribute('data-sidebar-position', store.sidebarPosition);
        document.body.setAttribute('data-sidebar-layout', store.sidebarLayout);
    });

    return (
        <AppContext.Provider value={{ store, updateStore }}>
            <I18nContext.Provider value={i18n}>
                {props.children}
            </I18nContext.Provider>
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
