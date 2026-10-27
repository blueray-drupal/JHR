import React, { useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import DrupalWebform from "../../components/drupalWebForm/DrupalWebform";
import { parseDrupalSingleNode } from "../../utils/drupalParser";
import { fetchFooterData } from "../../services/api/footerApi";
import "./ContactUs.css";
import { drupalBaseUrl } from '../../services/api/drupalUrl';
import facebookIcon from "../../../assets/contact-facebook.png";
import instagramIcon from "../../../assets/contact-instagram.png";
import youtubeIcon from "../../../assets/contact-youtube.png";

const SOCIAL_DEFAULTS = [
    {
        id: "facebook",
        title: "Facebook",
        className: "fb",
        icon: facebookIcon,
        link: "https://www.facebook.com/JordanHejazRailay/",
        match: /facebook\.com/i,
    },
    {
        id: "instagram",
        title: "Instagram",
        className: "ig",
        icon: instagramIcon,
        link: "#",
        match: /instagram\.com/i,
    },
    {
        id: "youtube",
        title: "YouTube",
        className: "yt",
        icon: youtubeIcon,
        link: "https://www.youtube.com/channel/UCe1TR5Upmef5FYdDaLkq9xw",
        match: /youtube\.com/i,
    },
];

const mergeSocialLinks = (footerSocial = []) =>
    SOCIAL_DEFAULTS.map((social) => {
        const matches = footerSocial.filter(
            (item) =>
                social.match.test(item.link || "") ||
                social.match.test(item.title || "")
        );
        const fromContent =
            matches.find((item) => /\/channel\//i.test(item.link || "")) || matches[0];

        return {
            ...social,
            link: fromContent?.link && fromContent.link !== "#" ? fromContent.link : social.link,
        };
    });

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
    const baseUrl = drupalBaseUrl;
    const [page, setPage] = useState(null);
    const [socialLinks, setSocialLinks] = useState(SOCIAL_DEFAULTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [response, footerData] = await Promise.all([
                    fetch(
                        `${baseUrl}/jsonapi/node/contact_us?include=field_contact_info,field_contact_info.field_media_image,field_contact_info.field_media_image.field_media_image,field_sub_numbers`
                    ),
                    fetchFooterData().catch(() => null),
                ]);

                if (!response.ok) {
                    console.log(response.status);
                }

                const data = await response.json();
                const node = Array.isArray(data.data) ? { ...data, data: data.data[0] } : data;
                setPage(parseDrupalSingleNode(node, baseUrl));

                if (footerData?.socialIcons?.length) {
                    setSocialLinks(mergeSocialLinks(footerData.socialIcons));
                }
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
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.id}
                                        href={social.link || "#"}
                                        className={`social-btn ${social.className}`}
                                        title={social.title}
                                        target={social.link && social.link !== "#" ? "_blank" : undefined}
                                        rel={social.link && social.link !== "#" ? "noreferrer" : undefined}
                                    >
                                        <img src={social.icon} alt={social.title} className="social-btn-icon" />
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
