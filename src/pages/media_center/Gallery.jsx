import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from "../../layout/page_layout/PageLayout";
import "./Gallery.css";
import { parseDrupalMultipleNodes } from '../../utils/drupalParser';
import { drupalBaseUrl } from '../../services/api/drupalUrl';

function Gallery() {
    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "المركز الإعلامي", link: null },
        { title: "ألبوم الصور", link: null },
    ];

    const sidebarMenu = [
        { id: 1, title: "الأخبار", link: "/news" },
        { id: 2, title: "ألبوم الصور", link: "/gallery" },
        { id: 3, title: "الفعاليات", link: "/events" },
        { id: 4, title: "المؤتمرات", link: "/conferences" },
    ];


    // البيانات القادمة من الـ API / JSON
    const albumsList = [
        {
            id: 1,
            title: "معرض صور محطة عمان الكبرى",
            image: "../../../assets/slider.png",
            images: [
                "../../../assets/slider.png",
                "../../../assets/slider.png",
                "../../../assets/slider.png",
                "../../../assets/slider.png",
                "../../../assets/slider.png",
                "../../../assets/slider.png",
                "../../../assets/slider.png",
                "../../../assets/slider.png"
            ]
        },
        {
            id: 2,
            title: "رحلات الخط الحجازي 2025",
            image: "../../../assets/slider.png",
            images: [
                "../../../assets/slider.png",
                "../../../assets/slider.png"
            ]
        }
    ];


    const baseUrl = drupalBaseUrl;


    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/jsonapi/node/photo_gallery?include=field_media_gallery,field_media_gallery.field_media_image`);
                if (!response.ok) {
                    console.log(response.status)
                }

                const data = await response.json()
                const allFiles = parseDrupalMultipleNodes(data, baseUrl)



                setImages(allFiles);
                console.log(allFiles)



            }
            catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])

    return (
        <PageLayout
            pageTitle="المركز الإعلامي"
            breadcrumb={breadcrumb}
            sidebarTitle="المركز الإعلامي"
            sidebarItems={sidebarMenu}
            isLoading={loading}
            loadingType="gallery"
        >

            <div className="albums-grid">
                {images.map((album) => {
                    const photos = Array.isArray(album.field_media_gallery)
                        ? album.field_media_gallery
                        : [];
                    const cover = photos[0] || album.image;

                    return (
                    <Link
                        to={`/gallery/${album.id}`}
                        state={{ albumData: album }}
                        key={album.id}
                        className="album-card"
                    >
                        <div className="album-image-wrapper">
                            {cover && <img src={cover} alt={album.title} className="album-image" />}
                        </div>
                        <div className="album-info">
                            <h3 className="album-title">{album.title}</h3>
                            <span className="album-count">📷 {photos.length} صورة</span>
                        </div>
                    </Link>
                    );
                })}
            </div>
        </PageLayout>
    );
}

export default Gallery;