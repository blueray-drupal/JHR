import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import PageLayout from "../../layout/page_layout/PageLayout";
import { parseDrupalSingleNode } from "../../utils/drupalParser";
import { drupalBaseUrl } from "../../services/api/drupalUrl";
import "../media_center/NewsDetails.css";

function ProjectDetails() {
    const { id } = useParams();
    const location = useLocation();
    const baseUrl = drupalBaseUrl;
    const initialProject =
        location.state && location.state.id ? location.state : null;
    const [project, setProject] = useState(initialProject);
    const [loading, setLoading] = useState(!initialProject);

    useEffect(() => {
        if (initialProject?.id === id && (initialProject.field_body || initialProject.body)) {
            setProject(initialProject);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${baseUrl}/jsonapi/node/projects/${id}?include=field_media_image,field_media_image.field_media_image`
                );
                if (!response.ok) {
                    console.log(response.status);
                    return;
                }

                const data = await response.json();
                setProject(parseDrupalSingleNode(data, baseUrl));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseUrl, id, initialProject]);

    const body =
        project?.field_body?.processed ||
        project?.field_body?.value ||
        project?.body ||
        "";

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "مركز المعلومات", link: null },
        { title: "المشاريع", link: "/info-center/projects" },
        { title: project?.title || "", link: null },
    ];

    const sidebarMenu = [
        { id: 1, title: "المشاريع", link: "/info-center/projects" },
        { id: 2, title: "الموازنة", link: "/info-center/budget" },
        { id: 3, title: "التقارير السنوية", link: "/info-center/annual-reports" },
        { id: 4, title: "الاتفاقيات", link: "/info-center/agreements" },
    ];

    return (
        <PageLayout
            pageTitle={project?.title || "مركز المعلومات"}
            breadcrumb={breadcrumb}
            sidebarTitle="مركز المعلومات"
            sidebarItems={sidebarMenu}
            isLoading={loading}
            loadingType="detail"
        >
            {project && (
                <div className="news-details">
                    {(project.field_date || project.created) && (
                        <span className="card-date" style={{ display: "block", marginBottom: 12 }}>
                            {project.field_date || project.created}
                        </span>
                    )}
                    <div
                        className="news-details-body"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                    {project.image && (
                        <div className="news-details-image">
                            <img src={project.image} alt={project.title} />
                        </div>
                    )}
                </div>
            )}
        </PageLayout>
    );
}

export default ProjectDetails;
