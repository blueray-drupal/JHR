import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function AboutHome() {
    return (
        <section className="about-home-section">
            <div className="about-home-container">

                <div className="about-home-wrapper">
                    <h2 className="about-home-title">نبذة عن المؤسسة</h2>
                    <p className="about-home-body">
                        تأسست مؤسسة خط الحديد الحجازي في بداية القرن العشرين، وتعتبر من أهم المشاريع
                        التاريخية في المنطقة. يمتد الخط من دمشق إلى المدينة المنورة، بطول يزيد عن 1300
                        كيلومتر، وكان يهدف إلى تسهيل رحلة الحج وربط أجزاء الدولة العثمانية.
                    </p>
                    <p className="about-home-body">
                        اليوم، تعمل المؤسسة على الحفاظ على هذا التراث العريق وتطويره ليكون معلماً
                        سياحياً وثقافياً يربط الماضي بالحاضر، مع توفير خدمات متنوعة للزوار والمهتمين
                        بالتاريخ.
                    </p>
                    <Link to="/about" className="about-home-btn">
                        اقرأ المزيد
                    </Link>
                </div>
                <div className="about-image">
                    <img src="../../../assets/about.png" alt="نبذة عن المؤسسة - محطة عمان" />
                </div>
            </div>
        </section>
    );
}

export default AboutHome;