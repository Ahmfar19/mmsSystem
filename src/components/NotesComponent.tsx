/* eslint-disable @typescript-eslint/naming-convention */
import { useI18n } from '@solid-primitives/i18n';
import feather from 'feather-icons';
import { Button, Card, Col, Form, OverlayTrigger, Row, Tooltip } from 'solid-bootstrap';
import { Accessor, Component, createEffect, createResource, createSignal, For, Show } from 'solid-js';
import { useAppContext } from '../AppContext';
import { deleteData, getData, updateData } from '../utils/api';
import { createNote, getDate } from '../utils/functions';
import showToast from '../utils/ToastMessage';
import { NotesData } from '../utils/types';
import ModalComponent from './ModalComponent';

export const [newNote, setNewNote] = createSignal();

const PaymentsComponent: Component<{
    mark: Accessor<Record<string, string>>;
}> = (props) => {
    const [t, { locale }] = useI18n();
    const { store } = useAppContext();

    let noteFormElement: HTMLFormElement;

    const [notes, { mutate: mutateNote }] = createResource(
        () => props.mark().mark_id,
        (mark_id) => getData('table', 'note', `mark_id=${mark_id}`),
    );

    const [validated, setValidated] = createSignal(false);
    const [openNotes, setOpenNotes] = createSignal<boolean>(false);
    const [editMode, setEditMode] = createSignal<boolean>(false);
    const [noteValue, setNotetValue] = createSignal<any>();

    const handleValidate = (form: HTMLFormElement) => {
        setValidated(true);
        return form.checkValidity();
    };

    createEffect(() => {
        if (notes()) {
            feather.replace();
        }
    });

    createEffect(() => {
        if (openNotes() && !editMode()) {
            setValidated(false);
            setNotetValue({});
        }
    });

    createEffect(() => {
        if (newNote()) {
            updateNotes(newNote() as NotesData);
            setNewNote();
        }
    });

    function handleNoteChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const { name, value, type }: { name: string; value: string | number; type: string } = target;
        setNotetValue(signalValues => ({
            ...signalValues,
            [name]: type === 'number' ? +value : value,
        }));
    }

    function handldeEditNote(id: string | number) {
        const note = notes().find((item: { [x: string]: string }) => item.note_id === String(id));
        setOpenNotes(true);
        setEditMode(true);
        setNotetValue(note);
    }

    async function handldeDeleteNote(id: string | number) {
        const { error } = await deleteData('table', +id, 'note');
        if (error) {
            showToast({ message: t('ipaz_alert_fail_deleteData'), type: 'error' });
        }
        mutateNote(notes().filter((item: any) => +item.note_id !== +id));
        showToast({ message: t('ipaz_alert_success_deleteData'), type: 'success' });
    }

    async function submitNote(edit: boolean) {
        const {
            note_title,
            note_text,
            note_id,
        } = noteValue();

        if (!handleValidate(noteFormElement)) return;
        if (edit) {
            await updateData('table', noteValue().note_id, noteValue(), 'note');
            updateNote(note_id, noteValue());

            showToast({ message: t('ipaz_alert_success_editData'), type: 'default' });
        } else {
            const newPayment: NotesData = await createNote(
                props.mark().mark_id,
                note_title,
                getDate(),
                note_text,
                true,
            );
            if (newPayment) {
                showToast({ message: t('ipaz_alert_success_addNote'), type: 'success' });
                updateNotes(newPayment);
            }
        }
    }

    function updateNote(payment_id: number, updatedPayment: NotesData) {
        mutateNote((prevNotes: NotesData[]) => {
            const index = prevNotes.findIndex((payment: NotesData) => payment.note_id === payment_id);
            if (index !== -1) {
                const updatedNotes = [...prevNotes];
                updatedNotes[index] = { ...updatedNotes[index], ...updatedPayment };
                return updatedNotes;
            }
            return prevNotes;
        });
    }

    function updateNotes(newPayment: NotesData) {
        mutateNote((prevNotes) => [...prevNotes, newPayment]);
    }

    return (
        <>
            <Card>
                <Card.Header class='card-title h5'>{t('ipaz_mark_managPage_markNotes')}</Card.Header>
                <Card.Body
                    classList={{ 'rtl': locale() === 'ar' }}
                >
                    <ul class='timeline mt-2 mb-0' classList={{ 'timeline-rtl': locale() === 'ar' }}>
                        <Show when={!notes.loading}>
                            <For each={notes()}>
                                {(note) => (
                                    <li class='timeline-item' classList={{ 'timeline-item-rtl': locale() === 'ar' }}>
                                        <strong>{note.note_title}</strong>
                                        <span
                                            class='text-muted text-sm'
                                            classList={{
                                                'float-start': locale() === 'ar',
                                                'float-end': locale() !== 'ar',
                                            }}
                                        >
                                            {note.note_date}

                                            <Show when={store.isAdmin}>
                                                <OverlayTrigger
                                                    placement='top'
                                                    overlay={
                                                        <Tooltip>
                                                            {t('ipaz_buttonTooltip_edit')}
                                                        </Tooltip>
                                                    }
                                                >
                                                    <span
                                                        onClick={() =>
                                                            handldeEditNote(note.note_id)}
                                                    >
                                                        <i
                                                            class='align-middle mx-2 editIcon'
                                                            data-feather='edit'
                                                        />
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
                                                        onClick={() =>
                                                            handldeDeleteNote(note.note_id)}
                                                    >
                                                        <i class='trashIcon align-middle mx-1' data-feather='trash-2' />
                                                    </span>
                                                </OverlayTrigger>
                                            </Show>
                                        </span>
                                        <p>{note.note_text}</p>
                                    </li>
                                )}
                            </For>
                        </Show>
                    </ul>
                    <Row>
                        <Col>
                            <Button onClick={() => setOpenNotes(true)} class='mx-1' variant='success'>
                                {t('ipaz_note_add')}
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <ModalComponent
                header={editMode() ? 'ipaz_note_edit' : 'ipaz_note_add'}
                onOpen={openNotes}
                setOnOpen={setOpenNotes}
                editMode={editMode}
                setEditMode={setEditMode}
                validate={() => handleValidate(noteFormElement)}
                sumbit={submitNote}
            >
                <Form
                    validated={validated()}
                    ref={r => {
                        noteFormElement = r;
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
                        <Form.Label>{t('ipaz_note_title')}</Form.Label>
                        <Form.Control
                            size='lg'
                            type='text'
                            name='note_title'
                            onInput={handleNoteChange}
                            value={noteValue()?.note_title ?? ''}
                            placeholder={t('ipaz_note_title')}
                            required
                        />
                        <Form.Control.Feedback type='invalid'>
                            {t('ipaz_validation_required')}
                        </Form.Control.Feedback>
                    </Form.Group>
                    {
                        /* <Form.Group as={Col} md='12' class='mb-2'>
                    <Form.Label>{t('ipaz_note_date')}</Form.Label>
                    <Form.Control
                        size='lg'
                        type='date'
                        name='note_date'
                        onInput={handleNoteChange}
                        value={noteValue()?.note_date ?? ''}
                        placeholder={t('ipaz_note_date')}
                        required
                    />
                    </Form.Group> */
                    }
                    <Form.Group as={Col} md='12' class='mb-2'>
                        <Form.Label>{t('ipaz_note_description')}</Form.Label>
                        <Form.Control
                            size='lg'
                            type='text'
                            name='note_text'
                            onInput={handleNoteChange}
                            value={noteValue()?.note_text ?? ''}
                            placeholder={t('ipaz_note_description')}
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
