/* eslint-disable no-new */
import { useI18n } from '@solid-primitives/i18n';
import Chart from 'chart.js/auto';
import { Component, onMount } from 'solid-js';

const PieChartComponent: Component<{
    protectedMark: number;
    awaitingMark: number;
    unProtectedMark: number;
    protectionEndThisMonth: number;
}> = (props) => {
    const [t, { locale }] = useI18n();

    onMount(() => {
        const canvas = document.getElementById('chartjs-dashboard-pie') as HTMLCanvasElement;
        if (!canvas) return;

        new Chart(canvas, {
            type: 'pie',
            data: {
                labels: [
                    t('ipaz_chart_protectedMark'),
                    t('ipaz_chart_awaitingMark'),
                    t('ipaz_chart_unProtectedMark'),
                    t('ipaz_chart_protectionEndThisMonth'),
                ],
                datasets: [{
                    data: [
                        props.protectedMark,
                        props.awaitingMark,
                        props.unProtectedMark,
                        props.protectionEndThisMonth,
                    ],
                    backgroundColor: [
                        '#3b7ddd',
                        '#fd7e14',
                        '#0a0a0a',
                        '#dc3545',
                    ],
                    borderWidth: 5,
                    borderColor: '#fff',
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                cutout: 50,
            },
        });
    });

    return (
        <div class='align-self-center w-100'>
            <div class='py-3'>
                <div class='chart chart-xs'>
                    <canvas id='chartjs-dashboard-pie' />
                </div>
            </div>

            <table class='table mb-0'>
                <tbody>
                    <tr>
                        <td>
                            <span class='colored-circle bg-primary' />
                            <span class='mx-1'>{t('ipaz_chart_protectedMark')}</span>
                        </td>
                        <td
                            class={locale() === 'ar' ? 'text-start' : 'text-end'}
                        >
                            {props.protectedMark}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class='colored-circle bg-warning' />
                            <span class='mx-1'>{t('ipaz_chart_awaitingMark')}</span>
                        </td>
                        <td
                            class={locale() === 'ar' ? 'text-start' : 'text-end'}
                        >
                            {props.awaitingMark}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class='colored-circle bg-dark' />
                            <span class='mx-1'>{t('ipaz_chart_unProtectedMark')}</span>
                        </td>
                        <td
                            class={locale() === 'ar' ? 'text-start' : 'text-end'}
                        >
                            {props.unProtectedMark}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class='colored-circle bg-danger' />
                            <span class='mx-1'>{t('ipaz_chart_protectionEndThisMonth')}</span>
                        </td>
                        <td
                            class={locale() === 'ar' ? 'text-start' : 'text-end'}
                        >
                            {props.protectionEndThisMonth}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PieChartComponent;
