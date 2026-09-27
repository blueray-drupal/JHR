import React, { useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import "./InfoCenter.css";
import { parseDrupalMultipleNodes } from "../../utils/drupalParser";

const ITEMS_PER_PAGE = 4;

function Agreements() {
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // جلب بيانات مركز المعلومات مع تضمين الفقرات والميديا
                const response = await fetch(
                    `${baseUrl}/jsonapi/node/information_center?include=field_agreements,field_agreements.field_media_image,field_agreements.field_media_image.field_media_image,field_agreements.field_file`
                );

                if (!response.ok) {
                    console.log("Response status:", response.status);
                }

                const data = await response.json();
                const allNodes = parseDrupalMultipleNodes(data, baseUrl);

                // تصفية العقدة الخاصة بالاتفاقيات
                const agreementNode = allNodes.find(
                    (node) => node.field_type_of_files === "ltfqyt"
                );

                if (agreementNode && (agreementNode.agreements || agreementNode.files)) {
                    setFiles(agreementNode.agreements || agreementNode.files);
                }
            } catch (error) {
                console.log("Error fetching agreements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseUrl]);

    // معالجة البحث عند الضغط على زر البحث أو تقديم النموذج
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput.trim());
        setCurrentPage(1);
    };

    // تصفية العناصر بناءً على كلمة البحث (البحث في العنوان أو اسم الدولة)
    const filteredAgreements = files.filter((item) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const titleMatch = (item.title || item.field_title || "").toLowerCase().includes(query);
        const countryMatch = (item.field_country_name || "").toLowerCase().includes(query);
        return titleMatch || countryMatch;
    });

    // حسابات الترقيم (Pagination)
    const totalPages = Math.ceil(filteredAgreements.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentAgreements = filteredAgreements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "مركز المعلومات", link: null },
        { title: "الاتفاقيات", link: null },
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
            loadingType="projects"
        >
            <div className="info-center-container">

                {/* نموذج البحث */}
                <div className="filter-controls-row">
                    <form className="search-form" onSubmit={handleSearchSubmit}>
                        <label htmlFor="agreement-search" className="search-label">
                            الدولة
                        </label>
                        <input
                            id="agreement-search"
                            type="text"
                            className="search-input"
                            placeholder="ابحث عن دولة أو اتفاقية..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button type="submit" className="search-btn">
                            بحث
                        </button>
                    </form>
                </div>

                {/* قائمة الاتفاقيات */}
                <div className="info-items-list">
                    {!loading && currentAgreements.length > 0 ? (
                        currentAgreements.map((item) => {
                            // تحديد مصدر صورة العلم
                            const flagSrc =
                                item.image ||
                                item.field_media_image ||
                                item.field_flag ||
                                "/assets/images/default-flag.png";

                            return (
                                <div key={item.id} className="info-item-card">
                                    <div className="info-item-media">
                                        <img src={flagSrc} alt={item.field_country_name || "علم الدولة"} />
                                    </div>
                                    <div className="info-item-content">
                                        <p className="info-item-title">
                                            {item.title || item.field_title}
                                        </p>

                                        {/* اسم الدولة إذا توفر */}
                                        {item.field_country_name && (
                                            <p className="info-item-country">{item.field_country_name}</p>
                                        )}

                                        {/* رابط التنزيل/العرض */}
                                        {item.file?.url ? (
                                            <a
                                                href={item.file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="item-action-link"
                                                download
                                            >
                                                عرض وتحميل
                                            </a>
                                        ) : (
                                            <a
                                                href={`/info-center/agreements/${item.id}`}
                                                className="item-action-link"
                                            >
                                                عرض وتحميل
                                            </a>
                                        )}
                                    </div>


                                </div>
                            );
                        })
                    ) : !loading ? (
                        <div className="no-results">لا توجد نتائج مطابقة لبحثك</div>
                    ) : null}
                </div>

                {/* عناصر الترقيم السفلي */}
                {!loading && filteredAgreements.length > 0 && (
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

export default Agreements;