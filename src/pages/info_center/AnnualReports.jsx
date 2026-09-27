import { React, useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import "./InfoCenter.css";
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import { drupalBaseUrl } from '../../services/api/drupalUrl';

const ANNUAL_REPORTS_DATA = [
    {
        id: 1,
        title: "التقرير السنوي 2025",
        details: "84 صفحة - سنة 2025",
        type: "PDF",
        size: "5320 ك.ب",
        fileUrl: "/pdf/annual-report-2025.pdf",
    },
    {
        id: 2,
        title: "التقرير السنوي 2024",
        details: "76 صفحة - سنة 2024",
        type: "PDF",
        size: "4870 ك.ب",
        fileUrl: "/pdf/annual-report-2024.pdf",
    },
    {
        id: 3,
        title: "التقرير السنوي 2023",
        details: "70 صفحة - سنة 2023",
        type: "PDF",
        size: "4210 ك.ب",
        fileUrl: "/pdf/annual-report-2023.pdf",
    },
    {
        id: 4,
        title: "التقرير السنوي 2022",
        details: "68 صفحة - سنة 2022",
        type: "PDF",
        size: "3980 ك.ب",
        fileUrl: "/pdf/annual-report-2022.pdf",
    },
    {
        id: 5,
        title: "التقرير السنوي 2021",
        details: "65 صفحة - سنة 2021",
        type: "PDF",
        size: "3640 ك.ب",
        fileUrl: "/pdf/annual-report-2021.pdf",
    },
    {
        id: 6,
        title: "التقرير السنوي 2020",
        details: "60 صفحة - سنة 2020",
        type: "PDF",
        size: "3290 ك.ب",
        fileUrl: "/pdf/annual-report-2020.pdf",
    },
];

function AnnualReports() {

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
                    file => file.field_type_of_files === "ltqryr_lsnwy"
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
        { title: "التقارير السنوية", link: null },
    ];

    const sidebarMenu = [
        { id: 1, title: "المشاريع", link: "/info-center/projects" },
        { id: 2, title: "الموازنة", link: "/info-center/budget" },
        { id: 3, title: "التقارير السنوية", link: "/info-center/annual-reports" },
        { id: 4, title: "الاتفاقيات", link: "/info-center/agreements" },
    ];

    return (
        <PageLayout
            pageTitle="التشريعات"
            breadcrumb={breadcrumb}
            sidebarTitle="التشريعات"
            sidebarItems={sidebarMenu}
            isLoading={loading}
            loadingType="files"
        >
            <div className="info-center-container">
                <div className="reports-table-container">
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th className="col-file-name">اسم الملف</th>
                                <th className="col-type">النوع</th>
                                <th className="col-size">الحجم</th>
                                <th className="col-action">عرض وتحميل</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((item) => (
                                <tr key={item.id}>
                                    <td className="col-file-name">
                                        <div className="file-info">
                                            <span className="file-title">{item.title}</span>
                                            <span className="file-subtitle">{item.date}</span>
                                        </div>
                                    </td>
                                    <td className="col-type">
                                        <span >{item.file.filemime.split("/")[1] == "pdf" ? (<span className="pdf-icon-badge" >PDF</span>) : (<span className="pdf-icon-badge" style={{
                                            background: "blue"
                                        }}>DOCS</span>)} </span>
                                    </td>
                                    <td className="col-size">{item.file.filesize % 1024} kb</td>
                                    <td className="col-action">
                                        <a
                                            href={item.file.url}
                                            download
                                            className="table-download-btn"
                                            title="تحميل"
                                            target="_blank"
                                        >
                                            <svg
                                                width="18"
                                                height="18"
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageLayout>
    );
}

export default AnnualReports;