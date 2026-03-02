
import React from 'react';
import { motion } from 'framer-motion';
import { theme, styles } from '../theme';
import { Wind, Droplets, Eye, Sparkles, ArrowRight, Hand, CircleDot, MoonStar } from 'lucide-react';
import { HomepageConfig } from '../types';

interface LandingPageProps {
  t: any;
  onExplore: () => void;
  homepageConfigs?: HomepageConfig[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ t, onExplore, homepageConfigs = [] }) => {
  const [currentBanner, setCurrentBanner] = React.useState(0);

  // Filter and prepare banners
  const bannerConfigs = homepageConfigs.filter(c => c.type === 'banner');
  const banners = bannerConfigs.length > 0 ? bannerConfigs.map(c => ({
    title: c.title || t.banner1Title,
    desc: c.description || t.banner1Desc,
    img: c.imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(c.imagePrompt || 'mystical feng shui landscape, ethereal lighting, zen, 8k')}?width=1920&height=1080&nologo=true&seed=${c.key.length}`
  })) : [
    { title: t.banner1Title, desc: t.banner1Desc, img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920' },
    { title: t.banner2Title, desc: t.banner2Desc, img: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&q=80&w=1920' },
    { title: t.banner3Title, desc: t.banner3Desc, img: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1920' },
  ];

  // Prepare sections
  const getSection = (key: string, defaultTitle: string, defaultDesc: string, defaultImg: string) => {
    const config = homepageConfigs.find(c => c.key === key);
    return {
      title: config?.title || defaultTitle,
      desc: config?.description || defaultDesc,
      img: config?.imageUrl || (config?.imagePrompt ? `https://image.pollinations.ai/prompt/${encodeURIComponent(config.imagePrompt)}?width=800&height=600&nologo=true&seed=${key.length}` : defaultImg)
    };
  };

  const fengshui = getSection('fengshui', t.landingFengShuiTitle, t.landingFengShuiDesc, 'https://images.unsplash.com/photo-1515890435782-59a5bb6ec191?auto=format&fit=crop&q=80&w=800');
  const face = getSection('face', t.landingFaceTitle, t.landingFaceDesc, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800');
  const palm = getSection('palm', t.landingPalmTitle, t.landingPalmDesc, 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800');
  const wuxing = getSection('wuxing', t.landingWuXingTitle, t.landingWuXingDesc, 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800');
  const zodiac = getSection('zodiac', t.landingZodiacTitle, t.landingZodiacDesc, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800');

  React.useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* Banner Section */}
      <section style={{ 
        height: '70vh', 
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {banners.map((banner, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentBanner === idx ? 1 : 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${banner.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0 20px'
            }}
          >
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={currentBanner === idx ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ 
                fontSize: 'clamp(2rem, 5vw, 4rem)', 
                fontFamily: 'Cinzel, serif', 
                color: theme.gold,
                marginBottom: '1rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)'
              }}
            >
              {banner.title}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={currentBanner === idx ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{ 
                fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', 
                color: '#fff',
                maxWidth: '700px',
                textShadow: '0 1px 5px rgba(0,0,0,0.8)'
              }}
            >
              {banner.desc}
            </motion.p>
          </motion.div>
        ))}
        
        {/* Banner Indicators */}
        {banners.length > 1 && (
          <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '10px' }}>
            {banners.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: currentBanner === idx ? theme.gold : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Hero Section */}
      <section style={{ 
        height: '90vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
        padding: '0 20px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 6rem)', 
            fontFamily: 'Cinzel, serif', 
            color: theme.gold, 
            margin: '0 0 1rem 0',
            letterSpacing: '0.1em',
            textShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
          }}>
            {t.landingTitle}
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.5rem)', 
            color: '#ccc', 
            maxWidth: '800px', 
            margin: '0 auto 2.5rem auto',
            fontStyle: 'italic',
            letterSpacing: '0.05em'
          }}>
            {t.landingSubtitle}
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onExplore}
            style={{
              ...styles.button,
              padding: '1.2rem 3rem',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '0 auto'
            }}
          >
            {t.exploreDestiny} <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </section>

      {/* Feng Shui Section - Mixed Layout */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '60px', 
          alignItems: 'center',
          marginBottom: '120px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <Wind size={32} color={theme.gold} />
              <Droplets size={32} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2.5rem', 
                color: theme.gold, 
                margin: 0 
              }}>
                {fengshui.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8', 
              color: '#bbb',
              textAlign: 'justify'
            }}>
              {fengshui.desc}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            <img 
              src={fengshui.img} 
              alt="Feng Shui" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '20px', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              border: `2px solid ${theme.gold}`,
              borderRadius: '50%',
              zIndex: -1
            }} />
          </motion.div>
        </div>

        {/* Face Reading Section - Inverted Mixed Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '60px', 
          alignItems: 'center',
          marginBottom: '120px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ order: 2 }}
            className="order-mobile-1"
          >
            <img 
              src={face.img} 
              alt="Face Reading" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '20px', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ order: 1 }}
            className="order-mobile-2"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <Eye size={32} color={theme.gold} />
              <Sparkles size={32} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2.5rem', 
                color: theme.gold, 
                margin: 0 
              }}>
                {face.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8', 
              color: '#bbb',
              textAlign: 'justify'
            }}>
              {face.desc}
            </p>
          </motion.div>
        </div>

        {/* Palmistry Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '60px', 
          alignItems: 'center',
          marginBottom: '120px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <Hand size={32} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2.5rem', 
                color: theme.gold, 
                margin: 0 
              }}>
                {palm.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8', 
              color: '#bbb',
              textAlign: 'justify'
            }}>
              {palm.desc}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={palm.img} 
              alt="Palmistry" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '20px', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
        </div>

        {/* Five Elements Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '60px', 
          alignItems: 'center',
          marginBottom: '120px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ order: 2 }}
            className="order-mobile-1"
          >
            <img 
              src={wuxing.img} 
              alt="Five Elements" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '20px', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ order: 1 }}
            className="order-mobile-2"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <CircleDot size={32} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2.5rem', 
                color: theme.gold, 
                margin: 0 
              }}>
                {wuxing.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8', 
              color: '#bbb',
              textAlign: 'justify'
            }}>
              {wuxing.desc}
            </p>
          </motion.div>
        </div>

        {/* Zodiac Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '60px', 
          alignItems: 'center'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <MoonStar size={32} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2.5rem', 
                color: theme.gold, 
                margin: 0 
              }}>
                {zodiac.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8', 
              color: '#bbb',
              textAlign: 'justify'
            }}>
              {zodiac.desc}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={zodiac.img} 
              alt="Zodiac" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '20px', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ 
        padding: '120px 20px', 
        textAlign: 'center',
        background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.05))'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '3rem', color: theme.gold, marginBottom: '2rem' }}>
            {t.exploreDestiny}
          </h2>
          <button
            onClick={onExplore}
            style={{
              ...styles.button,
              padding: '1rem 4rem',
              fontSize: '1.2rem'
            }}
          >
            {t.startBtn}
          </button>
        </motion.div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .order-mobile-1 { order: 1 !important; }
          .order-mobile-2 { order: 2 !important; }
        }
      `}</style>
    </div>
  );
};
