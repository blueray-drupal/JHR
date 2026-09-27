import React, { useState, useEffect } from 'react';
import PageLayout from '../../layout/page_layout/PageLayout';
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import { ABOUT_SIDEBAR } from './aboutConfig';
import { drupalBaseUrl } from '../../services/api/drupalUrl';
import './About.css';

const formatYear = (date) => {
    if (!date) return '---';
    return date.split('-')[0];
};

const getPositionClass = (position) => {
    if (!position) return 'default';
    if (position.includes('رئيس مجلس')) return 'chairman';
    if (position.includes('نائب')) return 'vice';
    return 'default';
};

function AboutPage({ sectionPosition }) {
    const baseUrl = drupalBaseUrl;
    const [section, setSection] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/jsonapi/node/about_us?include=field_board_of_directors,field_directors_general,field_vision_mission,field_welcoming_remark,field_welcoming_remark.field_media_image,field_welcoming_remark.field_media_image.field_media_image,field_media_image,field_media_image.field_media_image`);
                if (!response.ok) {
                    console.log(response.status)
                }

                const data = await response.json()
                const allSections = parseDrupalMultipleNodes(data, baseUrl)

                const found = allSections.find(s => s.field_section_position === sectionPosition)
                    || allSections.find(s => s.field_section_position === 'about_us');

                setSection(found);

            }
            catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [sectionPosition])

    const aboutLoadingType =
        sectionPosition === 'board_of_directors' || sectionPosition === 'directors_general'
            ? 'table'
            : sectionPosition === 'organizational_structure'
              ? 'org-chart'
              : sectionPosition === 'welcoming_remark'
                ? 'welcome'
                : 'content';

    const activeItem = ABOUT_SIDEBAR.find(item => {
        const routes = {
            about_us: '/about',
            welcoming_remark: '/welcome-speech',
            board_of_directors: '/board-directors',
            organizational_structure: '/organization-chart',
            directors_general: '/general-managers',
        };
        return item.link === routes[sectionPosition];
    });

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "عن المؤسسة", link: "/about" },
        { title: activeItem?.title || section?.title || "", link: null },
    ];

    const body = section?.field_body?.processed || section?.field_body?.value || '';
    const visionItems = section?.paragraphs?.field_vision_mission || [];
    const welcomeItem = section?.paragraphs?.field_welcoming_remark?.[0];
    const boardItems = section?.paragraphs?.field_board_of_directors || [];
    const directorItems = section?.paragraphs?.field_directors_general || [];

    const renderContent = () => {
        if (!section) return null;

        switch (sectionPosition) {
            case 'about_us':
                return (
                    <>
                        <div className="about-body" dangerouslySetInnerHTML={{ __html: body }} />
                        {visionItems.length > 0 && (
                            <div className="vision-mission-row">
                                {visionItems.map((item) => {
                                    const isVision = item.field_title?.includes('الرؤية');
                                    const itemBody = item.field_body?.processed || item.body || '';
                                    return (
                                        <div key={item.id} className={isVision ? 'vision-box' : 'mission-box'}>
                                            <h4>{item.field_title || item.title}</h4>
                                            <div dangerouslySetInnerHTML={{ __html: itemBody }} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                );

            case 'welcoming_remark':
                return (
                    <div className="welcome-content">
                                <div className="welcome-side">
                            <div className="welcome-image">
                                {welcomeItem?.image ? (
                                    <img src={welcomeItem.image} alt="صورة المدير العام" />
                                ) : (
                                    <span className="welcome-image-placeholder">صورة المدير العام</span>
                                )}
                            </div>
                            <div className="welcome-profile">
                                <p className="welcome-name">{welcomeItem?.field_title || welcomeItem?.title}</p>
                                <p className="welcome-position">{welcomeItem?.field_position}</p>
                                <p className="welcome-company">{welcomeItem?.field_company}</p>
                            </div>
                        </div>
                        <div
                            className="welcome-text"
                            dangerouslySetInnerHTML={{ __html: welcomeItem?.field_body?.processed || welcomeItem?.body || '' }}
                        />
                
                    </div>
                );

            case 'board_of_directors':
                return (
                    <div className="about-table-wrapper">
                        <table className="about-table">
                            <thead>
                                <tr>
                                    <th className="col-index">#</th>
                                    <th>الاسم</th>
                                    <th>صفة</th>
                                    <th>ممثل عن</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boardItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="col-index">{index + 1}</td>
                                        <td>{item.field_title || item.title}</td>
                                        <td>
                                            <span className={`position-badge ${getPositionClass(item.field_position)}`}>
                                                {item.field_position || '-----'}
                                            </span>
                                        </td>
                                        <td>{item.field_company || '--------'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'organizational_structure':
                return section.image ? (
                    <div className="org-chart-image">
                        <img src={section.image} alt={section.title} />
                    </div>
                ) : null;

            case 'directors_general':
                return (
                    <div className="about-table-wrapper">
                        <table className="about-table">
                            <thead>
                                <tr>
                                    <th className="col-index">#</th>
                                    <th>اسم المدير</th>
                                    <th>من</th>
                                    <th>إلى</th>
                                </tr>
                            </thead>
                            <tbody>
                                {directorItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="col-index">{index + 1}</td>
                                        <td>{item.field_title || item.title}</td>
                                        <td>{formatYear(item.field_start_date)}</td>
                                        <td>{formatYear(item.field_end_date)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <PageLayout
            pageTitle="عن المؤسسة"
            breadcrumb={breadcrumb}
            sidebarTitle="عن المؤسسة"
            sidebarItems={ABOUT_SIDEBAR}
            isLoading={loading}
            loadingType={aboutLoadingType}
        >
            {section && renderContent()}
        </PageLayout>
    );
}

export default AboutPage;
