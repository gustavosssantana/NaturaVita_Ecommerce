import AnnouncementBar from '../components/layout/AnnouncementBar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import WeeklyOffers from '../components/sections/WeeklyOffers';
import CategoryGrid from '../components/sections/CategoryGrid';
import BestSellers from '../components/sections/BestSellers';
import ProductHighlight from '../components/sections/ProductHighlight';
import NewsletterSection from '../components/sections/NewsletterSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoryGrid />
        <BestSellers />
        <WeeklyOffers />
        <ProductHighlight />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
