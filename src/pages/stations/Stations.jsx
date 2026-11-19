import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../layout/page_layout/PageLayout';
import {
  fetchStations,
  STATIONS_MAP_BG,
  STATIONS_MARKER_IMG,
} from '../../services/api/stationsApi';
import './Stations.css';

function Stations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBranch, setActiveBranch] = useState(1);
  const detailPanelRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const items = await fetchStations();
        if (cancelled) return;
        setStations(items);
        if (items.length) {
          setActiveBranch(items[0].branch);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setStations([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeStation = useMemo(
    () => stations.find((item) => item.branch === activeBranch) || stations[0] || null,
    [stations, activeBranch]
  );

  useEffect(() => {
    if (detailPanelRef.current) {
      detailPanelRef.current.scrollTop = 0;
    }
  }, [activeStation?.id]);

  const breadcrumb = [
    { title: 'الرئيسية', link: '/' },
    { title: 'المحطات', link: null },
  ];

  return (
    <PageLayout
      pageTitle="المحطات"
      breadcrumb={breadcrumb}
      isLoading={loading}
      loadingType="content"
    >
      {!loading && stations.length === 0 && (
        <p className="stations-empty">لا توجد محطات متاحة حالياً.</p>
      )}

      {!loading && stations.length > 0 && (
        <div
          className="stations-page"
          style={{ backgroundImage: `url(${STATIONS_MAP_BG})` }}
        >
          <div className="stations-map">
            <ul className="stations-markers">
              {stations.map((station) => {
                if (!station.position) return null;
                const style = {};
                if (station.position.top != null) style.top = `${station.position.top}px`;
                if (station.position.bottom != null) {
                  style.bottom = `${station.position.bottom}px`;
                }
                if (station.position.left != null) style.left = `${station.position.left}px`;

                return (
                  <li
                    key={station.id}
                    className={`stations-marker${
                      activeStation?.id === station.id ? ' is-active' : ''
                    }`}
                    style={style}
                  >
                    <button
                      type="button"
                      className="stations-marker-btn"
                      style={{ backgroundImage: `url(${STATIONS_MARKER_IMG})` }}
                      aria-label={station.title}
                      aria-pressed={activeStation?.id === station.id}
                      onClick={() => setActiveBranch(station.branch)}
                    >
                      <span>{station.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {activeStation && (
            <aside ref={detailPanelRef} className="stations-detail-panel">
              <h2 className="stations-detail-title">{activeStation.title}</h2>
              <div
                className="stations-detail-body"
                dangerouslySetInnerHTML={{ __html: activeStation.body }}
              />

              {activeStation.images.length > 0 && (
                <div className="stations-detail-gallery">
                  {activeStation.images.map((image) => (
                    <img key={image.id} src={image.src} alt={image.alt || activeStation.title} />
                  ))}
                </div>
              )}

              <Link to={`/stations/${activeStation.id}`} className="stations-detail-link">
                عرض تفاصيل المحطة
              </Link>
            </aside>
          )}
        </div>
      )}
    </PageLayout>
  );
}

export default Stations;
