/* eslint-disable @typescript-eslint/naming-convention */
import { useI18n } from '@solid-primitives/i18n';
import { A } from '@solidjs/router';
import feather from 'feather-icons';
import { Button, Card, Col, Form, OverlayTrigger, Row, Table, Tooltip } from 'solid-bootstrap';
import { Accessor, Component, createEffect, createResource, createSignal, For, Show } from 'solid-js';
import { useAppContext } from '../AppContext';
import { deleteData, getData, updateData } from '../utils/api';
import { createPayment } from '../utils/functions';
import showToast from '../utils/ToastMessage';
import { PaymentsData } from '../utils/types';
import ModalComponent from './ModalComponent';

const PaymentsComponent: Component<{
    mark: Accessor<Record<string, string>>;
}> = (props) => {
    const [t] = useI18n();
    const { store } = useAppContext();

    let paymentFormElement: HTMLFormElement;

    const [validated, setValidated] = createSignal(false);
    const [openPayment, setOpenPayment] = createSignal<boolean>(false);
    const [editMode, setEditMode] = createSignal<boolean>(false);
    const [totalAmount, setTotalAmount] = createSignal<any>({});
    const [paymentValue, setPaymentValue] = createSignal<any>({});

    const [payments, { mutate: mutatePayment }] = createResource(
        () => props.mark().mark_id,
        (mark_id) => getData('table', 'payment', `mark_id=${mark_id}`),
    );

    const handleValidate = (form: HTMLFormElement) => {
        setValidated(true);
        return form.checkValidity();
    };

    createEffect(() => {
        if (openPayment() && !editMode()) {
            setValidated(false);
            setPaymentValue({});
        }
    });

    createEffect(() => {
        if (!payments.loading) {
            setTotalAmount(
                payments()?.reduce((sum: any, item: { amount: any }) => +sum + +item.amount, 0),
            );
            feather.replace();
        }
    });

    function handlePaymentChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const { name, value, type }: { name: string; value: string | number; type: string } = target;
        setPaymentValue(signalValues => ({
            ...signalValues,
            [name]: type === 'number' ? +value : value,
        }));
    }

    async function submitPayment(edit: boolean) {
        const {
            amount,
            receipt_number,
            payment_date,
            payment_note,
            payment_id,
        } = paymentValue();

        if (!handleValidate(paymentFormElement)) return;
        if (edit) {
            await updateData('table', paymentValue().payment_id, paymentValue(), 'payment');
            updatePayment(payment_id, paymentValue());
            showToast({ message: t('ipaz_alert_success_editData'), type: 'default' });
        } else {
            const newPayment: PaymentsData = await createPayment(
                props.mark().mark_id,
                amount,
                receipt_number,
                payment_date,
                payment_note,
                true,
            );
            if (newPayment) {
                showToast({ message: t('ipaz_alert_success_addPayment'), type: 'success' });
                updatePayments(newPayment);
            }
        }
    }

    function handldeEditPayment(id: string | number) {
        const payment = payments().find((item: { [x: string]: string }) => item.payment_id === String(id));
        setOpenPayment(true);
        setEditMode(true);
        setPaymentValue(payment);
    }

    async function handldeDeletePayment(id: string | number) {
        const { error } = await deleteData('table', +id, 'payment');
        if (error) {
            showToast({ message: t('ipaz_alert_fail_deleteData'), type: 'error' });
        }
        mutatePayment(payments().filter((item: any) => +item.payment_id !== +id));
        showToast({ message: t('ipaz_alert_success_deleteData'), type: 'success' });
    }

    function updatePayment(payment_id: number, updatedPayment: PaymentsData) {
        mutatePayment((prevPayments: PaymentsData[]) => {
            const index = prevPayments.findIndex((payment: PaymentsData) => payment.payment_id === payment_id);
            if (index !== -1) {
                const updatedPayments = [...prevPayments];
                updatedPayments[index] = { ...updatedPayments[index], ...updatedPayment };
                return updatedPayments;
            }
            return prevPayments;
        });
    }

    function updatePayments(newPayment: PaymentsData) {
        mutatePayment((prevNotes) => [...prevNotes, newPayment]);
    }

    return (
        <>
            <Card>
                <Card.Header class='card-title h5'>{t('ipaz_mark_managPage_paymentsReceipts')}</Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th scope='col'>{t('ipaz_mark_managPage_paymentNumber')}</th>
                                <th scope='col'>{t('ipaz_mark_managPage_receiptNumber')}</th>
                                <th scope='col'>{t('ipaz_mark_receiptAmount')}</th>
                                <th scope='col'>{t('ipaz_mark_managPage_paymentDate')}</th>
                                <th scope='col'>{t('ipaz_mark_managPage_paymentNotes')}</th>
                                <Show when={store.isAdmin}>
                                    <th scope='col'>{t('ipaz_mark_managPage_appOptions')}</th>
                                </Show>
                            </tr>
                        </thead>

                        <tbody>
                            <Show when={!payments.loading}>
                                <For each={payments()}>
                                    {(payment) => (
                                        <tr>
                                            <td>{payment.payment_id}</td>
                                            <td>{payment.receipt_number}</td>
                                            <td>{payment.amount}</td>
                                            <td>{payment.payment_date}</td>
                                            <td>{payment.payment_note}</td>
                                            <Show when={store.isAdmin}>
                                                <td>
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip>
                                                                {t('ipaz_buttonTooltip_edit')}
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <span
                                                            onClick={() => handldeEditPayment(payment.payment_id)}
                                                        >
                                                            <i class='editIcon align-middle mx-1' data-feather='edit' />
                                                        </span>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip>
                                                                {t('ipaz_buttonTooltip_delete')}
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <span
                                                            onClick={() => handldeDeletePayment(payment.payment_id)}
                                                        >
                                                            <i
                                                                class='trashIcon align-middle mx-1'
                                                                data-feather='trash-2'
                                                            />
                                                        </span>
                                                    </OverlayTrigger>
                                                </td>
                                            </Show>
                                        </tr>
                                    )}
                                </For>
                            </Show>
                            <tr>
                                <td class='text' colSpan={2}>
                                    <strong>{t('ipaz_mark_managPage_totalPayments')}</strong>
                                </td>
                                <td class='text-success' colSpan={3}>
                                    <strong>
                                        {totalAmount()?.toLocaleString(navigator.language, {
                                            style: 'currency',
                                            currency: 'SAR',
                                        })}
                                    </strong>
                                </td>
                                <Show when={store.isAdmin}>
                                    <td colSpan={2}>
                                        <A
                                            href={`/invoiveMark/${props.mark()?.mark_id}-${props.mark().customer_id}`}
                                            target='_blank'
                                        >
                                            {t('ipaz_mark_managPage_printInvoice')}
                                        </A>
                                    </td>
                                </Show>
                            </tr>
                        </tbody>
                    </Table>

                    <Row>
                        <Col>
                            <Button onClick={() => setOpenPayment(true)} class='mx-1' variant='primary'>
                                {t('ipaz_payment_add')}
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <ModalComponent
                header={editMode() ? 'ipaz_payment_update' : 'ipaz_payment_add'}
                onOpen={openPayment}
                setOnOpen={setOpenPayment}
                editMode={editMode}
                setEditMode={setEditMode}
                validate={() => handleValidate(paymentFormElement)}
                sumbit={submitPayment}
            >
                <Form
                    validated={validated()}
                    ref={r => {
                        paymentFormElement = r;
                    }}
                >
                    <Form.Group as={Col} md='12' class='mb-2'>
                        <Form.Label>{t('ipaz_mark_name')}</Form.Label>
                        <Form.Control
                            size='lg'
                            type='text'
                            name='mark_id'
                            value={props.mark().name_ar + ' - ' + props.mark().name_en}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} md='12' class='mb-2'>
                        <Form.Label>{t('ipaz_mark_receiptAmount')}</Form.Label>
                        <Form.Control
                            size='lg'
                            type='number'
                            name='amount'
                            value={paymentValue()?.amount ?? ''}
                            onInput={handlePaymentChange}
                            placeholder={t('ipaz_mark_receiptAmount')}
                            required
                        />
                        <Form.Control.Feedback type='invalid'>
                            {t('ipaz_validation_required')}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='12' class='mb-2'>
                        <Form.Label>{t('ipaz_mark_receiptNumber')}</Form.Label>
                        <Form.Control
                            size='lg'
                            type='number'
                            name='receipt_number'
                            value={paymentValue()?.receipt_number ?? ''}
                            onInput={handlePaymentChange}
                            placeholder={t('ipaz_mark_receiptNumber')}
                            required
                        />
                        <Form.Control.Feedback type='invalid'>
                            {t('ipaz_validation_required')}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='12' class='mb-2'>
                        <Form.Label>{t('ipaz_mark_managPage_paymentDate')}</Form.Label>
                        <Form.Control
                            size='lg'
                            type='date'
                            name='payment_date'
                            value={paymentValue()?.payment_date ?? ''}
                            onInput={handlePaymentChange}
                            required
                        />
                        <Form.Control.Feedback type='invalid'>
                            {t('ipaz_validation_required')}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='12' class='mb-2'>
                        <Form.Label>{t('ipaz_mark_managPage_paymentNotes')}</Form.Label>
                        <Form.Control
                            size='lg'
                            type='text'
                            name='payment_note'
                            onInput={handlePaymentChange}
                            value={paymentValue()?.payment_note ?? ''}
                            placeholder={t('ipaz_mark_managPage_paymentNotes')}
                            required
                        />
                        <Form.Control.Feedback type='invalid'>
                            {t('ipaz_validation_required')}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </ModalComponent>
        </>
    );
};

export default PaymentsComponent;
