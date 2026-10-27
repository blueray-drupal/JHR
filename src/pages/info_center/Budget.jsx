import { React, useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import "./InfoCenter.css";
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import { drupalBaseUrl } from '../../services/api/drupalUrl';
import { formatFileSizeAr } from '../../utils/formatFileSize';

const BUDGET_DATA = [
    {
        id: 1,
        title: "الموازنة التقديرية 2026",
        size: "2.1 MB",
        fileUrl: "/pdf/budget-2026.pdf",
    },
    {
        id: 2,
        title: "الموازنة التقديرية 2025",
        size: "1.9 MB",
        fileUrl: "/pdf/budget-2025.pdf",
    },
    {
        id: 3,
        title: "الموازنة التقديرية 2024",
        size: "1.8 MB",
        fileUrl: "/pdf/budget-2024.pdf",
    },
    {
        id: 4,
        title: "الموازنة التقديرية 2023",
        size: "1.7 MB",
        fileUrl: "/pdf/budget-2023.pdf",
    },
    {
        id: 5,
        title: "الموازنة التقديرية 2022",
        size: "1.6 MB",
        fileUrl: "/pdf/budget-2022.pdf",
    },
    {
        id: 6,
        title: "الموازنة التقديرية 2021",
        size: "1.5 MB",
        fileUrl: "/pdf/budget-2021.pdf",
    },
    {
        id: 7,
        title: "الموازنة التقديرية 2020",
        size: "1.4 MB",
        fileUrl: "/pdf/budget-2020.pdf",
    },
];

function Budget() {
    const baseUrl = drupalBaseUrl;
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/jsonapi/node/information_center?include=field_files,field_files.field_file`);


                if (!response.ok) {
                    console.log(response.status)
                }

                const data = await response.json()
                const allFiles = parseDrupalMultipleNodes(data, baseUrl)

                const files = allFiles.filter(
                    file => file.field_type_of_files === "lmwzn"
                )
                console.log(files[0].files);

                setFiles(files[0].files);




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
        { title: "مركز المعلومات", link: null },
        { title: "الموازنة", link: null },
    ];

    const sidebarMenu = [
        { id: 1, title: "المشاريع", link: "/info-center/projects" },
        { id: 2, title: "الموازنة", link: "/info-center/budget" },
        { id: 3, title: "التقارير السنوية", link: "/info-center/annual-reports" },
        { id: 4, title: "الاتفاقيات", link: "/info-center/agreements" },
    ];

    return (
        <PageLayout
            pageTitle="مركز المعلومات"
            breadcrumb={breadcrumb}
            sidebarTitle="مركز المعلومات"
            sidebarItems={sidebarMenu}
            isLoading={loading}
            loadingType="files"
        >
            <div className="info-center-container">

                <div className="documents-grid">
                    {files.map((item) => (
                        <div key={item.id} className="document-card">
                            <div className="document-icon-wrapper">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="48"
                                    viewBox="0 0 48 48"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M29.9962 3.99902H11.9985C10.9378 3.99902 9.92049 4.4204 9.17044 5.17044C8.4204 5.92049 7.99902 6.93778 7.99902 7.99851V39.9944C7.99902 41.0551 8.4204 42.0724 9.17044 42.8224C9.92049 43.5725 10.9378 43.9939 11.9985 43.9939H35.9954C37.0561 43.9939 38.0734 43.5725 38.8235 42.8224C39.5735 42.0724 39.9949 41.0551 39.9949 39.9944V13.9977L29.9962 3.99902Z"
                                        stroke="#FB2C36"
                                        strokeWidth="3.99948"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M27.9961 3.99902V11.998C27.9961 13.0587 28.4175 14.076 29.1675 14.8261C29.9176 15.5761 30.9348 15.9975 31.9956 15.9975H39.9945"
                                        stroke="#FB2C36"
                                        strokeWidth="3.99948"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M19.9975 17.998H15.998"
                                        stroke="#FB2C36"
                                        strokeWidth="3.99948"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M31.996 25.9971H15.998"
                                        stroke="#FB2C36"
                                        strokeWidth="3.99948"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M31.996 33.9961H15.998"
                                        stroke="#FB2C36"
                                        strokeWidth="3.99948"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            <h3 className="document-title">{item.title}</h3>
                            <span className="document-size">{formatFileSizeAr(item.file.filesize)}</span>

                            <a
                                href={item.file.url}
                                download
                                className="document-download-btn"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span>تحميل PDF</span>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}

export default Budget;