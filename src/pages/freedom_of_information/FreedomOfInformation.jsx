import React from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import DrupalWebform from "../../components/drupalWebForm/DrupalWebform";
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
    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "حق الحصول على معلومة", link: null },
    ];

    const today = new Intl.DateTimeFormat("en-GB").format(new Date());

    return (
        <PageLayout pageTitle="حق الحصول على معلومة" breadcrumb={breadcrumb}>
            <div className="foi-form" dir="rtl">
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
                        afterFields={{
                            additional_documents: (
                                <div className="foi-notice" role="note">
                                    <ul className="foi-notice-list">
                                        {FOI_NOTICE_ITEMS.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ),
                        }}
                    />
                </div>
            </div>
        </PageLayout>
    );
}

export default FreedomOfInformation;
