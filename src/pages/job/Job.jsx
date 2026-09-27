import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../layout/page_layout/PageLayout';
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import './Job.css';

const formatDate = (date) => {
    if (!date) return '';
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
};

function Job() {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/jsonapi/node/jobs`);
                if (!response.ok) {
                    console.log(response.status)
                }

                const data = await response.json()
                const allJobs = parseDrupalMultipleNodes(data, baseUrl)

                setJobs(allJobs);

            }
            catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "الوظائف", link: null },
    ];

    return (
        <PageLayout
            pageTitle="الوظائف"
            breadcrumb={breadcrumb}
            isLoading={loading}
            loadingType="jobs"
        >
            <div className="jobs-wrapper">
                {jobs.map((job) => (
                    <div className="job-card" key={job.id}>
                        <div className="job-card-header">
                            <span className="job-title-bar"></span>
                            <h2 className="job-title">{job.title}</h2>
                        </div>
                        <p className="job-date">
                            {formatDate(job.field_start_date)} - {formatDate(job.field_end_data)}
                        </p>
                        <div className="job-card-divider"></div>
                        <Link
                            to={`/jobs/${job.id}`}
                            state={{ jobData: job }}
                            className="link-job"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            اقرأ المزيد
                        </Link>
                    </div>
                ))}
            </div>
        </PageLayout>
    )
}

export default Job
