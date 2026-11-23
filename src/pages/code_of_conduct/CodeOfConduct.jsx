import React, { useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import { drupalBaseUrl } from "../../services/api/drupalUrl";
import "../basic_page/BasicPage.css";

function CodeOfConduct() {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${drupalBaseUrl}/jsonapi/node/job_conduct?filter[status]=1&page[limit]=1&sort=-changed`
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                const node = Array.isArray(data.data) ? data.data[0] : data.data;
                if (!node) {
                    setPage(null);
                    return;
                }

                const attrs = node.attributes || {};
                setPage({
                    title: attrs.title || "مدونة السلوك الوظيفي",
                    body:
                        attrs.field_body?.processed ||
                        attrs.field_body?.value ||
                        attrs.body?.processed ||
                        attrs.body?.value ||
                        "",
                });
            } catch (error) {
                console.error(error);
                setPage(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const title = page?.title || "مدونة السلوك الوظيفي";
    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title, link: null },
    ];

    return (
        <PageLayout
            pageTitle={title}
            breadcrumb={breadcrumb}
            isLoading={loading}
            loadingType="content"
        >
            <div
                className="basic-page-body"
                dangerouslySetInnerHTML={{ __html: page?.body || "" }}
            />
        </PageLayout>
    );
}

export default CodeOfConduct;
