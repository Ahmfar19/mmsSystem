/* eslint-disable @typescript-eslint/no-unused-vars */
import { useI18n } from '@solid-primitives/i18n';
import { Col, Form, FormControl, Row } from 'solid-bootstrap';
import { Accessor, Component, createSignal, For, Setter } from 'solid-js';
import { applicationType } from '../utils/dataStore';

const ApplicationForm: Component<{
    appValues: Accessor<Record<string, string>>;
    setApplicationValues: Setter<Record<string, string | number>>;
    paymentValues: Accessor<Record<string, string>>;
    setPaymentValues: Setter<Record<string, string | number>>;
    makeReceipt: Accessor<boolean>;
    setMekeReceipt: Setter<boolean>;
}> = (props) => {
    const [t] = useI18n();

    function handleChangeApplication(e: Event): void {
        const target = e.target as HTMLInputElement;
        const { name, value, type }: { name: string; value: string | number; type: string } = target;

        props.setApplicationValues(signalValues => ({
            ...signalValues,
            [name]: type === 'number' ? +value : value,
        }));
    }

    function handleChangePayment(e: Event): void {
        const target = e.target as HTMLInputElement;
        const { name, value, type }: { name: string; value: string | number; type: string } = target;

        props.setPaymentValues(signalValues => ({
            ...signalValues,
            [name]: type === 'number' ? +value : value,
        }));
    }

    return (
        <>
            <Row class='mb-3'>
                <Form.Group as={Col} md='4'>
                    <Form.Label>{t('ipaz_mark_applicationDate')}</Form.Label>
                    <Form.Control
                        size='lg'
                        type='date'
                        name='application_date'
                        value={props.appValues().application_date ?? ''}
                        onInput={handleChangeApplication}
                    />
                </Form.Group>

                <Form.Group as={Col} md='4'>
                    <Form.Label>{t('ipaz_mark_applicationType')}</Form.Label>
                    <Form.Select
                        size='lg'
                        name='type_id'
                        value={props.appValues().type_id ?? ''}
                        onInput={handleChangeApplication}
                    >
                        <option selected value=''>Choose...</option>
                        <For each={applicationType()}>
                            {(type) => (
                                <option value={type.type_id}>
                                    {type.type_name}
                                </option>
                            )}
                        </For>
                    </Form.Select>
                </Form.Group>
            </Row>
            <Row class='mb-3'>
                <Form.Group md='4' as={Col}>
                    <Form.Label>{t('ipaz_mark_applicationReceipt')}</Form.Label>
                    <Form.Select
                        size='lg'
                        name='application_receipt'
                        value={props.makeReceipt() ? 'true' : 'false'}
                        onInput={(e) => {
                            props.setMekeReceipt(e.target.value === 'true');
                        }}
                    >
                        <option selected value=''>Choose...</option>
                        <option value='true'>{t('ipaz_modal_ok')}</option>
                        <option value='false'>{t('ipaz_modal_no')}</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group as={Col} md='4'>
                    <Form.Label>{t('ipaz_mark_receiptAmount')}</Form.Label>
                    <Form.Control
                        size='lg'
                        type='number'
                        name='amount'
                        placeholder=''
                        classList={{ disabled: !props.makeReceipt() }}
                        value={props.paymentValues().amount ?? ''}
                        onInput={handleChangePayment}
                        disabled={!props.makeReceipt()}
                    />
                </Form.Group>

                <Form.Group as={Col} md='4'>
                    <Form.Label>{t('ipaz_mark_receiptNumber')}</Form.Label>
                    <Form.Control
                        size='lg'
                        type='number'
                        name='receipt_number'
                        placeholder=''
                        value={props.paymentValues().receipt_number ?? ''}
                        onInput={handleChangePayment}
                        disabled={!props.makeReceipt()}
                    />
                </Form.Group>
            </Row>
        </>
    );
};

export default ApplicationForm;
