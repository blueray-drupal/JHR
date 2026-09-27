import React, { useRef, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import "./FreedomOfInformation.css";

const APPLICANT_TYPES = [
    { value: "legal", label: "شخص اعتباري" },
    { value: "natural", label: "شخص طبيعي" },
];

const PERSON_TYPES = [
    { value: "researcher", label: "باحث علمي" },
    { value: "student", label: "طالب" },
    { value: "other", label: "أخرى" },
];

const PURPOSES = [
    { value: "research", label: "البحث العلمي" },
    { value: "decision", label: "اتخاذ قرار" },
    { value: "other", label: "أخرى" },
];

const DELIVERY_METHODS = [
    { value: "in_person", label: "تسلمها بنفسي" },
    { value: "mail", label: "بريد مسجل" },
    { value: "email", label: "البريد الإلكتروني" },
];

const TERMS = [
    "أن تكون المعلومات المطلوبة غير مستثناة من الإفصاح بموجب أحكام قانون ضمان حق الحصول على المعلومات أو أي تشريع آخر نافذ المفعول.",
    "أن يكون طالب المعلومة ذا مصلحة مشروعة أو سبب مبرر في طلب المعلومة.",
    "أن يقدم الطلب على النموذج المعتمد وأن يتضمن جميع البيانات المطلوبة.",
    "أن يتم الرد على الطلب خلال المدة القانونية المحددة في القانون.",
    "أن يلتزم مقدم الطلب بعدم استخدام المعلومات لغير الغاية التي طُلبت من أجلها.",
];

const FILE_HINT = "الملفات المسموح بها: pdf, doc, docx, jpg, jpeg, png — الحد الأعلى لحجم الملف 2 ميغابايت.";

const UploadIcon = () => (
    <svg className="foi-upload-icon" width="26" height="26" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
);

const RefreshIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 4v5h-5" />
    </svg>
);

/**
 * Upload box shared by the identity proof and the extra documents fields.
 * Keeps the dashed drop-zone markup in one place instead of duplicating it.
 */
const UploadBox = ({ id, name, accept, multiple }) => {
    const inputRef = useRef(null);
    const [fileNames, setFileNames] = useState([]);

    const handleChange = (event) => {
        setFileNames(Array.from(event.target.files || []).map((file) => file.name));
    };

    return (
        <div className="foi-upload">
            <UploadIcon />
            <input
                ref={inputRef}
                id={id}
                name={name}
                type="file"
                accept={accept}
                multiple={multiple}
                className="foi-upload-input"
                onChange={handleChange}
            />
            <button type="button" className="foi-upload-btn" onClick={() => inputRef.current?.click()}>
                انقر هنا
            </button>
            {fileNames.length > 0 && (
                <ul className="foi-upload-files">
                    {fileNames.map((fileName) => (
                        <li key={fileName}>{fileName}</li>
                    ))}
                </ul>
            )}
            <p className="foi-upload-hint">{FILE_HINT}</p>
        </div>
    );
};

const RadioGroup = ({ name, options, defaultValue }) => (
    <div className="foi-radios">
        {options.map((option) => (
            <label key={option.value} className="foi-radio-label">
                <input
                    type="radio"
                    name={name}
                    value={option.value}
                    defaultChecked={option.value === defaultValue}
                    className="foi-radio"
                />
                <span>{option.label}</span>
            </label>
        ))}
    </div>
);

function FreedomOfInformation() {
    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "حق الحصول على معلومة", link: null },
    ];

    const today = new Intl.DateTimeFormat("en-GB").format(new Date());

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <PageLayout pageTitle="حق الحصول على معلومة" breadcrumb={breadcrumb}>
            <form className="foi-form" dir="rtl" onSubmit={handleSubmit} noValidate>
                <div className="foi-card">
                    <div className="foi-date-bar">
                        <span className="foi-date-label">تاريخ تقديم الطلب</span>
                        <span className="foi-date-value">{today}</span>
                    </div>

                    <section className="foi-section">
                        <h3 className="foi-section-title">فئة مقدم الطلب</h3>
                        <RadioGroup name="applicant_type" options={APPLICANT_TYPES} defaultValue="natural" />
                    </section>

                    <section className="foi-section">
                        <h3 className="foi-section-title">
                            القسم الرئيسي <span className="foi-required-note">الحقول الإلزامية</span>
                        </h3>

                        <div className="foi-grid foi-grid--2">
                            <div className="foi-field">
                                <label className="foi-label" htmlFor="foi-first-name">الاسم الأول</label>
                                <input id="foi-first-name" name="first_name" type="text" className="foi-input" placeholder="الاسم الأول" />
                            </div>
                            <div className="foi-field">
                                <label className="foi-label" htmlFor="foi-father-name">اسم الأب</label>
                                <input id="foi-father-name" name="father_name" type="text" className="foi-input" placeholder="اسم الأب" />
                            </div>
                            <div className="foi-field">
                                <label className="foi-label" htmlFor="foi-grandfather-name">اسم الجد</label>
                                <input id="foi-grandfather-name" name="grandfather_name" type="text" className="foi-input" placeholder="اسم الجد" />
                            </div>
                            <div className="foi-field">
                                <label className="foi-label" htmlFor="foi-family-name">اسم العائلة</label>
                                <input id="foi-family-name" name="family_name" type="text" className="foi-input" placeholder="اسم العائلة" />
                            </div>
                        </div>

                        <div className="foi-field">
                            <label className="foi-label" htmlFor="foi-national-id">
                                الرقم الوطني <span className="foi-required-note">الحقل إلزامي</span>
                            </label>
                            <input id="foi-national-id" name="national_id" type="text" inputMode="numeric" className="foi-input foi-input--ltr" placeholder="الرقم الوطني" />
                        </div>
                    </section>

                    <section className="foi-section">
                        <h3 className="foi-section-title">
                            صورة عن إثبات الشخصية (صورة الهوية أو جواز السفر)
                            <span className="foi-required-note">الحقل إلزامي</span>
                        </h3>
                        <UploadBox id="foi-identity-file" name="identity_file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                    </section>

                    <section className="foi-section">
                        <h3 className="foi-section-title">مكان الإقامة</h3>
                        <div className="foi-grid foi-grid--3">
                            <div className="foi-field">
                                <label className="foi-label" htmlFor="foi-home-governorate">المحافظة</label>
                                <input id="foi-home-governorate" name="home_governorate" type="text" className="foi-input" placeholder="المحافظة" />
                            </div>
                            <div className="foi-field">
                                <label className="foi-label" htmlFor="foi-home-city">المدينة</label>
                                <input id="foi-home-city" name="home_city" type="text" className="foi-input" placeholder="المدينة" />
                            </div>
                            <div className="foi-field">
                                <label className="foi-label" htmlFor="foi-home-village">القرية</label>
                                <input id="foi-home-village" name="home_village" type="text" className="foi-input" placeholder="القرية" />
                            </div>
                        </div>
                    </section>

                    <section className="foi-section">
                        <h3 className="foi-section-title">مكان العمل</h3>
                        <div className="foi-grid foi-grid--3">
                            <div className="foi-field">
                                <label className="foi-label" htmlFor="foi-work-governorate">المحافظة</label>
                                <input id="foi-work-governorate" name="work_governorate" type="text" className="foi-input" placeholder="المحافظة" />
                            </div>
                            <div className="foi-field">
                                <label className="foi-label" htmlFor="foi-work-city">المدينة</label>
                                <input id="foi-work-city" name="work_city" type="text" className="foi-input" placeholder="المدينة" />
                            </div>
                            <div className="foi-field">
                                <label className="foi-label" htmlFor="foi-work-village">القرية</label>
                                <input id="foi-work-village" name="work_village" type="text" className="foi-input" placeholder="القرية" />
                            </div>
                        </div>
                    </section>

                    <div className="foi-field">
                        <label className="foi-label" htmlFor="foi-landline">
                            رقم الهاتف الأرضي <span className="foi-required-note">الحقل إلزامي</span>
                        </label>
                        <input id="foi-landline" name="landline" type="tel" className="foi-input foi-input--ltr" placeholder="رقم الهاتف الأرضي" />
                    </div>

                    <div className="foi-field">
                        <label className="foi-label" htmlFor="foi-fax">رقم الفاكس</label>
                        <input id="foi-fax" name="fax" type="tel" className="foi-input foi-input--ltr" placeholder="رقم الفاكس" />
                    </div>

                    <div className="foi-field">
                        <label className="foi-label" htmlFor="foi-po-box">صندوق البريد ومنطقته</label>
                        <input id="foi-po-box" name="po_box" type="text" className="foi-input" placeholder="صندوق البريد ومنطقته" />
                    </div>

                    <div className="foi-field">
                        <label className="foi-label" htmlFor="foi-email">
                            البريد الإلكتروني <span className="foi-required-note">الحقل إلزامي</span>
                        </label>
                        <input id="foi-email" name="email" type="email" className="foi-input foi-input--ltr" placeholder="البريد الإلكتروني" />
                    </div>

                    <fieldset className="foi-fieldset">
                        <legend className="foi-section-title">نوع الشخصية</legend>
                        <RadioGroup name="person_type" options={PERSON_TYPES} />
                    </fieldset>

                    <fieldset className="foi-fieldset">
                        <legend className="foi-section-title">الغرض من الحصول على المعلومات</legend>
                        <RadioGroup name="purpose" options={PURPOSES} />
                    </fieldset>

                    <fieldset className="foi-fieldset">
                        <legend className="foi-section-title">طريقة إرسال المعلومات المطلوبة</legend>
                        <RadioGroup name="delivery_method" options={DELIVERY_METHODS} />
                    </fieldset>

                    <div className="foi-field">
                        <label className="foi-label" htmlFor="foi-subject">
                            موضوع المعلومات <span className="foi-required-note">الحقل إلزامي</span>
                        </label>
                        <textarea id="foi-subject" name="subject" className="foi-textarea" placeholder="موضوع المعلومات" rows={3} />
                    </div>

                    <section className="foi-section">
                        <h3 className="foi-section-title">وثائق إضافية</h3>
                        <UploadBox id="foi-extra-files" name="extra_files" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple />
                    </section>

                    <div className="foi-notice">
                        <ul className="foi-notice-list">
                            {TERMS.map((term) => (
                                <li key={term}>{term}</li>
                            ))}
                        </ul>
                    </div>

                    <label className="foi-consent">
                        <input type="checkbox" name="terms_agreement" className="foi-checkbox" />
                        <span>
                            أقر بأن المعلومات المذكورة صحيحة وأتعهد بعدم استخدام المعلومات لغير الغاية التي طُلبت من أجلها،
                            وأتحمل كامل المسؤولية القانونية المترتبة على ذلك.
                            <strong className="foi-consent-strong"> أوافق</strong>
                        </span>
                    </label>

                    <label className="foi-consent">
                        <input type="checkbox" name="electronic_delivery" className="foi-checkbox" />
                        <span>
                            الموظف المسؤول عن استقبال طلبات الحصول على المعلومات غير ملزم بإعطائي ما يخالف التشريعات النافذة،
                            وأوافق على تزويدي بالمعلومات عبر البريد الإلكتروني.
                        </span>
                    </label>

                    <div className="foi-captcha">
                        <span className="foi-captcha-label">أدخل رمز التحقق</span>
                        <div className="foi-captcha-box">
                            <span className="foi-captcha-code">PVDP</span>
                            <button type="button" className="foi-captcha-refresh" aria-label="تحديث رمز التحقق">
                                <RefreshIcon />
                            </button>
                        </div>
                        <input name="captcha" type="text" className="foi-input foi-captcha-input" aria-label="رمز التحقق" />
                    </div>

                    <div className="foi-actions">
                        <button type="submit" className="foi-submit">إرسال</button>
                    </div>
                </div>
            </form>
        </PageLayout>
    );
}

export default FreedomOfInformation;
