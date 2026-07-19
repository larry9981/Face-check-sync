

import React from 'react';
import { motion } from 'framer-motion';
import { theme, styles } from '../theme';
import { handleImageError } from '../utils';

export const PrivacyPolicy = ({ t }: { t: any }) => (
  <div style={{...styles.glassPanel, maxWidth: '900px'}} className="glass-panel-mobile">
    <h2 style={{color: theme.gold, textAlign: 'center', marginBottom: '30px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.privacyTitle}</h2>
    <div style={{lineHeight: '1.8', color: '#ccc', textAlign: 'left', fontSize: '0.95rem', fontFamily: '"Space Grotesk", sans-serif'}}>
      <p style={{marginBottom: '20px'}}>{t.privacyIntro}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.privacyCollectionTitle}</h3>
      <p>{t.privacyCollectionDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.privacyUsageTitle}</h3>
      <p>{t.privacyUsageDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.privacyDataTitle}</h3>
      <p>{t.privacyDataDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.privacySecurityTitle}</h3>
      <p>{t.privacySecurityDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.privacyThirdPartyTitle}</h3>
      <p>{t.privacyThirdPartyDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.privacyRightsTitle}</h3>
      <p>{t.privacyRightsDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.privacyContactTitle}</h3>
      <p>{t.privacyContactDesc}</p>
    </div>
  </div>
);

export const TermsOfService = ({ t }: { t: any }) => (
  <div style={{...styles.glassPanel, maxWidth: '900px'}} className="glass-panel-mobile">
    <h2 style={{color: theme.gold, textAlign: 'center', marginBottom: '30px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.termsTitle}</h2>
    <div style={{lineHeight: '1.8', color: '#ccc', textAlign: 'left', fontSize: '0.95rem', fontFamily: '"Space Grotesk", sans-serif'}}>
      <p style={{marginBottom: '20px'}}>{t.termsIntro}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.termsAcceptanceTitle}</h3>
      <p>{t.termsAcceptanceDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.termsServiceTitle}</h3>
      <p>{t.termsServiceDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.termsDisclaimerTitle}</h3>
      <p>{t.footerDisclaimer}</p>
      <p>{t.termsDisclaimerDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.termsLiabilityTitle}</h3>
      <p>{t.termsLiabilityDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.termsLawTitle}</h3>
      <p>{t.termsLawDesc}</p>
    </div>
  </div>
);

export const RefundPolicy = ({ t }: { t: any }) => (
  <div style={{...styles.glassPanel, maxWidth: '900px'}} className="glass-panel-mobile">
    <h2 style={{color: theme.gold, textAlign: 'center', marginBottom: '30px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.refundTitle}</h2>
    <div style={{lineHeight: '1.8', color: '#ccc', textAlign: 'left', fontSize: '0.95rem', fontFamily: '"Space Grotesk", sans-serif'}}>
      <p style={{marginBottom: '20px'}}>{t.refundIntro}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.refundDigitalTitle}</h3>
      <p>{t.refundDigitalDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.refundPhysicalTitle}</h3>
      <p>{t.refundPhysicalDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.refundProcessTitle}</h3>
      <p>{t.refundProcessDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid rgba(102, 192, 244, 0.15)`, paddingBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.refundContactTitle}</h3>
      <p>{t.refundContactDesc}</p>
    </div>
  </div>
);

export const AboutPage = ({ t }: { t: any }) => (
  <div style={{...styles.glassPanel, maxWidth: '900px', padding: '60px 40px'}} className="glass-panel-mobile">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 style={{
        color: theme.gold, 
        textAlign: 'center', 
        marginBottom: '40px', 
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '2.5rem',
        letterSpacing: '0.1em'
      }}>{t.aboutTitle}</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }} className="responsive-grid">
        <div style={{ position: 'relative' }}>
          <img 
            src={`https://image.pollinations.ai/prompt/${encodeURIComponent('mystical face reading, ancient Chinese wisdom meets modern AI technology, glowing facial features, ethereal digital energy, 8k, cinematic, spiritual guidance')}?width=600&height=800&nologo=true&seed=about_us_mystic`} 
            alt="Ancient Wisdom meets AI" 
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, 'about_us_mystic')}
            style={{ width: '100%', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: `1px solid rgba(102, 192, 244, 0.22)` }}
          />
          <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '100%', height: '100%', border: `1px solid rgba(102, 192, 244, 0.6)`, borderRadius: '15px', zIndex: -1 }} />
        </div>
        
        <div style={{ lineHeight: '1.8', color: '#ccc', textAlign: 'left', fontSize: '1.05rem', fontFamily: '"Space Grotesk", sans-serif' }}>
          <p style={{ marginBottom: '20px' }}>{t.aboutDesc1}</p>
          <p>{t.aboutDesc2}</p>
          
          <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'flex-start' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: theme.gold, fontSize: '1.5rem', fontWeight: 'bold' }}>10k+</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Soul Readings</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: theme.gold, fontSize: '1.5rem', fontWeight: 'bold' }}>50+</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Masters</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: theme.gold, fontSize: '1.5rem', fontWeight: 'bold' }}>99%</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Clarity Rate</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    <style>{`
      @media (max-width: 768px) {
        .responsive-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  </div>
);
