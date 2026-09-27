import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PageLayout from '../../layout/page_layout/PageLayout';
import { parseDrupalSingleNode } from '../../utils/drupalParser';
import { mapTenderNode } from '../../services/api/tendersApi';
import { drupalBaseUrl } from '../../services/api/drupalUrl';
import './Tenders.css';

const formatDateRange = (startDate, endDate) => {
    if (startDate && endDate) {
        return `${startDate} - ${endDate}`;
    }
    return startDate || endDate || '';
};

function TenderDetails() {
    const { id } = useParams();
    const location = useLocation();
    const baseUrl = drupalBaseUrl;
    const [tender, setTender] = useState(location.state?.tenderData || null);
    const [loading, setLoading] = useState(!location.state?.tenderData?.bodyHtml);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/jsonapi/node/tenders/${id}`);
                if (!response.ok) {
                    console.log(response.status);
                    return;
                }

                const data = await response.json();
                const parsed = parseDrupalSingleNode(data, baseUrl);
                setTender(mapTenderNode(parsed));
            } catch (error) {
                console.error('Error fetching tender details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (location.state?.tenderData?.bodyHtml) {
            setTender(location.state.tenderData);
            setLoading(false);
            return;
        }

        fetchData();
    }, [baseUrl, id, location.state?.tenderData]);

    const breadcrumb = [
        { title: 'الرئيسية', link: '/' },
        { title: 'العطاءات', link: '/tenders' },
        { title: tender?.title || '', link: null },
    ];

    const body = tender?.bodyHtml || '';

    return (
        <PageLayout
            pageTitle="العطاءات"
            breadcrumb={breadcrumb}
            showShare
            isLoading={loading}
            loadingType="detail"
        >
            {tender && (
                <>
                    <div className="tender-details-meta">
                        {tender.tenderNumber && (
                            <span className="tender-number-badge">
                                {`رقم العطاء : ${tender.tenderNumber}`}
                            </span>
                        )}
                        {formatDateRange(tender.startDate, tender.endDate) && (
                            <span className="tender-date">
                                {formatDateRange(tender.startDate, tender.endDate)}
                            </span>
                        )}
                    </div>

                    <h2 className="tender-card-title">{tender.title}</h2>

                    {body.includes('<') ? (
                        <div
                            className="tender-details-body"
                            dangerouslySetInnerHTML={{ __html: body }}
                        />
                    ) : (
                        <div className="tender-details-body">
                            <p>{body || tender.brief}</p>
                        </div>
                    )}
                </>
            )}
        </PageLayout>
    );
}

export default TenderDetails;
