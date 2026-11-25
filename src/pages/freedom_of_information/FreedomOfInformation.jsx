import React, { useLayoutEffect, useRef, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import DrupalWebform from "../../components/drupalWebForm/DrupalWebform";
import RecaptchaWidget from "../../components/recaptcha/RecaptchaWidget";
import { useLanguage } from "../../context/LanguageContext";
import "./FreedomOfInformation.css";

const FORM_MESSAGES = {
    loading: "جاري تحميل النموذج...",
    loadError: "تعذر تحميل النموذج، يرجى المحاولة لاحقاً.",
    empty: "لا توجد حقول في هذا النموذج.",
    successTitle: "تم الإرسال بنجاح",
    successText: "تم استلام طلبك للحصول على المعلومات، وسيتم الرد عليك وفق المدة القانونية.",
    errorTitle: "تعذر الإرسال",
    errorGeneric: "حدث خطأ، يرجى المحاولة مرة أخرى.",
    submitting: "جاري الإرسال...",
    submitLabel: "إرسال",
    ok: "حسناً",
    fieldRequired: (title) => `${title} مطلوب`,
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
    invalidUrl: "يرجى إدخال رابط صحيح",
};

const FIELD_ROWS = [
    ["first_name", "father_name"],
    ["grandfather_name", "family_name"],
    ["residence_governorate", "residence_city"],
    ["work_governorate", "work_city"],
    ["phone_number", "fax_number"],
];

const CONSENT_TEXT =
    "أقر بأن المعلومات المذكورة صحيحة والتزم بأن استخدم المعلومات للغرض الذي تم الحصول عليها من أجله وأن أشير إلى مصدر المعلومة التي حصلت عليها والمعلومات الببلوغرافية حسب الأصول العلمية والقانونية المرعية";

const FIELD_OVERRIDES = {
    personal_document: { placeholder: "حمل ملف" },
    additional_documents: { placeholder: "حمل ملف" },
    consent: {
        title: CONSENT_TEXT,
        description: CONSENT_TEXT,
    },
};

const FOI_NOTICE_ITEMS = [
    "ألتزم بأن استخدم المعلومات للغرض الذي تم الحصول عليها من أجله وأن أشير إلى مصدر المعلومة التي حصلت عليها والمعلومات الببليوغرافية وحسب الأصول العلمية والقانونية المرعية",
    "يتم إجابة الطلب أو رفضه خلال ثلاثين يوماً من اليوم التالي لتاريخ تقديم الطلب",
    "يعتبر الامتناع عن الرد ضمن المدة المحددة قراراً بالرفض",
    "في حال عدم حصولك على المعلومة يحق لك تقديم شكوى إلى مجلس المعلومات بواسطة مفوض المعلومات / مدير عام دائرة المكتبة الوطنية",
    "ملاحظة: تأكد من حصولك على الرقم المرجعي",
];

function FreedomOfInformation() {
    const { t, lang } = useLanguage();
    const recaptchaRef = useRef(null);
    const [captchaToken, setCaptchaToken] = useState("");
    const [captchaError, setCaptchaError] = useState("");

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "حق الحصول على معلومة", link: null },
    ];

    const today = new Intl.DateTimeFormat("en-GB").format(new Date());

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token || "");
        if (token) setCaptchaError("");
    };

    const beforeSubmit = async () => {
        if (!captchaToken) {
            setCaptchaError("يرجى تأكيد أنك لست روبوتاً");
            document.querySelector(".foi-recaptcha")?.scrollIntoView({ behavior: "smooth", block: "center" });
            return false;
        }

        return true;
    };

    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, []);

    return (
        <PageLayout pageTitle="حق الحصول على معلومة" breadcrumb={breadcrumb}>
            <div id="foi-form-top" className="foi-form">
                <div className="foi-card">
                    <div className="foi-date-bar">
                        <span className="foi-date-label">تاريخ تقديم الطلب</span>
                        <span className="foi-date-value">{today}</span>
                    </div>

                    <DrupalWebform
                        webformId="right_to_access_information"
                        className="foi-webform"
                        submitLabel="إرسال"
                        fieldRows={FIELD_ROWS}
                        fieldOverrides={FIELD_OVERRIDES}
                        messages={FORM_MESSAGES}
                        beforeSubmit={beforeSubmit}
                        extraData={{ "g-recaptcha-response": captchaToken }}
                        onSuccess={() => recaptchaRef.current?.reset()}
                        afterFields={{
                            additional_documents: (
                                <>
                                    <div className="foi-notice" role="note">
                                        <ul className="foi-notice-list">
                                            {FOI_NOTICE_ITEMS.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <RecaptchaWidget
                                        ref={recaptchaRef}
                                        hl={lang === "en" ? "en" : "ar"}
                                        onChange={handleCaptchaChange}
                                    />
                                    {captchaError ? (
                                        <p className="foi-recaptcha-error" role="alert">{t(captchaError)}</p>
                                    ) : null}
                                </>
                            ),
                        }}
                    />
                </div>
            </div>
        </PageLayout>
    );
}

export default FreedomOfInformation;
