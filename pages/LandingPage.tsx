
import React from 'react';
import { motion } from 'framer-motion';
import { theme, styles } from '../theme';
import { Wind, Droplets, Eye, Sparkles, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  t: any;
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ t, onExplore }) => {
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
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
                {t.landingFengShuiTitle}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8', 
              color: '#bbb',
              textAlign: 'justify'
            }}>
              {t.landingFengShuiDesc}
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
              src="https://picsum.photos/seed/fengshui/800/600" 
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
          alignItems: 'center'
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
              src="https://picsum.photos/seed/faceanalysis/800/600" 
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
                {t.landingFaceTitle}
              </h2>
            </div>
            <p style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8', 
              color: '#bbb',
              textAlign: 'justify'
            }}>
              {t.landingFaceDesc}
            </p>
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
            Ready to reveal your path?
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
