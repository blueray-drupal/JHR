import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "../../layout/page_layout/PageLayout";
import { searchSite } from "../../services/api/siteSearch";
import "./Search.css";

function Search() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [inputValue, setInputValue] = useState(initialQuery);
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(Boolean(initialQuery.trim()));

    useEffect(() => {
        const nextQuery = searchParams.get("q") || "";
        setInputValue(nextQuery);
        setQuery(nextQuery);
    }, [searchParams]);

    useEffect(() => {
        let cancelled = false;

        const runSearch = async () => {
            const term = query.trim();
            if (!term) {
                setResults([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const items = await searchSite(term);
                if (!cancelled) setResults(items);
            } catch (error) {
                console.error("Search error:", error);
                if (!cancelled) setResults([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        runSearch();
        return () => {
            cancelled = true;
        };
    }, [query]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const term = inputValue.trim();
        if (!term) {
            setSearchParams({});
            setQuery("");
            setResults([]);
            return;
        }

        setSearchParams({ q: term });
        setQuery(term);
    };

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "البحث", link: null },
    ];

    return (
        <PageLayout
            pageTitle="البحث"
            breadcrumb={breadcrumb}
            isLoading={false}
            loadingType="content"
        >
            <div className="site-search-page" dir="rtl">
                <form className="site-search-form" onSubmit={handleSubmit}>
                    <label htmlFor="site-search-input" className="site-search-label">
                        ابحث في الموقع
                    </label>
                    <div className="site-search-row">
                        <input
                            id="site-search-input"
                            type="search"
                            className="site-search-input"
                            placeholder="اكتب كلمة البحث..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="site-search-submit">
                            بحث
                        </button>
                    </div>
                </form>

                {loading && (
                    <p className="site-search-status">جاري البحث...</p>
                )}

                {!loading && query.trim() && (
                    <p className="site-search-status">
                        {results.length > 0
                            ? `تم العثور على ${results.length} نتيجة لـ "${query.trim()}"`
                            : `لا توجد نتائج لـ "${query.trim()}"`}
                    </p>
                )}

                {!loading && !query.trim() && (
                    <p className="site-search-status">
                        أدخل كلمة للبحث في صفحات ومحتوى الموقع.
                    </p>
                )}

                {!loading && results.length > 0 && (
                    <ul className="site-search-results">
                        {results.map((item) => (
                            <li key={`${item.id}-${item.path}`} className="site-search-result">
                                <div className="site-search-result-top">
                                    <span className="site-search-badge">{item.badge}</span>
                                    <Link to={item.path} className="site-search-title">
                                        {item.title}
                                    </Link>
                                </div>
                                {item.description && (
                                    <p className="site-search-description">{item.description}</p>
                                )}
                                <button
                                    type="button"
                                    className="site-search-open"
                                    onClick={() => navigate(item.path)}
                                >
                                    عرض النتيجة
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </PageLayout>
    );
}

export default Search;
