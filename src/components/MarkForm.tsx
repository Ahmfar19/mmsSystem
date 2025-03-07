import { useI18n } from '@solid-primitives/i18n';
import { Button, Col, Form, Row, Spinner } from 'solid-bootstrap';
import { Accessor, Component, createSignal, For, Setter, Show } from 'solid-js';
import { category, languages } from '../utils/dataStore';
import { calculateDateAfter10Years } from '../utils/functions';
import { MarkTtype } from '../utils/types';
import ImageComponent from './ImageComponent';

const MarkForm: Component<{
    values: Accessor<MarkTtype | { [key: string]: any }>;
    setValues: Setter<MarkTtype | { [key: string]: any }>;
    appValues: Accessor<Record<string, string>>;
    setApplicationValues: Setter<Record<string, string | number>>;
    handleSaveMark: () => Promise<void>;
    hanleCancel: () => void;
}> = (props) => {
    const [t] = useI18n();
    let formElement: HTMLFormElement;

    const [loading, setLoading] = createSignal(false);
    const [validated, setValidated] = createSignal(false);
    const [shouldClear, setShouldClear] = createSignal(false);

    const handleValidate = () => {
        setValidated(true);
        const customerValidate = props.values().customer_id !== undefined;
        return formElement.checkValidity() && customerValidate;
    };

    function handleChangeMark(e: Event): void {
        const target = e.target as HTMLInputElement;

        if (target.name === 'category_id') {
            const mat = category()![+target.value - 1];
            props.setValues(signalValues => ({
                ...signalValues,
                materials: mat.materials,
            }));
        }

        if (target.type === 'file') {
            const files = Array.from(target.files!);
            props.setValues(signalValues => ({ ...signalValues, [target.name]: files }));
        } else {
            const { name, value, type }: { name: string; value: string | number; type: string } = target;
            props.setValues(signalValues => ({
                ...signalValues,
                [name]: type === 'number' ? +value : value,
            }));
        }
    }

    function handleChangeApplication(e: Event): void {
        const target = e.target as HTMLInputElement;
        const { name, value, type }: { name: string; value: string | number; type: string } = target;

        if (name === 'application_date') {
            props.setValues(signalValues => ({
                ...signalValues,
                protection_start: value,
                protection_end: calculateDateAfter10Years(value),
            }));
        }

        props.setApplicationValues(signalValues => ({
            ...signalValues,
            [name]: type === 'number' ? +value : value,
        }));
    }

    return (
        <Form
            validated={validated()}
            ref={r => {
                formElement = r;
            }}
        >
            <Row>
                <Form.Group class='mb-3' as={Col} md='4'>
                    <Form.Label>{t('ipaz_mark_nameArabic')}</Form.Label>
                    <Form.Control
                        size='lg'
                        type='text'
                        name='name_ar'
                        value={props.values().name_ar ?? ''}
                        onInput={handleChangeMark}
                        placeholder={t('ipaz_mark_nameArabic')}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>
                        {t('ipaz_validation_required')}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group class='mb-3' as={Col} md='4'>
                    <Form.Label>{t('ipaz_mark_nameEnglish')}</Form.Label>
                    <Form.Control
                        size='lg'
                        type='text'
                        name='name_en'
                        onInput={handleChangeMark}
                        value={props.values().name_en ?? ''}
                        placeholder={t('ipaz_mark_nameEnglish')}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>
                        {t('ipaz_validation_required')}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                    as={Col}
                    class='mb-3'
                    classList={{
                        choicesInvalid: validated() && props.values().customer_id === undefined,
                    }}
                >
                    <Form.Label>{t('ipaz_mark_nameCustomer')}</Form.Label>
                    <Form.Select
                        size='lg'
                        name='customer_id'
                        class='customer_id'
                        value={props.values().customer_id ?? ''}
                        onchange={handleChangeMark}
                        required
                    />
                    <Form.Control.Feedback
                        type='invalid'
                        classList={{
                            display: validated() && props.values().customer_id === undefined,
                        }}
                    >
                        {t('ipaz_validation_required')}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row>
                <Form.Group class='mb-3' as={Col} md='4'>
                    <Form.Label>{t('ipaz_mark_applicationId')}</Form.Label>
                    <Form.Control
                        size='lg'
                        type='number'
                        name='custom_app_id'
                        onInput={handleChangeApplication}
                        value={props.appValues().custom_app_id ?? ''}
                        placeholder={t('ipaz_mark_applicationId')}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>
                        {t('ipaz_validation_required')}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group class='mb-3' as={Col} md='4'>
                    <Form.Label>{t('ipaz_mark_applicationDate')}</Form.Label>
                    <Form.Control
                        size='lg'
                        type='date'
                        name='application_date'
                        onInput={handleChangeApplication}
                        value={props.appValues().application_date ?? ''}
                        placeholder={t('ipaz_mark_registerDate')}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>
                        {t('ipaz_validation_required')}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group class='mb-3' md='4' as={Col}>
                    <Form.Label>{t('ipaz_mark_languages')}</Form.Label>
                    <Form.Select
                        size='lg'
                        class='choices-single'
                        name='language_id'
                        value={props.values().language_id ?? ''}
                        onInput={handleChangeMark}
                        required
                    >
                        <option disabled selected value=''>Choose...</option>
                        <For each={languages()}>
                            {(lang) => (
                                <option value={lang.language_id}>
                                    {lang.name}
                                </option>
                            )}
                        </For>
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>
                        {t('ipaz_validation_required')}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row>
                <Form.Group class='mb-3' as={Col} md='4'>
                    <Form.Label>{t('ipaz_mark_certificate_number')}</Form.Label>
                    <Form.Control
                        size='lg'
                        type='text'
                        name='certificate_number'
                        onInput={handleChangeMark}
                        value={props.values().certificate_number ?? ''}
                        placeholder={t('ipaz_mark_certificate_number')}
                    />
                </Form.Group>

                <Form.Group class='mb-3' as={Col} md='4'>
                    <Form.Label>{t('ipaz_mark_certificate_date')}</Form.Label>
                    <Form.Control
                        size='lg'
                        type='date'
                        name='certificate_date'
                        onInput={handleChangeMark}
                        value={props.values().certificate_date ?? ''}
                    />
                </Form.Group>

                <Form.Group class='mb-3' md='4' as={Col}>
                    <Form.Label>{t('ipaz_mark_category')}</Form.Label>
                    <Form.Select
                        size='lg'
                        name='category_id'
                        class='category_id'
                        value={props.values().category_id ?? ''}
                        onChange={handleChangeMark}
                        required
                    >
                        <option selected value=''>Choose...</option>
                        <For each={category()}>
                            {(cat) => (
                                <option value={cat.category_id}>
                                    {cat.category_name}
                                </option>
                            )}
                        </For>
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>
                        {t('ipaz_validation_required')}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row>
                <Form.Group class='mb-3' md='8' as={Col}>
                    <Form.Label>{t('ipaz_mark_agent')}</Form.Label>
                    <Form.Select
                        size='lg'
                        name='agent_id'
                        class='agent_id'
                        value={props.values().agent_id ?? ''}
                        onchange={handleChangeMark}
                    />
                </Form.Group>
            </Row>

            <Row>
                <Form.Group class='mb-3' as={Col} md='4'>
                    <Form.Label>{t('ipaz_mark_description')}</Form.Label>
                    <Form.Control
                        as='textarea'
                        rows={3}
                        name='description'
                        value={props.values().description ?? ''}
                        onInput={handleChangeMark}
                    />
                </Form.Group>

                <Form.Group class='mb-3' as={Col} md='8'>
                    <Form.Label>{t('ipaz_mark_drawing')}</Form.Label>
                    <Form.Control
                        as='textarea'
                        rows={3}
                        name='drawing'
                        value={props.values().drawing ?? ''}
                        onInput={handleChangeMark}
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
                        value={props.values().materials ?? ''}
                        onInput={handleChangeMark}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>
                        {t('ipaz_validation_required')}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <hr />

            <ImageComponent
                handleChange={handleChangeMark}
                shouldClear={shouldClear}
                setShouldClear={setShouldClear}
            />

            <hr />

            <Col class='mb-3'>
                <Button
                    variant='primary'
                    // eslint-disable-next-line solid/reactivity
                    onClick={async () => {
                        if (!handleValidate()) return;
                        setLoading(true);
                        setShouldClear(true);
                        await props.handleSaveMark();
                        setValidated(false);
                        setLoading(false);
                    }}
                >
                    {t('ipaz_mark_save')}
                    <Show when={loading()}>
                        <Spinner
                            as='span'
                            animation='border'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                            class='mx-2'
                        />
                    </Show>
                </Button>
                <Button
                    variant='danger'
                    class='mx-2'
                    onClick={() => {
                        setShouldClear(true);
                        props.hanleCancel();
                        setValidated(false);
                    }}
                >
                    {t('ipaz_modal_cancel')}
                </Button>
            </Col>
        </Form>
    );
};

export default MarkForm;
