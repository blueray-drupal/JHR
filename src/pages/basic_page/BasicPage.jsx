import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLayout from "../../layout/page_layout/PageLayout";
import { parseDrupalMultipleNodes } from "../../utils/drupalParser";
import "./BasicPage.css";
import { drupalBaseUrl } from '../../services/api/drupalUrl';

function BasicPage() {
    const location = useLocation();
    const baseUrl = drupalBaseUrl;
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/jsonapi/node/basic_page`);

                if (!response.ok) {
                    console.log(response.status);
                }

                const data = await response.json();
                const allPages = parseDrupalMultipleNodes(data, baseUrl);

                // كل صفحة تعرض على المسار القادم من field_link
                setPage(allPages.find((item) => item.field_link === location.pathname) || null);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseUrl, location.pathname]);

    const body = page?.field_body1?.processed || page?.field_body1?.value || "";

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: page?.title || "", link: null },
    ];

    return (
        <PageLayout
            pageTitle={page?.title || ""}
            breadcrumb={breadcrumb}
            isLoading={loading}
            loadingType="content"
        >
            <div
                className="basic-page-body"
                dangerouslySetInnerHTML={{ __html: body }}
            />
        </PageLayout>
    );
}

export default BasicPage;
