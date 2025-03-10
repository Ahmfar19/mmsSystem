import { useI18n } from '@solid-primitives/i18n';
import { useParams } from '@solidjs/router';
import { Button, Col, Row } from 'solid-bootstrap';
import { Component, createEffect, createResource, createSignal, For, onCleanup, Show } from 'solid-js';
import { getData } from '../utils/api';
import { getDate } from '../utils/functions';

const InvoicMark: Component = () => {
    const [t] = useI18n();
    const params = useParams();

    const markID = params.id.split('-')[0];
    const customerID = params.id.split('-')[1];

    const [printMode, setPrintMode] = createSignal(false);
    const [totalAmount, setTotalAmount] = createSignal<any>();

    const [payments] = createResource(
        () => getData('table', 'payment', `mark_id=${markID}`),
    );

    const [customer] = createResource(
        () => getData('table', 'customer', `customer_id=${customerID}`),
    );

    createEffect(() => {
        if (payments()) {
            setTotalAmount(
                payments()?.reduce((sum: any, item: { amount: any }) => +sum + +item.amount, 0),
            );
        }
    });

    // Cleanup the print mode signal when component unmounts
    onCleanup(() => {
        setPrintMode(false);
    });

    const handlePrint = () => {
        setPrintMode(true);
        window.print();
        setPrintMode(false);
    };

    return (
        <Show when={!payments.loading && !customer.loading}>
            <Row>
                <Col md={12}>
                    <div class='card-body m-sm-2 m-md-4 mt-0'>
                        <div class='text-center'>
                            <img src='/img/logo/logo.png' width={200} height={150} alt='logo' />
                        </div>
                        <div class='mb-4'>
                            {t('ipaz_mark_managPage_DearCustomer')}
                            <strong>{customer()[0].firstname} {customer()[0].lastname}</strong>
                            <br />
                            {t('ipaz_mark_managPage_NoteWelcomeText')}
                        </div>

                        <div class='row'>
                            <div class='col-md-6'>
                                <div class='text-muted'>{t('ipaz_mark_marID')}</div>
                                <strong>{params.id}</strong>
                            </div>
                            <div class='col-md-6 text-md-end'>
                                <div class='text-muted'>{t('ipaz_invoice_date')}</div>
                                <strong>{getDate()}</strong>
                            </div>
                        </div>

                        <hr class='my-4' />

                        <div class='row mb-4'>
                            <div class='col-md-6'>
                                <div class='text-muted'>{t('ipaz_sidebar_customer')}</div>
                                <strong>
                                    {customer()[0].firstname}
                                    {' - '}
                                    {customer()[0].lastname}
                                </strong>
                                <p>
                                    {customer()[0].adress}
                                    <br />
                                    <a href='#'>
                                        {customer()[0].mail}
                                    </a>
                                </p>
                            </div>
                            <div class='col-md-6 text-md-end'>
                                <div class='text-muted'>{t('ipaz_invoice_paymentTo')}</div>
                                <strong>
                                    شركة حسام البواب وشركاه
                                </strong>
                                <p>
                                    <span>البواب للملكية الفكرية</span>
                                    <br />
                                    <a href='#'>
                                        info@albawab.com
                                    </a>
                                </p>
                            </div>
                        </div>

                        <table class='table table-sm'>
                            <thead>
                                <tr>
                                    <th>{t('ipaz_invoice_description')}</th>
                                    <th>{t('ipaz_mark_managPage_paymentDate')}</th>
                                    <th class='text-end'>{t('ipaz_mark_receiptAmount')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <For each={payments()}>
                                    {(payment) => (
                                        <tr>
                                            <td>{payment.payment_note}</td>
                                            <td>{payment.payment_date}</td>
                                            <td class='text-end'>{payment.amount}</td>
                                        </tr>
                                    )}
                                </For>

                                <tr>
                                    <th>&nbsp;</th>
                                    <th class='text-success'>{t('ipaz_mark_managPage_totalPayments')}</th>
                                    <th class='text-end text-success'>{totalAmount()}</th>
                                </tr>
                            </tbody>
                        </table>

                        <div class='text-center mt-5'>
                            {
                                /* <p class="text-sm">
                                <strong>قسم المحاسبة</strong> <br />
                            </p> */
                            }

                            <Button
                                onClick={handlePrint}
                                variant='primary'
                                hidden={printMode()}
                            >
                                {t('ipaz_invoice_print')}
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Show>
    );
};

export default InvoicMark;
