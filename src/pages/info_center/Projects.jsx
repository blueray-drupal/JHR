import React, { useState, useMemo, useEffect } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import "./InfoCenter.css";
import { Link } from "react-router-dom";
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import { drupalBaseUrl } from '../../services/api/drupalUrl';

const ITEMS_PER_PAGE = 3;

// Helper to strip HTML tags safely
const stripHtml = (htmlString) => {
    if (!htmlString) return '';
    return htmlString.replace(/<[^>]*>?/gm, '').trim();
};

function Projects() {
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = drupalBaseUrl;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Ensure include query parameter fetches images and nested references
                const endpoint = `${baseUrl}/jsonapi/node/projects?include=field_media_image,field_media_image.field_media_image`;
                const response = await fetch(endpoint);

                if (!response.ok) {
                    setIsLoading(false);
                    return;
                }

                const data = await response.json();
                const parsedProjects = parseDrupalMultipleNodes(data, baseUrl);
                console.log("Parsed Projects:", parsedProjects);

                setProjects(parsedProjects || []);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [baseUrl]);

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "مركز المعلومات", link: null },
        { title: "المشاريع", link: null },
    ];

    const sidebarMenu = [
        { id: 1, title: "المشاريع", link: "/info-center/projects" },
        { id: 2, title: "الموازنة", link: "/info-center/budget" },
        { id: 3, title: "التقارير السنوية", link: "/info-center/annual-reports" },
        { id: 4, title: "الاتفاقيات", link: "/info-center/agreements" },
    ];

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const projectTitle = project?.title || "";
            const matchesTitle = projectTitle
                .toLowerCase()
                .includes(searchQuery.toLowerCase().trim());
            const matchesCategory =
                selectedCategory === "all" || project?.category === selectedCategory;
            return matchesTitle && matchesCategory;
        });
    }, [projects, searchQuery, selectedCategory]);

    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1;

    const currentProjects = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProjects, currentPage]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <PageLayout
            pageTitle="مركز المعلومات"
            breadcrumb={breadcrumb}
            sidebarTitle="مركز المعلومات"
            sidebarItems={sidebarMenu}
            isLoading={isLoading}
            loadingType="projects"
        >
            <div className="info-center-container">

                <div className="filter-controls-row">
                    <p className="filter-instruction">
                        للاطلاع على مشاريع المؤسسة، يرجى اختيار التصنيف
                    </p>

                    <form className="search-form" onSubmit={handleSearchSubmit}>
                        <label htmlFor="project-search" className="search-label">
                            اسم المشروع
                        </label>
                        <input
                            id="project-search"
                            type="text"
                            className="search-input"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button type="submit" className="search-btn">
                            بحث
                        </button>
                    </form>
                </div>

                <div className="info-items-list">
                    {!isLoading && currentProjects.length > 0 ? (
                        currentProjects.map((project) => {
                            // Extract clean plain text for description
                            const rawDescription = project?.summary || project?.body || project?.field_body?.value || "";
                            const cleanDescription = stripHtml(rawDescription);

                            return (
                                <div key={project.id} className="info-item-card">
                                    <div className="info-item-media">
                                        <img
                                            src={project.image || "/assets/placeholder.jpg"}
                                            alt={project.title || "صورة المشروع"}
                                        />
                                    </div>
                                    <div className="info-item-content">
                                        <h3 className="info-item-title">{project.title}</h3>
                                        <span className="info-item-date">{project.created || project.date || ""}</span>
                                        <p className="info-item-description">
                                            {cleanDescription.length > 180
                                                ? `${cleanDescription.substring(0, 180)}...`
                                                : cleanDescription}
                                        </p>
                                        <Link
                                            to={`/info-center/projects/${project.id}`}
                                            className="item-action-link"
                                            state={project}
                                        >
                                            عرض المزيد &rsaquo;
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : !isLoading ? (
                        <div className="no-results">لا توجد نتائج مطابقة لبحثك</div>
                    ) : null}
                </div>

                {!isLoading && filteredProjects.length > 0 && (
                    <div className="pagination-container">
                        <span className="pagination-info">
                            صفحة {currentPage} من {totalPages}
                        </span>
                        <div className="pagination-controls">
                            <button
                                className="page-nav-btn"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &lsaquo;
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`page-num-btn ${page === currentPage ? "active" : ""}`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="page-nav-btn"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                &rsaquo;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}

export default Projects;