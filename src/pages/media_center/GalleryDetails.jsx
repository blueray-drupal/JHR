import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import PageLayout from "../../layout/page_layout/PageLayout";
import "./Gallery.css";

function GalleryDetails() {
    const { id } = useParams();
    const location = useLocation();

    // استقبال بيانات الألبوم المحدد من الـ state
    const album = location.state?.albumData || {
        title: "معرض صور محطة عمان الكبرى",
        images: Array(8).fill("../../../assets/slider.png") // Fallback في حال التحديث المباشر
    };
    console.log(album)
    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "المركز الإعلامي", link: "/media-center" },
        // { title: "ألبوم الصور", link: "/gallery" },
        { title: album.title, link: null },
    ];

    const sidebarMenu = [
        { id: 1, title: "الأخبار", link: "/news" },
        { id: 2, title: "ألبوم الصور", link: "/gallery" },
        { id: 3, title: "الفعاليات", link: "/events" },
        { id: 4, title: "المؤتمرات", link: "/conferences" },
    ];

    return (
        <PageLayout
            pageTitle="المركز الإعلامي"
            breadcrumb={breadcrumb}
            sidebarTitle="المركز الإعلامي"
            sidebarItems={sidebarMenu}
        >


            <h3 className="album-details-title">{album.title}</h3>

            <div className="images-grid">
                {album.field_media_gallery && album.field_media_gallery.map((imgSrc, index) => (
                    <div key={index} className="gallery-image-card">
                        <img src={imgSrc} alt={`${album.title} - صورة ${index + 1}`} />
                    </div>
                ))}
            </div>
        </PageLayout>
    );
}

export default GalleryDetails;