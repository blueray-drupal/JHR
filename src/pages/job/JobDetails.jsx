import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PageLayout from '../../layout/page_layout/PageLayout';
import { parseDrupalSingleNode } from '../../utils/drupalParser';
import './Job.css';

const formatDate = (date) => {
    if (!date) return '';
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
};

function JobDetails() {
    const { id } = useParams();
    const location = useLocation();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [job, setJob] = useState(location.state?.jobData || null);
    const [loading, setLoading] = useState(!location.state?.jobData);

    useEffect(() => {
        if (location.state?.jobData) {
            setJob(location.state.jobData);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/jsonapi/node/jobs/${id}`);
                if (!response.ok) {
                    console.log(response.status)
                }

                const data = await response.json()
                const parsed = parseDrupalSingleNode(data, baseUrl)

                setJob(parsed);

            }
            catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [baseUrl, id, location.state?.jobData])

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "الوظائف", link: "/jobs" },
        { title: job?.title || "", link: null },
    ];

    const body = job?.field_body?.processed || job?.field_body?.value || '';

    return (
        <PageLayout
            pageTitle="الوظائف"
            breadcrumb={breadcrumb}
            isLoading={loading}
            loadingType="detail"
        >
            {job && (
                <div className="job-details">
                    <div className="details-header">
                        <div className="job-card-header">
                            <span className="job-title-bar"></span>
                            <h3 className="title-details">{job.title}</h3>
                        </div>
                        <p className="job-date">
                            {formatDate(job.field_start_date)} - {formatDate(job.field_end_data)}
                        </p>
                    </div>

                    <div className="details-divider"></div>

                    <div className="details-body">
                        <h2>{job.title}</h2>
                        <div
                            className="body"
                            dangerouslySetInnerHTML={{ __html: body }}
                        />
                    </div>
                </div>
            )}
        </PageLayout>
    )
}

export default JobDetails
