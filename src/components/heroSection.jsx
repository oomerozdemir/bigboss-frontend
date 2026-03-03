import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL;

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  // --- Dynamic data ---
  const [slides, setSlides] = useState([]);
  const [content, setContent] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/hero/slides`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/hero/content`).then(r => r.json()).catch(() => ({})),
    ]).then(([slidesData, contentData]) => {
      if (Array.isArray(slidesData) && slidesData.length > 0) setSlides(slidesData);
      setContent(contentData);
    });
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (slides.length <= 1) return;
    if (isPaused) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [slides.length, isPaused]);

  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Content with dynamic fallbacks
  const promoTitle1    = content.promo_title1     || t('hero.discount_title1');
  const promoTitle2    = content.promo_title2     || t('hero.discount_title2');
  const promoTitle3    = content.promo_title3     || t('hero.discount_title3');
  const promoSubtitle  = content.promo_subtitle   || t('hero.discount_valid');
  const promoBtnText   = content.promo_button_text|| t('hero.discount_cta');
  const promoBtnLink   = content.promo_button_link|| '/products?discount=true';
  const cat1Label      = content.cat1_label       || t('hero.category_jackets');
  const cat1Link       = content.cat1_link        || '/products?category=Ceketler';
  const cat2Label      = content.cat2_label       || t('hero.category_dresses');
  const cat2Link       = content.cat2_link        || '/products?category=Elbiseler';

  // Active slide
  const activeSlide = slides[currentSlide];

  return (
    <div className="w-full bg-white">
      {/* Headline + Search */}
      <div className="max-w-7xl mx-auto px-6 py-8 mt-15">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-none tracking-tight">
            {t('hero.headline1')}<br />
            <span className="block">{t('hero.headline2')}</span>
          </h1>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ---- LEFT: Hero Image / Carousel ---- */}
          <div
            className="relative bg-gray-100 rounded-2xl overflow-hidden h-[500px] md:h-[600px] group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {slides.length > 0 ? (
              <>
                {/* Slides */}
                {slides.map((slide, i) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Text overlay */}
                    {(slide.title || slide.subtitle) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-8 pt-16">
                        <h2 className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
                          {slide.title}
                        </h2>
                        {slide.subtitle && (
                          <p className="text-white/80 text-sm mt-1 drop-shadow">{slide.subtitle}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Shop button */}
                <button
                  onClick={() => navigate(activeSlide?.buttonLink || '/products')}
                  className="absolute bottom-1/2 right-12 translate-y-1/2 z-20 bg-black text-white rounded-full w-32 h-32 flex items-center justify-center font-semibold text-sm hover:scale-110 hover:shadow-2xl transition-all duration-300 active:scale-95 text-center"
                >
                  {activeSlide?.buttonText
                    ? activeSlide.buttonText
                    : t('hero.shop_now').split('\n').map((line, i) => (
                        <span key={i}>{line}{i === 0 && <br />}</span>
                      ))
                  }
                </button>

                {/* Prev/Next */}
                {slides.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow transition opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow transition opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={18} />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === currentSlide ? 'bg-white w-6' : 'bg-white/50 w-2'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              /* Fallback: static image */
              <>
                <img
                  src="/hero-product3.png"
                  alt="Big Boss Sonbahar Koleksiyonu"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop'; }}
                  loading="eager"
                />
                <button
                  onClick={() => navigate('/products')}
                  className="absolute bottom-1/2 right-12 translate-y-1/2 bg-black text-white rounded-full w-32 h-32 flex items-center justify-center font-semibold text-sm hover:scale-110 hover:shadow-2xl transition-all duration-300 active:scale-95 text-center"
                  aria-label={t('hero.shop_now')}
                >
                  {t('hero.shop_now').split('\n').map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br />}</span>
                  ))}
                </button>
              </>
            )}
          </div>

          {/* ---- RIGHT: Promo + Categories ---- */}
          <div className="flex flex-col gap-6">

            {/* Promo section */}
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl p-8 md:p-10 relative overflow-hidden h-[280px] md:h-[350px] flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-60 md:w-80 h-full opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                <img
                  src="/hero-product4.jpg"
                  alt="Promosyon"
                  className="w-full h-full object-contain object-right"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop'; }}
                  loading="lazy"
                />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-sm">
                  {promoTitle1}<br />{promoTitle2}<br />{promoTitle3}
                </h2>
                <p className="text-sm text-gray-700 font-medium drop-shadow-sm">{promoSubtitle}</p>
              </div>
              <button
                onClick={() => navigate(promoBtnLink)}
                className="relative z-10 self-start border-2 border-black bg-white rounded-full px-6 md:px-8 py-3 text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300 active:scale-95 flex items-center gap-2 group/btn shadow-md hover:shadow-xl"
              >
                <span>{promoBtnText}</span>
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Category cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-auto sm:h-[234px]">
              {[
                { label: cat1Label, link: cat1Link, img: '/hero-product4.jpg' },
                { label: cat2Label, link: cat2Link, img: '/hero-product3.png' },
              ].map(({ label, link, img }) => (
                <button
                  key={label}
                  onClick={() => navigate(link)}
                  className="relative bg-gray-300 rounded-2xl overflow-hidden group cursor-pointer h-[200px] sm:h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                  aria-label={label}
                >
                  <img
                    src={img}
                    alt={label}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop'; }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <h3 className="absolute bottom-6 left-6 text-white text-xl md:text-2xl font-bold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {label}
                  </h3>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
