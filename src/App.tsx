import { useRoutes } from '@solidjs/router';
import { type Component, Show, Suspense } from 'solid-js';
import { useAppContext } from './AppContext';
import MainComponent from './components/MainComponent';
import { routes, routes2 } from './routes';
import SpinnerComponent from './components/SpinnerComponent';

const App: Component = () => {
    const Routes = useRoutes(routes);
    const Routes2 = useRoutes(routes2);
    const { store } = useAppContext();

    return (
        <MainComponent>
            <Suspense fallback={<SpinnerComponent />}>
                <Show when={store.isInlogged} fallback={<Routes2 />}>
                    <Routes />
                </Show>
            </Suspense>
        </MainComponent>
    );
};
export default App;
