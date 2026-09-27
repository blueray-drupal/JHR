import { React, useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import "../info_center/InfoCenter.css";
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import { drupalBaseUrl } from '../../services/api/drupalUrl';





function Laws() {

    const baseUrl = drupalBaseUrl;


    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/jsonapi/node/legislation?include=field_files,field_files.field_file`);


                if (!response.ok) {
                    console.log(response.status)
                }

                const data = await response.json()
                const allFiles = parseDrupalMultipleNodes(data, baseUrl)

                const filteredFiles = allFiles.filter(
                    file => file.field_classification === "lqwnyn"
                )
                console.log(filteredFiles[0].files);

                setFiles(filteredFiles[0].files);




            }
            catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])
    const sidebarMenu = [
        { id: 1, title: "القوانين", link: "/legislations/laws" },
        { id: 2, title: "الأنظمة", link: "/legislations/regulations" },
    ];

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "التشريعات", link: "/legislations/laws" },
        { title: "القوانين", link: null },
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

export default Laws;