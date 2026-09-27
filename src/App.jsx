import { Routes, Route } from "react-router-dom";
import Header from './layout/header/Header';
import Footer from './layout/footer/Footer';
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
import { SitePreferencesProvider } from './context/SitePreferencesContext';

function App() {
  return (
    <SitePreferencesProvider>
      <div className="app-wrapper">
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
          <Route path="/info-center/budget" element={<Budget />} />
          <Route path="/info-center/annual-reports" element={<AnnualReports />} />
          <Route path="/legislations/laws" element={<Laws />} />
          <Route path="/legislations/regulations" element={<Regulations />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/sitemap" element={<SiteMap />} />
          <Route path="/useful-links" element={<UsefulLinks />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/freedom-of-information" element={<FreedomOfInformation />} />
          <Route path="*" element={<BasicPage />} />
        </Routes>

        <Footer />
      </div>
    </SitePreferencesProvider>
  );
}

export default App;
