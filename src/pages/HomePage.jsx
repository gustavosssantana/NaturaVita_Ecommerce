import AnnouncementBar from '../components/layout/AnnouncementBar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import CategoryGrid from '../components/sections/CategoryGrid';
import BestSellers from '../components/sections/BestSellers';
import WeeklyOffers from '../components/sections/WeeklyOffers';
import ProductHighlight from '../components/sections/ProductHighlight';
import TrustSection from '../components/sections/TrustSection';
import CartToast from '../components/ui/CartToast';
import CatalogError from '../components/ui/CatalogError';

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <CatalogError />
        <HeroSection />
        <CategoryGrid />
        <BestSellers />
        <WeeklyOffers />
        <ProductHighlight />
        <TrustSection />
      </main>
      <Footer />
      <CartToast />
    </>
  );
}
