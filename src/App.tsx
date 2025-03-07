import { MetaProvider } from '@solidjs/meta';
import { useNavigate, useRoutes } from '@solidjs/router';
import { type Component, createEffect, Show } from 'solid-js';
import { AppContextProvider } from './AppContext';
import MainComponent from './components/MainComponent';
import { routes, routes2 } from './routes';
import { isInlogged } from './utils/functions';

const App: Component = () => {
    const Routes = useRoutes(routes);
    const Routes2 = useRoutes(routes2);
    const navigate = useNavigate();

    createEffect(() => {
        if (!isInlogged()) {
            navigate(`/login`);
        }
    });

    return (
        <AppContextProvider>
            <MetaProvider>
                <MainComponent>
                    <Show when={isInlogged()} fallback={<Routes2 />}>
                        <Routes />
                    </Show>
                </MainComponent>
            </MetaProvider>
        </AppContextProvider>
    );
};
export default App;
