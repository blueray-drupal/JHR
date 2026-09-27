import React, { useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import DrupalWebform from "../../components/drupalWebForm/DrupalWebform";
import { parseDrupalSingleNode } from "../../utils/drupalParser";
import "./ContactUs.css";

// روابط التواصل الاجتماعي ثابتة حالياً لحين ربطها بالقائمة
const SOCIAL_LINKS = [
    { id: 1, title: "YouTube", icon: "fa-brands fa-youtube", className: "yt", link: "#" },
    { id: 2, title: "Instagram", icon: "fa-brands fa-instagram", className: "ig", link: "#" },
    { id: 3, title: "Facebook", icon: "fa-brands fa-facebook-f", className: "fb", link: "#" },
];

const FORM_MESSAGES = {
    loading: "جاري تحميل النموذج...",
    loadError: "تعذر تحميل النموذج، يرجى المحاولة لاحقاً.",
    empty: "لا توجد حقول في هذا النموذج.",
    successTitle: "تم الإرسال بنجاح",
    successText: "شكراً لتواصلك معنا، سيتم الرد عليك في أقرب وقت.",
    errorTitle: "تعذر الإرسال",
    errorGeneric: "حدث خطأ، يرجى المحاولة مرة أخرى.",
    submitting: "جاري الإرسال...",
    submitLabel: "إرسال",
    ok: "حسناً",
    fieldRequired: (title) => `${title} مطلوب`,
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
    invalidUrl: "يرجى إدخال رابط صحيح",
};

const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, "").trim();

function ContactUs() {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${baseUrl}/jsonapi/node/contact_us?include=field_contact_info,field_contact_info.field_media_image,field_contact_info.field_media_image.field_media_image,field_sub_numbers`
                );

                if (!response.ok) {
                    console.log(response.status);
                }

                const data = await response.json();
                setPage(parseDrupalSingleNode(data, baseUrl));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseUrl]);

    const map = page?.field_body1?.processed || page?.field_body1?.value || "";
    const contactInfo = page?.paragraphs?.field_contact_info || [];
    const subNumbers = page?.paragraphs?.field_sub_numbers || [];

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "اتصل بنا", link: null },
    ];

    return (
        <PageLayout
            pageTitle="اتصل بنا"
            breadcrumb={breadcrumb}
            isLoading={loading}
            loadingType="form"
        >
            <div className="contact-us-container">

                {/* الخريطة */}
                {map && (
                    <div
                        className="map-wrapper"
                        dangerouslySetInnerHTML={{ __html: map }}
                    />
                )}

                <div className="contact-main-section">

                    {/* معلومات الاتصال */}
                    <div className="contact-info-container">
                        <h2 className="info-header-title">معلومات الاتصال</h2>
                        <ul className="info-list">
                            {contactInfo.map((item) => (
                                <li key={item.id}>
                                    {item.image && (
                                        <span className="info-icon">
                                            <img src={item.image} alt="" />
                                        </span>
                                    )}
                                    <span>{item.title}: {stripHtml(item.body)}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="social-media-block">
                            <h3>مواقع التواصل الاجتماعي:</h3>
                            <div className="social-icons">
                                {SOCIAL_LINKS.map((social) => (
                                    <a
                                        key={social.id}
                                        href={social.link}
                                        className={`social-btn ${social.className}`}
                                        title={social.title}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <i className={social.icon}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* نموذج التواصل - Drupal Webform */}
                    <div className="contact-form-container">
                        <DrupalWebform
                            webformId="contact_us"
                            className="contact-webform"
                            submitLabel="إرسال"
                            messages={FORM_MESSAGES}
                        />
                    </div>

                </div>

                {/* الأرقام الفرعية */}
                {subNumbers.length > 0 && (
                    <div className="extensions-section">
                        <div className="extensions-header">
                            للمزيد من المعلومات يرجى التواصل على الأرقام التالية
                        </div>
                        <div className="extensions-content">
                            <h3 className="sub-header-title">الأرقام الفرعية</h3>
                            <div className="extensions-grid">
                                {subNumbers.map((item) => (
                                    <div key={item.id} className="ext-box">
                                        {item.title} {stripHtml(item.body)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </PageLayout>
    );
}

export default ContactUs;
