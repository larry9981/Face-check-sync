
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
  const iching = getSection('iching', t.landingIChingTitle, t.landingIChingDesc, 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&q=80&w=800');
  const bazi = getSection('bazi', t.landingBaziTitle, t.landingBaziDesc, 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800');
  const ziwei = getSection('ziwei', t.landingZiWeiTitle, t.landingZiWeiDesc, 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800');
  const qimen = getSection('qimen', t.landingQiMenTitle, t.landingQiMenDesc, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800');
  const plum = getSection('plum', t.landingPlumTitle, t.landingPlumDesc, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800');

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

      {/* Feng Shui & Mystic Methods Sections - Mixed Alternating Layout */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Row 1: Feng Shui (Text Left, Image Right) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '48px', 
          alignItems: 'center',
          marginBottom: '90px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-1 order-mobile-2"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Wind size={26} color={theme.gold} />
              <Droplets size={26} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2rem', 
                color: theme.gold, 
                letterSpacing: '1px',
                margin: 0 
              }}>
                {fengshui.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#ccc',
              textAlign: 'justify',
              margin: 0,
              letterSpacing: '0.02em'
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
            className="desk-order-2 order-mobile-1"
          >
            <img 
              src={fengshui.img} 
              alt="Feng Shui" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '80px',
              height: '80px',
              border: `2px solid ${theme.gold}`,
              borderRadius: '50%',
              zIndex: -1
            }} />
          </motion.div>
        </div>

        {/* Row 2: Face Reading (Image Left, Text Right) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '48px', 
          alignItems: 'center',
          marginBottom: '90px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-1 order-mobile-1"
          >
            <img 
              src={face.img} 
              alt="Face Reading" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-2 order-mobile-2"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Eye size={26} color={theme.gold} />
              <Sparkles size={26} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2rem', 
                color: theme.gold, 
                letterSpacing: '1px',
                margin: 0 
              }}>
                {face.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#ccc',
              textAlign: 'justify',
              margin: 0,
              letterSpacing: '0.02em'
            }}>
              {face.desc}
            </p>
          </motion.div>
        </div>

        {/* Row 3: Palmistry (Text Left, Image Right) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '48px', 
          alignItems: 'center',
          marginBottom: '90px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-1 order-mobile-2"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Hand size={26} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2rem', 
                color: theme.gold, 
                letterSpacing: '1px',
                margin: 0 
              }}>
                {palm.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#ccc',
              textAlign: 'justify',
              margin: 0,
              letterSpacing: '0.02em'
            }}>
              {palm.desc}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-2 order-mobile-1"
          >
            <img 
              src={palm.img} 
              alt="Palmistry" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
        </div>

        {/* Row 4: Five Elements (Image Left, Text Right) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '48px', 
          alignItems: 'center',
          marginBottom: '90px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-1 order-mobile-1"
          >
            <img 
              src={wuxing.img} 
              alt="Five Elements" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-2 order-mobile-2"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <CircleDot size={26} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2rem', 
                color: theme.gold, 
                letterSpacing: '1px',
                margin: 0 
              }}>
                {wuxing.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#ccc',
              textAlign: 'justify',
              margin: 0,
              letterSpacing: '0.02em'
            }}>
              {wuxing.desc}
            </p>
          </motion.div>
        </div>

        {/* Row 5: Zodiac (Text Left, Image Right) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '48px', 
          alignItems: 'center',
          marginBottom: '90px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-1 order-mobile-2"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <MoonStar size={26} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2rem', 
                color: theme.gold, 
                letterSpacing: '1px',
                margin: 0 
              }}>
                {zodiac.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#ccc',
              textAlign: 'justify',
              margin: 0,
              letterSpacing: '0.02em'
            }}>
              {zodiac.desc}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-2 order-mobile-1"
          >
            <img 
              src={zodiac.img} 
              alt="Zodiac" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
        </div>

        {/* Row 6: I Ching (Image Left, Text Right) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '48px', 
          alignItems: 'center',
          marginBottom: '90px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-1 order-mobile-1"
          >
            <img 
              src={iching.img} 
              alt="I Ching" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-2 order-mobile-2"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Sparkles size={26} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2rem', 
                color: theme.gold, 
                letterSpacing: '1px',
                margin: 0 
              }}>
                {iching.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#ccc',
              textAlign: 'justify',
              margin: 0,
              letterSpacing: '0.02em'
            }}>
              {iching.desc}
            </p>
          </motion.div>
        </div>

        {/* Row 7: Bazi (Text Left, Image Right) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '48px', 
          alignItems: 'center',
          marginBottom: '90px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-1 order-mobile-2"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <CircleDot size={26} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2rem', 
                color: theme.gold, 
                letterSpacing: '1px',
                margin: 0 
              }}>
                {bazi.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#ccc',
              textAlign: 'justify',
              margin: 0,
              letterSpacing: '0.02em'
            }}>
              {bazi.desc}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-2 order-mobile-1"
          >
            <img 
              src={bazi.img} 
              alt="Bazi" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
        </div>

        {/* Row 8: Zi Wei (Image Left, Text Right) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '48px', 
          alignItems: 'center',
          marginBottom: '90px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-1 order-mobile-1"
          >
            <img 
              src={ziwei.img} 
              alt="Zi Wei" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-2 order-mobile-2"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <MoonStar size={26} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2rem', 
                color: theme.gold, 
                letterSpacing: '1px',
                margin: 0 
              }}>
                {ziwei.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#ccc',
              textAlign: 'justify',
              margin: 0,
              letterSpacing: '0.02em'
            }}>
              {ziwei.desc}
            </p>
          </motion.div>
        </div>

        {/* Row 9: Qi Men (Text Left, Image Right) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '48px', 
          alignItems: 'center',
          marginBottom: '90px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-1 order-mobile-2"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Wind size={26} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2rem', 
                color: theme.gold, 
                letterSpacing: '1px',
                margin: 0 
              }}>
                {qimen.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#ccc',
              textAlign: 'justify',
              margin: 0,
              letterSpacing: '0.02em'
            }}>
              {qimen.desc}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-2 order-mobile-1"
          >
            <img 
              src={qimen.img} 
              alt="Qi Men" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
        </div>

        {/* Row 10: Plum Blossom (Image Left, Text Right) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '48px', 
          alignItems: 'center',
          marginBottom: '90px'
        }} className="responsive-grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-1 order-mobile-1"
          >
            <img 
              src={plum.img} 
              alt="Plum Blossom" 
              referrerPolicy="no-referrer"
              style={{ 
                width: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                border: `1px solid ${theme.darkGold}`
              }} 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="desk-order-2 order-mobile-2"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Sparkles size={26} color={theme.gold} />
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '2rem', 
                color: theme.gold, 
                letterSpacing: '1px',
                margin: 0 
              }}>
                {plum.title}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#ccc',
              textAlign: 'justify',
              margin: 0,
              letterSpacing: '0.02em'
            }}>
              {plum.desc}
            </p>
          </motion.div>
        </div>

      </section>

      {/* Call to Action */}
      <section style={{ 
        padding: '160px 20px', 
        textAlign: 'center',
        background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.08))',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          zIndex: 0
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}
        >
          <h2 style={{ 
            fontFamily: 'Cinzel, serif', 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            color: theme.gold, 
            marginBottom: '1.5rem',
            letterSpacing: '0.1em'
          }}>
            {t.exploreDestiny}
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#ccc', 
            marginBottom: '3rem', 
            maxWidth: '700px', 
            margin: '0 auto 3rem auto',
            lineHeight: '1.6'
          }}>
            {t.landingSubtitle}. {t.banner1Desc}
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '30px', 
            marginBottom: '4rem' 
          }}>
            {[
              { icon: <Eye size={24} />, title: t.landingFaceTitle, desc: t.landingFaceDesc.slice(0, 60) + '...' },
              { icon: <Hand size={24} />, title: t.landingPalmTitle, desc: t.landingPalmDesc.slice(0, 60) + '...' },
              { icon: <Sparkles size={24} />, title: t.landingIChingTitle, desc: t.landingIChingDesc.slice(0, 60) + '...' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                style={{
                  padding: '30px',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${theme.darkGold}44`,
                  borderRadius: '15px',
                  textAlign: 'left'
                }}
              >
                <div style={{ color: theme.gold, marginBottom: '15px' }}>{feature.icon}</div>
                <h3 style={{ color: theme.gold, marginBottom: '10px', fontSize: '1.2rem' }}>{feature.title}</h3>
                <p style={{ color: '#999', fontSize: '0.9rem', lineHeight: '1.5' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(212, 175, 55, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onExplore}
            style={{
              ...styles.button,
              padding: '1.5rem 5rem',
              fontSize: '1.3rem',
              borderRadius: '50px', // More modern look for the main CTA
              background: `linear-gradient(135deg, ${theme.gold}, ${theme.darkGold})`,
              border: 'none',
              color: '#000'
            }}
          >
            {t.startBtn}
          </motion.button>
        </motion.div>
      </section>

      <style>{`
        @media (min-width: 769px) {
          .desk-order-1 { order: 1 !important; }
          .desk-order-2 { order: 2 !important; }
        }
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
