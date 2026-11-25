import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../../layout/page_layout/PageLayout';
import { fetchStationById } from '../../services/api/stationsApi';
import './Stations.css';
import { useLanguage } from '../../context/LanguageContext';

function StationDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const item = await fetchStationById(id);
        if (cancelled) return;
        setStation(item);
        if (!item) setError('المحطة غير موجودة.');
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setStation(null);
          setError('تعذر تحميل بيانات المحطة.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const breadcrumb = [
    { title: 'الرئيسية', link: '/' },
    { title: 'المحطات', link: '/stations' },
    { title: station?.title || 'تفاصيل المحطة', link: null },
  ];

  return (
    <PageLayout
      pageTitle="المحطات"
      breadcrumb={breadcrumb}
      isLoading={loading}
      loadingType="detail"
    >
      {!loading && error && <p className="stations-empty">{error}</p>}

      {!loading && station && (
        <article className="station-details">
          <div className="station-details-header">
            <h2 className="station-details-title">{station.title}</h2>
            <Link to="/stations" className="stations-detail-link stations-back-link">
              {t("العودة إلى الخريطة")}
            </Link>
          </div>

          <div
            className="stations-detail-body"
            dangerouslySetInnerHTML={{ __html: station.body }}
          />

          {station.images.length > 0 && (
            <div className="station-details-gallery">
              {station.images.map((image) => (
                <img key={image.id} src={image.src} alt={image.alt || station.title} />
              ))}
            </div>
          )}
        </article>
      )}
    </PageLayout>
  );
}

export default StationDetails;
