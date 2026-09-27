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
    ["residence_city", "residence_district"],
    ["work_governorate", "work_city"],
    ["work_city", "work_district"],
    ["phone_number", "fax_number"],
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
                        messages={FORM_MESSAGES}
                    />
                </div>
            </div>
        </PageLayout>
    );
}

export default FreedomOfInformation;
