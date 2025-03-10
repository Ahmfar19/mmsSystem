import { useI18n } from '@solid-primitives/i18n';
import { Component, For } from 'solid-js';

const RegularTable: Component<{
    data: any;
    header: string[];
    keys: string[];
}> = (props) => {
    const [t] = useI18n();

    return (
        <table class='table table-striped'>
            <thead>
                <tr>
                    <For each={props.header}>
                        {(row) => <td>{t(row)}</td>}
                    </For>
                </tr>
            </thead>

            <tbody>
                <For each={props.data}>
                    {(row) => (
                        <tr>
                            <For each={props.keys}>
                                {(key) => <td>{row[key]}</td>}
                            </For>
                        </tr>
                    )}
                </For>
            </tbody>
        </table>
    );
};

export default RegularTable;
