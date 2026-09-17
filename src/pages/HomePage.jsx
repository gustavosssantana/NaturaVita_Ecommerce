import AnnouncementBar from '../components/layout/AnnouncementBar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroCarousel from '../components/sections/HeroCarousel';
import CategoryGrid from '../components/sections/CategoryGrid';
import ProductRail from '../components/sections/ProductRail';
import TrustSection from '../components/sections/TrustSection';
import CartToast from '../components/ui/CartToast';
import CatalogError from '../components/ui/CatalogError';
import { useCatalog } from '../data/CatalogContext';

export default function HomePage() {
  const { weeklyOffers, bestSellers, loading, categories, productsIn } = useCatalog();

  // Uma terceira fileira, da maior categoria — dá profundidade à home sem
  // inventar seção que o catálogo não sustenta.
  const maior = categories[0];
  const daMaior = maior ? productsIn(maior.slug).filter((p) => p.image).slice(0, 14) : [];

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <CatalogError />
        <HeroCarousel />
        <CategoryGrid />
        <ProductRail
          titulo="Ofertas da"
          destaque="semana."
          produtos={weeklyOffers}
          carregando={loading}
        />
        <ProductRail
          titulo="Mais"
          destaque="procurados."
          produtos={bestSellers}
          carregando={loading}
        />
        {maior && (
          <ProductRail
            titulo="Destaques em"
            destaque={`${maior.name.toLowerCase()}.`}
            href={`/${maior.slug}`}
            produtos={daMaior}
          />
        )}
        <TrustSection />
      </main>
      <Footer />
      <CartToast />
    </>
  );
}
