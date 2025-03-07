import { useI18n } from '@solid-primitives/i18n';
import { Title } from '@solidjs/meta';
import { Card, Col, Row } from 'solid-bootstrap';
import { Component, Show } from 'solid-js';
import HomeCardComponent from '../components/HomeCardComponent';
import PieChartComponent from '../components/PieChartComponent';
import RegularTable from '../components/RegularTable';
import { setCollapseName } from '../components/SidebarComponent';
import SpinnerComponent from '../components/SpinnerComponent';
import TableComponent from '../components/TableComponent';
import { customers, marks } from '../utils/dataStore';
import { calculatePercentage } from '../utils/functions';

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
            <Show when={!marks()}>
                <SpinnerComponent />
            </Show>
            <Title>{t('ipaz_home_homTitle')}</Title>
            <h2>
                <strong>{t('ipaz_home_homTitle')}</strong>
            </h2>

            <Row class='mt-3'>
                <HomeCardComponent
                    number={marks()?.marksCount || 0}
                    percentage={100}
                    icon={'bookmark'}
                    header={'ipaz_card_allMarks'}
                />
                <HomeCardComponent
                    number={marks()?.protectedMarks.length || 0}
                    percentage={+calculatePercentage(
                        marks()?.protectedMarks.length || 0,
                        marks()?.marksCount,
                    )}
                    icon={'database'}
                    header={'ipaz_card_allProtectedMarks'}
                    color='success'
                />
                <HomeCardComponent
                    number={marks()?.unProtectedMarks.length || 0}
                    percentage={+calculatePercentage(
                        marks()?.unProtectedMarks.length || 0,
                        marks()?.marksCount,
                    )}
                    icon={'clipboard'}
                    header={'ipaz_chart_unProtectedMark'}
                    color='danger'
                />
                <HomeCardComponent
                    number={customers()?.length || 0}
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
                            <Show when={marks()}>
                                <PieChartComponent
                                    protectedMark={marks()!.protectedMarks.length}
                                    awaitingMark={marks()!.pendingMarks.length}
                                    unProtectedMark={marks()!.unProtectedMarks?.length}
                                    protectionEndThisMonth={marks()!.protectionEndThisMonth?.length}
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
                            <Show when={marks()}>
                                <RegularTable
                                    data={marks()!.lastTenMarks}
                                    header={headers}
                                    keys={keys}
                                />
                            </Show>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Show
                when={marks()?.unProtectedMarks.length}
            >
                <Row>
                    <Col lg={12} md={12} sm={12} class='d-flex order-1 order-xxl-3'>
                        <Card class='flex-fill w-100'>
                            <Card.Header>
                                <h5 class='card-title mb-0'>{t('ipaz_chart_unProtectedMark')}</h5>
                            </Card.Header>
                            <Card.Body dir='ltr'>
                                <Show when={marks()!.unProtectedMarks}>
                                    <TableComponent
                                        id='unProtectedMark'
                                        columnsHeader={headers}
                                        keys={keys}
                                        data={() => marks()!.unProtectedMarks}
                                        options={{ edit: false, delete: false, id: 'mark_id' }}
                                    />
                                </Show>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Show>

            <Show
                when={marks()?.protectionEndThisMonth.length}
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
                                    data={() => marks()!.protectionEndThisMonth}
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
