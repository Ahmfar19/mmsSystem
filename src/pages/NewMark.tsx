import { useI18n } from '@solid-primitives/i18n';
import { Title } from '@solidjs/meta';
import { BaseDirectory, writeBinaryFile } from '@tauri-apps/api/fs';
import Choices from 'choices.js';
import { Card, Col } from 'solid-bootstrap';
import { Component, createEffect, createSignal, onCleanup, onMount, untrack } from 'solid-js';
import { useAppContext } from '../AppContext';
import MarkForm from '../components/MarkForm';
import { setCollapseName } from '../components/SidebarComponent';
import { postData, updateData } from '../utils/api';
import { agent, customers, mutateMarks } from '../utils/dataStore';
import { createNote, getDate, isCurrentMonthAndYear, isDateInFeature, isDateInPast } from '../utils/functions';
import showToast from '../utils/ToastMessage';
import { MarkTtype } from '../utils/types';

const NewMark: Component = () => {
    setCollapseName({ collapse: 'marks', page: 'newMark' });
    let customerIDChoise: Choices;
    let agentIDChoise: Choices;

    const [t] = useI18n();
    const { store } = useAppContext();

    const [markValues, setMarkValues] = createSignal<MarkTtype | { [key: string]: any }>({});
    const [applicatiponValues, setApplicationValues] = createSignal<any>({});

    const handleSaveMark = async () => {
        setMarkValues(signalValues => ({ ...signalValues, staff_id: store.staffID }));

        // Extract the files (logo) from the signal
        const { logo, ...newSignal } = markValues();

        setMarkValues(newSignal);

        const { error, id } = await postData(markValues(), 'mark');

        if (error) {
            showToast({ message: t('ipaz_alert_fail_addMark'), type: 'error' });
        } else {
            showToast({ message: t('ipaz_alert_success_addMark'), type: 'success' });
            createNote(id!, t('ipaz_note_markRegisterd'), getDate(), t('ipaz_note_markRegisterdDone'));

            // Move the logos if exsist
            if (logo) {
                const logos: string[] = [];
                logo.forEach((file: File) => {
                    const reader = new FileReader();
                    const filename = `${id}_${file.name}`;
                    logos.push(filename);
                    reader.onload = async (event: any) => {
                        const fileData = new Uint8Array(event?.target?.result);
                        const path = `images/${filename}`;
                        await writeBinaryFile(path, fileData, { dir: BaseDirectory.AppData });
                    };
                    reader.readAsArrayBuffer(file);
                });
                updateData(id!, { logo: logos.join(',') }, 'mark', 'mark_id');
            }

            // Make a new application
            handleSaveApplication(String(id));

            mutateMarks((prevValues: any) => {
                let updatedMarksArray;
                const updatedUnProtectedMark: MarkTtype[] = [];
                const updatedEndThisMonth: MarkTtype[] = [];
                const updatedprotectedMarks: MarkTtype[] = [];

                const merkValues = untrack(() => markValues());
                merkValues.mark_id = id;

                if (prevValues.lastTenMarks.length >= 10) {
                    updatedMarksArray = [...prevValues.lastTenMarks.slice(0, -1)];
                } else {
                    updatedMarksArray = [...prevValues.lastTenMarks];
                }

                updatedMarksArray.unshift(merkValues);

                if (isDateInPast(merkValues.protection_end)) {
                    updatedUnProtectedMark.push(merkValues as MarkTtype);
                } else if (isDateInFeature(merkValues.protection_end)) {
                    updatedprotectedMarks.push(merkValues as MarkTtype);
                }

                if (isCurrentMonthAndYear(merkValues.protection_end)) {
                    updatedEndThisMonth.push(merkValues as MarkTtype);
                }

                return {
                    ...prevValues,
                    marksCount: prevValues.marksCount + 1,
                    lastTenMarks: updatedMarksArray,
                    unProtectedMarks: [...prevValues.unProtectedMarks, ...updatedUnProtectedMark],
                    protectionEndThisMonth: [...prevValues.protectionEndThisMonth, ...updatedEndThisMonth],
                    protectedMarks: [...prevValues.protectedMarks, ...updatedprotectedMarks],
                };
            });

            // Empty the input fields
            setMarkValues({});
        }
    };

    async function handleSaveApplication(mark_id: string) {
        if (mark_id) {
            setApplicationValues(signalValues => ({
                ...signalValues,
                mark_id,
                staff_id: store.staffID,
                type_id: 1,
            }));
        }
        const { error } = await postData(applicatiponValues(), 'application');

        if (error) {
            showToast({ message: t('ipaz_alert_fail_addApp'), type: 'error' });
        } else {
            showToast({ message: t('ipaz_alert_success_addApp'), type: 'success' });

            // Create a new note for the application
            await createNote(
                +mark_id,
                t('ipaz_note_marApplicationkRegisterd'),
                applicatiponValues().application_date,
                t('ipaz_note_marApplicationkRegisterdDone') + ` (${applicatiponValues()?.custom_app_id})`,
            );
            setApplicationValues({});
            customerIDChoise.setChoiceByValue('');
            agentIDChoise.setChoiceByValue('');
        }
    }

    function hanleCancel(): void {
        setMarkValues({});
        setApplicationValues({});
        customerIDChoise.setChoiceByValue('');
        agentIDChoise.setChoiceByValue('');
    }

    onMount(() => {
        customerIDChoise = new Choices(document.querySelector('.customer_id') as HTMLInputElement, {
            choices: [],
            shouldSort: false,
            renderChoiceLimit: 500,
        });
        agentIDChoise = new Choices(document.querySelector('.agent_id') as HTMLInputElement, {
            choices: [],
            shouldSort: false,
            renderChoiceLimit: 500,
        });
    });

    createEffect(() => {
        if (customers()) {
            setTimeout(() => {
                const customerData: any[] = customers();
                const customerID: { value: any; label: any; selected?: any }[] = [{
                    value: '',
                    label: 'Choose...',
                    selected: true,
                }];
                customerData.forEach(({ customer_id, firstname, lastname }) => {
                    customerID.push({ value: customer_id, label: firstname + ' ' + lastname });
                });
                customerIDChoise?.setChoices(customerID, 'value', 'label', true);
            }, 0);
        }
    });

    createEffect(() => {
        if (agent()) {
            setTimeout(() => {
                const agentData: any[] = agent();
                const agentID: { value: any; label: any; selected?: any }[] = [{
                    value: '',
                    label: 'Choose...',
                    selected: true,
                }];
                // eslint-disable-next-line @typescript-eslint/no-shadow
                agentData.forEach(({ agent_id, agent }) => {
                    agentID.push({ value: agent_id, label: agent });
                });
                agentIDChoise?.setChoices(agentID, 'value', 'label', true);
            }, 0);
        }
    });

    onCleanup(() => {
        customerIDChoise.destroy();
        agentIDChoise.destroy();
    });

    return (
        <>
            <Title>{t('ipaz_mark_applicationRequest')}</Title>
            <Col md='12'>
                <Card>
                    <Card.Header>
                        <h2 class='card-title'>{t('ipaz_mark_applicationRequest')}</h2>
                        <h6 class='card-subtitle text-muted'>{t('ipaz_mark_information')}</h6>
                    </Card.Header>

                    <Card.Body>
                        <MarkForm
                            values={markValues}
                            setValues={setMarkValues}
                            appValues={applicatiponValues}
                            setApplicationValues={setApplicationValues}
                            handleSaveMark={handleSaveMark}
                            hanleCancel={hanleCancel}
                        />
                    </Card.Body>
                </Card>
            </Col>
        </>
    );
};

export default NewMark;
