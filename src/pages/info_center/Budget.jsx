import { React, useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import "./InfoCenter.css";
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';

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
    const baseUrl = import.meta.env.VITE_BASE_URL;
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
                                {/* Red PDF Document SVG Icon */}
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <line x1="10" y1="9" x2="8" y2="9" />
                                </svg>
                            </div>

                            <h3 className="document-title">{item.title}</h3>
                            <span className="document-size">{item.file.filesize % 1024} kb</span>

                            <a
                                href={item.file.url}
                                download
                                className="document-download-btn"
                                target="_blank"
                            >
                                <span>تحميل PDF</span>
                                {/* Download Tray SVG Icon */}
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
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