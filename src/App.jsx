import { useLayoutEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from './layout/header/Header';
import Footer from './layout/footer/Footer';
import PageRating from './components/pageRating/PageRating';
import Home from './pages/home/Home';
import Conferences from './pages/media_center/Conferences';
import News from './pages/media_center/News';
import NewsDetails from './pages/media_center/NewsDetails';
import Events from './pages/media_center/Events';
import EventsDetails from './pages/media_center/EventsDetails';
import ConferencesDetails from './pages/media_center/ConferencesDetails';
import Gallery from './pages/media_center/Gallery';
import GalleryDetails from './pages/media_center/GalleryDetails';
import TripsService from './pages/services/TripsService';
import VenueBooking from './pages/services/VenueBooking';
import CargoService from './pages/services/CargoService';
import InvestmentServices from './pages/services/InvestmentServices';
import Museum from './pages/services/Museum';
import Job from './pages/job/Job';
import JobDetails from './pages/job/JobDetails';
import Complaints from './pages/complaints/Complaints';
import BasicPage from './pages/basic_page/BasicPage';
import Agreements from './pages/info_center/Agreements';
import Projects from './pages/info_center/Projects';
import ProjectDetails from './pages/info_center/ProjectDetails';
import Budget from './pages/info_center/Budget';
import AnnualReports from './pages/info_center/AnnualReports';
import Laws from "./pages/legislations/Laws";
import Regulations from "./pages/legislations/Regulations";
import './main.css';
import ContactUs from './pages/contact_us/ContactUs';
import SiteMap from './pages/sitemap/SiteMap';
import UsefulLinks from './pages/useful_links/UsefulLinks';
import Faq from './pages/faq/Faq';
import AboutOverview from './pages/about/AboutOverview';
import WelcomingRemark from './pages/about/WelcomingRemark';
import BoardOfDirectors from './pages/about/BoardOfDirectors';
import OrganizationalStructure from './pages/about/OrganizationalStructure';
import DirectorsGeneral from './pages/about/DirectorsGeneral';
import FreedomOfInformation from './pages/freedom_of_information/FreedomOfInformation';
import Tenders from './pages/tenders/Tenders';
import TenderDetails from './pages/tenders/TenderDetails';
import Search from './pages/search/Search';
import Stations from './pages/stations/Stations';
import StationDetails from './pages/stations/StationDetails';
import CodeOfConduct from './pages/code_of_conduct/CodeOfConduct';
import { SitePreferencesProvider } from './context/SitePreferencesContext';
import AccessibilityWidget from './components/accessibilityWidget/AccessibilityWidget';

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <SitePreferencesProvider>
      <div className="app-wrapper">
        <ScrollToTop />
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutOverview />} />
          <Route path="/welcome-speech" element={<WelcomingRemark />} />
          <Route path="/board-directors" element={<BoardOfDirectors />} />
          <Route path="/organization-chart" element={<OrganizationalStructure />} />
          <Route path="/general-managers" element={<DirectorsGeneral />} />
          <Route path="/conferences" element={<Conferences />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetails />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventsDetails />} />
          <Route path="/conferences/:id" element={<ConferencesDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<GalleryDetails />} />
          <Route path="/services" element={<Navigate to="/services/trips" replace />} />
          <Route path="/services/trips" element={<TripsService />} />
          <Route path="/services/venue-booking" element={<VenueBooking />} />
          <Route path="/services/museum" element={<Museum />} />
          <Route path="/services/cargo" element={<CargoService />} />
          <Route path="/services/investment" element={<InvestmentServices />} />
          <Route path="/jobs" element={<Job />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/tenders" element={<Tenders />} />
          <Route path="/tenders/:id" element={<TenderDetails />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/info-center/agreements" element={<Agreements />} />
          <Route path="/info-center/projects" element={<Projects />} />
          <Route path="/info-center/projects/:id" element={<ProjectDetails />} />
          <Route path="/info-center/budget" element={<Budget />} />
          <Route path="/info-center/annual-reports" element={<AnnualReports />} />
          <Route path="/legislations/laws" element={<Laws />} />
          <Route path="/legislations/regulations" element={<Regulations />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/sitemap" element={<SiteMap />} />
          <Route path="/useful-links" element={<UsefulLinks />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/freedom-of-information" element={<FreedomOfInformation />} />
          <Route path="/stations" element={<Stations />} />
          <Route path="/stations/:id" element={<StationDetails />} />
          <Route path="/code-of-conduct" element={<CodeOfConduct />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<BasicPage />} />
        </Routes>

        <PageRating />
        <Footer />
        <AccessibilityWidget />
      </div>
    </SitePreferencesProvider>
  );
}

export default App;
