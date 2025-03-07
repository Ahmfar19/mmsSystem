import { useI18n } from '@solid-primitives/i18n';
import feather from 'feather-icons';
import { Component, createEffect, createSignal, onMount } from 'solid-js';

const HomeCardComponent: Component<{
    icon: string;
    header: string;
    number: number;
    percentage: number;
    color?: string;
}> = (props) => {
    const [number, setNumber] = createSignal<number>();
    const [percentage, setPercentage] = createSignal<number>();
    const [t] = useI18n();

    onMount(() => {
        feather.replace();
    });

    createEffect(() => {
        setNumber(props.number);
        setPercentage(props.percentage);
    });

    return (
        <div class='col-sm-12 col-md-3 col-xl-3'>
            <div class='card'>
                <div class='card-body'>
                    <div class='row'>
                        <div class='col mt-0'>
                            <h5 class='card-title'>{t(props.header)}</h5>
                        </div>
                        <div class='col-auto'>
                            <div class='stat text-primary'>
                                <i class='align-middle' data-feather={props.icon} />
                            </div>
                        </div>
                    </div>
                    <h1 class='mt-1 mb-3'>{number()}</h1>
                    <div class='mb-0'>
                        <span
                            class={`badge badge-${props.color ?? 'primary'}-light`}
                        >
                            <i class='mdi mdi-arrow-bottom-right' />
                            {percentage()}%
                        </span>
                        {/* <span class='text-muted'>Since last week</span> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeCardComponent;
