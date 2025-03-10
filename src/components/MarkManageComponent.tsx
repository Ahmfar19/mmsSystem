/* eslint-disable @typescript-eslint/naming-convention */
import { useI18n } from '@solid-primitives/i18n';
import feather from 'feather-icons';
import { Button, Card, Col, Form, Row, Table } from 'solid-bootstrap';
import { Accessor, Component, createEffect, createSignal, For, onMount, Show, untrack } from 'solid-js';
import { useAppContext } from '../AppContext';
import { mutateCardValues, mutateSpecMarks, refetCardValues, refetSpecMarks } from '../pages/Home';
import { deleteData, updateData } from '../utils/api';
import { customers, languages } from '../utils/dataStore';
import { calculateDateAfter10Years, isDateInFeature } from '../utils/functions';
import showToast from '../utils/ToastMessage';
import ApplicationComponent from './ApplicationsComponent';
import ConfirmModel from './ConfirmModal';
import ModalComponent from './ModalComponent';
import NotesComponent from './NotesComponent';
import PaymentsComponent from './PaymentsComponent';

const MarkManageComponent: Component<{
    mark: Accessor<Record<string, string>>;
    setMarks: any;
}> = (props) => {
    const [t] = useI18n();
    const { store } = useAppContext();

    let markFormElement: HTMLFormElement;

    const [validated, setValidated] = createSignal(false);

    const [markValue, setMarkValue] = createSignal<any>();
    const [customerValue, setCustomerValue] = createSignal<any>('');

    const [openUpdateMark, setOpenUpdateMark] = createSignal<boolean>(false);
    const [openConfirm, setOpenConfirm] = createSignal<boolean>(false);
    const [editMode, setEditMode] = createSignal<boolean>(false);

    const [markUpdate, setMarkUpdate] = createSignal<any>({});

    const handleValidate = (form: HTMLFormElement) => {
        setValidated(true);
        return form.checkValidity();
    };

    function handleMarkUpdateChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const { name, value, type }: { name: string; value: string | number; type: string } = target;

        if (name === 'protection_start') {
            setMarkUpdate(signalValues => ({
                ...signalValues,
                [name]: value,
                protection_end: calculateDateAfter10Years(value),
            }));
        }

        setMarkUpdate(signalValues => ({
            ...signalValues,
            [name]: type === 'number' ? +value : value,
        }));
    }

    async function submitMark() {
        setMarkValue({ ...markValue(), ...markUpdate() });

        const { error } = await updateData('table', markValue().mark_id, markUpdate(), 'mark');
        if (error) {
            showToast({ message: t('ipaz_alert_fail_editData'), type: 'error' });
        } else {
            updateFoundMarks();
            setValidated(false);
            showToast({ message: t('ipaz_alert_success_editData'), type: 'default' });
            refetCardValues();
            refetSpecMarks();
        }
    }

    async function handleDeleteMark() {
        const { error } = await deleteData('mark', markValue().mark_id, 'mark');

        if (error) {
            showToast({ message: t('ipaz_alert_fail_deleteData'), type: 'error' });
        } else {
            updateFoundMarks(markValue().mark_id);

            // Update the card values
            if (isDateInFeature(markValue().protection_end)) {
                mutateCardValues((prevValues) => ({
                    ...prevValues,
                    mark: +prevValues.mark - 1,
                    protectedMark: +prevValues.protectedMark - 1,
                }));
            } else {
                mutateCardValues((prevValues) => ({
                    ...prevValues,
                    mark: +prevValues.mark - 1,
                }));
            }

            mutateSpecMarks((prevValues) => {
                const merkValues = untrack(() => markValue());

                const updatedLast10MarksArray = prevValues.last10MarksArray
                    .filter((mark: any) => +mark.mark_id !== +merkValues.mark_id);

                const updatedUnProtectedMark = prevValues.unProtectedMark
                    .filter((mark: any) => +mark.mark_id !== +merkValues.mark_id);

                const updatedEndThisMonth = prevValues.protectionEndThisMonth
                    .filter((mark: any) => +mark.mark_id !== +merkValues.mark_id);

                return {
                    ...prevValues,
                    last10MarksArray: updatedLast10MarksArray,
                    unProtectedMark: updatedUnProtectedMark,
                    protectionEndThisMonth: updatedEndThisMonth,
                };
            });

            setMarkValue();
            showToast({ message: t('ipaz_alert_success_deleteData'), type: 'success' });
        }
    }

    function updateFoundMarks(mark_id?: number) {
        if (mark_id) {
            props.setMarks((prevMarks: any) => prevMarks.filter((mark: any) => mark.mark_id !== mark_id));
        } else {
            const newValues: any = untrack(() => markValue());
            props.setMarks((prevMarks: any) => prevMarks.mark_id === newValues.mark_id, { ...newValues });
        }
    }

    createEffect(() => {
        setMarkValue({
            mark_id: props.mark().mark_id,
            name_ar: props.mark().name_ar,
            name_en: props.mark().name_en,
            certificate_number: props.mark().certificate_number,
            certificate_date: props.mark().certificate_date,
            protection_start: props.mark().protection_start,
            protection_end: props.mark().protection_end,
            materials: props.mark().materials,
            description: props.mark().description,
            drawing: props.mark().drawing,
            logo: Array.isArray(props.mark().logo) ? props.mark().logo : (props.mark().logo)?.split(','),
        });
    });

    createEffect(() => {
        if (customers()) {
            const customer = customers()?.find((item: { [x: string]: string }) =>
                item.customer_id === String(props.mark().customer_id)
            );
            setCustomerValue(`${customer.firstname} ${customer.lastname}`);
        }
    });

    createEffect(() => {
        if (markValue()) {
            onMount(() => {
                feather.replace();
            });
        }
    });

    createEffect(() => {
        if (openUpdateMark()) {
            setMarkUpdate();
        }
    });

    return (
        <Show when={markValue()}>
            <Card>
                <Card.Header>
                    <h5 class='card-title'>{t('ipaz_mark_managPage_markInformation')}</h5>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <tbody>
                            <tr>
                                <th>{t('ipaz_mark_marID')}</th>
                                <td>{markValue().mark_id}</td>
                            </tr>
                            <tr>
                                <th>{t('ipaz_mark_nameCustomer')}</th>
                                <td>
                                    <strong>{customerValue()}</strong>
                                </td>
                            </tr>
                            <tr>
                                <th>{t('ipaz_mark_nameArabic')}</th>
                                <td class='text'>
                                    <strong>{markValue().name_ar}</strong>
                                </td>
                            </tr>
                            <tr>
                                <th>{t('ipaz_mark_nameEnglish')}</th>
                                <td>
                                    <strong>{markValue().name_en}</strong>
                                </td>
                            </tr>
                            <tr>
                                <th>{t('ipaz_mark_certificate_number')}</th>
                                <td class='text-primary'>{markValue().certificate_number}</td>
                            </tr>
                            <tr>
                                <th>{t('ipaz_mark_certificate_date')}</th>
                                <td class='text-primary'>{markValue().certificate_date}</td>
                            </tr>
                            <tr>
                                <th>{t('ipaz_mark_managPage_markProtectionStart')}</th>
                                <td>{markValue().protection_start}</td>
                            </tr>
                            <tr>
                                <th>{t('ipaz_mark_managPage_markProtectionEnd')}</th>
                                <td class='text-success'>{markValue().protection_end}</td>
                            </tr>
                            <tr>
                                <th>{t('ipaz_mark_language')}</th>
                                <td>{(languages()?.[+props.mark().language_id - 1])?.name}</td>
                            </tr>
                            <tr>
                                <th>{t('ipaz_mark_description')}</th>
                                <td>{markValue().description}</td>
                            </tr>
                            <tr>
                                <th>{t('ipaz_mark_drawing')}</th>
                                <td>{markValue().drawing}</td>
                            </tr>
                            <tr>
                                <th>{t('ipaz_mark_materials')}</th>
                                <td>{markValue().materials}</td>
                            </tr>
                            <tr>
                                <th>{t('ipaz_mark_logo')}</th>
                                <td id='spc_logo'>
                                    <For each={markValue()?.logo}>
                                        {(img) => (
                                            <img
                                                class='m-2'
                                                src={`${IMAGE_URL}${markValue().mark_id}/${img}`}
                                                alt='لا يوجد'
                                                width='200'
                                                height='150'
                                            />
                                        )}
                                    </For>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <Row>
                        <Col>
                            <Button class='mx-1' onClick={() => setOpenUpdateMark(true)} variant='secondary'>
                                {t('ipaz_mark_update')}
                            </Button>
                            <Show when={store.isAdmin}>
                                <Button class='mx-1' onClick={() => setOpenConfirm(true)} variant='danger'>
                                    {t('ipaz_mark_delete')}
                                </Button>
                            </Show>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <ApplicationComponent
                mark={props.mark}
                setMarkValue={setMarkValue}
            />

            <PaymentsComponent
                mark={props.mark}
            />

            <NotesComponent
                mark={props.mark}
            />

            <ModalComponent
                header={'ipaz_mark_update'}
                onOpen={openUpdateMark}
                setOnOpen={setOpenUpdateMark}
                editMode={editMode}
                setEditMode={setEditMode}
                validate={() => handleValidate(markFormElement)}
                sumbit={submitMark}
            >
                <Form
                    validated={validated()}
                    ref={r => {
                        markFormElement = r;
                    }}
                >
                    <Row>
                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_nameArabic')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='text'
                                name='name_ar'
                                value={markValue()?.name_ar ?? ''}
                                onInput={handleMarkUpdateChange}
                                placeholder={t('ipaz_mark_nameArabic')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_nameArabic')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='text'
                                name='name_en'
                                value={markValue()?.name_en ?? ''}
                                onInput={handleMarkUpdateChange}
                                placeholder={t('ipaz_mark_nameArabic')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_certificate_number')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='text'
                                name='certificate_number'
                                onInput={handleMarkUpdateChange}
                                value={markValue().certificate_number ?? ''}
                                placeholder={t('ipaz_mark_certificate_number')}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_certificate_date')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='date'
                                name='certificate_date'
                                onInput={handleMarkUpdateChange}
                                value={markValue().certificate_date ?? ''}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group as={Col} md='6' class='mb-2'>
                            <Form.Label>{t('ipaz_mark_managPage_markProtectionStart')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='date'
                                name='protection_start'
                                onInput={handleMarkUpdateChange}
                                value={markValue()?.protection_start ?? ''}
                                placeholder={t('ipaz_mark_managPage_markProtectionStart')}
                            />
                        </Form.Group>

                        <Form.Group as={Col} md='6' class='mb-2'>
                            <Form.Label>{t('ipaz_mark_managPage_markProtectionEnd')}</Form.Label>
                            <Form.Control
                                size='lg'
                                type='date'
                                name='protection_end'
                                onInput={handleMarkUpdateChange}
                                value={markUpdate()?.protection_end ?? markValue().protection_end}
                                placeholder={t('ipaz_mark_managPage_markProtectionEnd')}
                            />
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_description')}</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                name='description'
                                value={markValue()?.description ?? ''}
                                onInput={handleMarkUpdateChange}
                            />
                        </Form.Group>

                        <Form.Group class='mb-3' as={Col} md='6'>
                            <Form.Label>{t('ipaz_mark_drawing')}</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                name='drawing'
                                value={markValue()?.drawing ?? ''}
                                onInput={handleMarkUpdateChange}
                            />
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group class='mb-3' as={Col} md='12'>
                            <Form.Label>{t('ipaz_mark_materials')}</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={7}
                                name='materials'
                                value={markValue().materials ?? ''}
                                onInput={handleMarkUpdateChange}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                {t('ipaz_validation_required')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </Form>
            </ModalComponent>

            <ConfirmModel
                header={'ipaz_confirm_title'}
                onOpen={openConfirm}
                setOnOpen={setOpenConfirm}
                sumbit={handleDeleteMark}
            >
                <h3>{t('ipaz_confirm_body')}</h3>
            </ConfirmModel>
        </Show>
    );
};

export default MarkManageComponent;
