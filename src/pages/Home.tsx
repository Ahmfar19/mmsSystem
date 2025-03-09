import { useI18n } from '@solid-primitives/i18n';
import { Title } from '@solidjs/meta';
import { Card, Col, Row } from 'solid-bootstrap';
import { Component, createResource, Show } from 'solid-js';
import HomeCardComponent from '../components/HomeCardComponent';
import PieChartComponent from '../components/PieChartComponent';
import RegularTable from '../components/RegularTable';
import { setCollapseName } from '../components/SidebarComponent';
import SpinnerComponent from '../components/SpinnerComponent';
import TableComponent from '../components/TableComponent';
import { getCustomData } from '../utils/api';
import { customers } from '../utils/dataStore';
import { calculatePercentage } from '../utils/functions';

export const [
    cardValues,
    { refetch: refetCardValues, mutate: mutateCardValues },
] = createResource(() => getCustomData('custom', 'count'));

export const [
    specMarks,
    { refetch: refetSpecMarks, mutate: mutateSpecMarks },
] = createResource(() => getCustomData('custom', 'specMarks'));

const Home: Component = () => {
    setCollapseName({ collapse: 'marks', page: 'home' });
    const [t] = useI18n();

    const headers = [
        'ipaz_sidebar_ID',
        'ipaz_mark_category',
        'ipaz_mark_nameArabic',
        'ipaz_mark_nameEnglish',
        'ipaz_mark_registerDate',
        'ipaz_mark_managPage_markProtectionEnd',
    ];

    const keys = [
        'mark_id',
        'category_id',
        'name_ar',
        'name_en',
        'protection_start',
        'protection_end',
    ];

    return (
        <>
            <Show when={!specMarks()}>
                <SpinnerComponent />
            </Show>
            <Title>{t('ipaz_home_homTitle')}</Title>
            <h2>
                <strong>{t('ipaz_home_homTitle')}</strong>
            </h2>

            <Row class='mt-3'>
                <HomeCardComponent
                    number={cardValues()?.mark}
                    percentage={100}
                    icon={'bookmark'}
                    header={'ipaz_card_allMarks'}
                />
                <HomeCardComponent
                    number={cardValues()?.protectedMark}
                    percentage={+calculatePercentage(
                        cardValues()?.protectedMark,
                        cardValues()?.mark,
                    )}
                    icon={'database'}
                    header={'ipaz_card_allProtectedMarks'}
                    color='success'
                />
                <HomeCardComponent
                    number={specMarks()?.unProtectedMark.length}
                    percentage={+calculatePercentage(
                        specMarks()?.unProtectedMark.length,
                        cardValues()?.mark,
                    )}
                    icon={'clipboard'}
                    header={'ipaz_chart_unProtectedMark'}
                    color='danger'
                />
                <HomeCardComponent
                    number={customers()?.length}
                    percentage={100}
                    icon={'users'}
                    header={'ipaz_card_allCustomers'}
                />
            </Row>

            <Row>
                <Col lg={12} md={12} sm={12} class='d-flex order-1 order-xxl-3'>
                    <Card class='flex-fill w-100'>
                        <Card.Header>
                            <h5 class='card-title mb-0'>{t('ipaz_chart_PieTitle')}</h5>
                        </Card.Header>
                        <Card.Body class='d-flex'>
                            <Show when={cardValues() && specMarks()}>
                                <PieChartComponent
                                    protectedMark={cardValues()?.protectedMark}
                                    awaitingMark={specMarks()?.awaitingMark.length}
                                    unProtectedMark={specMarks()?.unProtectedMark.length}
                                    protectionEndThisMonth={specMarks()?.protectionEndThisMonth.length}
                                />
                            </Show>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={12} md={12} sm={12} class='d-flex order-1 order-xxl-3'>
                    <Card class='flex-fill w-100'>
                        <Card.Header>
                            <h5 class='card-title mb-0'>{t('ipaz_card_last10Mark')}</h5>
                        </Card.Header>
                        <Card.Body class='d-flex overflow-auto'>
                            <Show when={specMarks()}>
                                <RegularTable
                                    data={specMarks()?.last10MarksArray}
                                    header={headers}
                                    keys={keys}
                                />
                            </Show>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Show
                when={specMarks()?.unProtectedMark.length}
            >
                <Row>
                    <Col lg={12} md={12} sm={12} class='d-flex order-1 order-xxl-3'>
                        <Card class='flex-fill w-100'>
                            <Card.Header>
                                <h5 class='card-title mb-0'>{t('ipaz_chart_unProtectedMark')}</h5>
                            </Card.Header>
                            <Card.Body dir='ltr'>
                                <Show when={specMarks().unProtectedMark}>
                                    <TableComponent
                                        id='unProtectedMark'
                                        columnsHeader={headers}
                                        keys={keys}
                                        data={() => specMarks().unProtectedMark}
                                        options={{ edit: false, delete: false, id: 'mark_id' }}
                                    />
                                </Show>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Show>

            <Show
                when={specMarks()?.protectionEndThisMonth.length}
            >
                <Row>
                    <Col lg={12} md={12} sm={12} class='d-flex order-1 order-xxl-3'>
                        <Card class='flex-fill'>
                            <Card.Header>
                                <h5 class='card-title mb-0'>{t('ipaz_chart_protectionEndThisMonth')}</h5>
                            </Card.Header>
                            <Card.Body dir='ltr'>
                                <TableComponent
                                    id='protectionEndThisMonth'
                                    columnsHeader={headers}
                                    keys={keys}
                                    data={() => specMarks().protectionEndThisMonth}
                                    options={{ edit: false, delete: false, id: 'mark_id' }}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Show>
        </>
    );
};

export default Home;
