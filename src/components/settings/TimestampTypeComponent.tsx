import { useI18n } from '@solid-primitives/i18n';
import { Button, Card, Col, Form, Row, Spinner } from 'solid-bootstrap';
import { Component, createSignal, For, Show, untrack } from 'solid-js';
import { setTodaysTimeStamps } from '../../api/home';
import {
    addTimestampType,
    deleteTimeStampType,
    editTimestampType,
    refetchTimestampTypes,
    timestampType,
} from '../../api/timestampType';
import { TimeStampTypeType } from '../../types';
import { showToast } from '../../utils/ToastMessage';

const TimestampTypeComponent: Component = () => {
    let formElement: HTMLFormElement;
    let formNew: HTMLFormElement;
    let oldTimeStampName: string;

    const [t] = useI18n();

    const [loading, setLoading] = createSignal(false);
    const [validated, setValidated] = createSignal(false);
    const [validatedNew, setValidatedNew] = createSignal(false);

    const [editType, setEditType] = createSignal<TimeStampTypeType>();
    const [newTypes, setNewTypes] = createSignal<TimeStampTypeType>();
    const [toEdit, setToEdit] = createSignal<TimeStampTypeType>();

    function handleChangeEdit(e: Event): void {
        const target = e.target as HTMLInputElement;
        const tsType = timestampType().find((ts: TimeStampTypeType) => +ts.type_id! === +target.value);
        setEditType(tsType);
        oldTimeStampName = tsType.name_sv;
    }

    const handleSaveEdit = async () => {
        setValidated(true);
        if (!formElement.checkValidity()) {
            return;
        }
        if (!toEdit()?.name_sv) {
            showToast({ message: t('dek_settings_timeStamp_NoChanges'), type: 'default' });
            return;
        }
        setEditType((prev: TimeStampTypeType | undefined) => {
            if (!prev) {
                return prev;
            }
            return { ...prev, ...toEdit()! };
        });

        setLoading(true);

        const { error } = await editTimestampType(editType()!.type_id!, editType()!);
        if (error) {
            showToast({ message: (String(error) || t('dek_alert_user_passwordFaild')), type: 'error' });
        } else {
            // Update the latest timestamp type
            setTodaysTimeStamps((prev) =>
                prev.map((ts) => {
                    if (ts.name_sv === oldTimeStampName) {
                        return { ...ts, name_sv: untrack(() => editType()!.name_sv) };
                    }
                    return ts;
                })
            );
            setNewTypes({} as TimeStampTypeType);
            setEditType();
            await refetchTimestampTypes();
            showToast({ message: t('dek_alert_user_editSuccess'), type: 'success' });
        }

        setToEdit();
        setValidated(false);
        setLoading(false);
    };

    const addNewType = async () => {
        setValidatedNew(true);
        if (!formNew.checkValidity()) {
            return;
        }

        setLoading(true);

        const { error } = await addTimestampType(newTypes()!);
        if (error) {
            showToast({ message: (String(error) || t('dek_alert_user_passwordFaild')), type: 'error' });
        } else {
            setNewTypes({} as TimeStampTypeType);
            await refetchTimestampTypes();
            showToast({ message: t('dek_alert_user_editSuccess'), type: 'success' });
        }

        setNewTypes();
        setValidatedNew(false);
        setLoading(false);
    };

    const removeType = async () => {
        if (editType()) {
            const { error } = await deleteTimeStampType(editType()!.type_id!);
            if (error) {
                showToast({ message: t('dek_alert_timeStampType_DeleteFaile'), type: 'error' });
            } else {
                setEditType();
                await refetchTimestampTypes();
                showToast({ message: t('dek_alert_timeStampType_DeleteSuccess'), type: 'success' });
            }
        }
    };

    return (
        <>
            <Card>
                <Card.Header class='pb-0'>
                    <Card.Title>
                        {t('dek_settings_timeStamp_changeTitle')}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form
                        validated={validated()}
                        ref={r => {
                            formElement = r;
                        }}
                    >
                        <Row>
                            <Form.Group as={Col} md='12' class='mb-3'>
                                <Form.Label>{t('dek_settings_timeStamp_selectTimeStamp')}</Form.Label>
                                <Form.Select
                                    size='lg'
                                    name='type_id'
                                    value={editType()?.type_id ?? ''}
                                    onInput={handleChangeEdit}
                                >
                                    <option selected value=''>{t('ec_select_title')}</option>
                                    <For each={timestampType()}>
                                        {(type) => (
                                            <option value={type.type_id}>
                                                {type.name_sv}
                                            </option>
                                        )}
                                    </For>
                                </Form.Select>
                            </Form.Group>

                            <Show when={editType()}>
                                <Form.Group class='mb-3'>
                                    <Form.Label>{t('dek_settings_timeStamp_timestampName')}</Form.Label>
                                    <Form.Control
                                        size='lg'
                                        name='name_sv'
                                        type='text'
                                        value={editType()?.name_sv}
                                        onInput={(e) => {
                                            setToEdit({ name_sv: e.target.value });
                                        }}
                                        placeholder={t('dek_settings_timeStamp_timestampName')}
                                        required
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {t('dek_validate_required')}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Show>
                        </Row>
                    </Form>
                    <Show when={editType()}>
                        <Button
                            variant='primary'
                            onClick={handleSaveEdit}
                            class='mt-2 me-1'
                        >
                            {t('ec_table_tooltip_edit')}
                            <Show when={loading() && toEdit()?.name_sv}>
                                <Spinner
                                    as='span'
                                    animation='border'
                                    size='sm'
                                    role='status'
                                    aria-hidden='true'
                                    class='ms-2'
                                />
                            </Show>
                        </Button>

                        <Button
                            variant='danger'
                            onClick={() => removeType()}
                            class='mt-2 me-1'
                        >
                            {t('dek_table_tooltip_remove')}
                        </Button>

                        <Button
                            variant='light'
                            onClick={() => setEditType()}
                            class='mt-2 me-1'
                        >
                            {t('dek_button_cancel')}
                        </Button>
                    </Show>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header class='pb-0'>
                    <Card.Title>
                        {t('dek_settings_timeStamp_addTitle')}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form
                        validated={validatedNew()}
                        ref={r => {
                            formNew = r;
                        }}
                    >
                        <Row>
                            <Form.Group class='mb-3'>
                                <Form.Label>{t('dek_settings_timeStamp_timestampName')}</Form.Label>
                                <Form.Control
                                    size='lg'
                                    name='name_sv'
                                    type='text'
                                    value={newTypes()?.name_sv ?? ''}
                                    onInput={(e) => setNewTypes({ 'name_sv': e.target.value })}
                                    placeholder={t('dek_settings_timeStamp_timestampName')}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {t('dek_validate_required')}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </Form>

                    <Button
                        variant='primary'
                        onClick={addNewType}
                    >
                        {t('dek_settings_timeStamp_buttonAdd')}
                        <Show
                            when={loading() && newTypes()?.name_sv}
                            fallback={<i class='align-middle ms-1 fas fa-fw fa-plus' />}
                        >
                            <Spinner
                                as='span'
                                animation='border'
                                size='sm'
                                role='status'
                                aria-hidden='true'
                                class='ms-2'
                            />
                        </Show>
                    </Button>
                </Card.Body>
            </Card>
        </>
    );
};

export default TimestampTypeComponent;
