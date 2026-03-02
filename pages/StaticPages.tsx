

import React from 'react';
import { motion } from 'framer-motion';
import { theme, styles } from '../theme';

export const PrivacyPolicy = ({ t }: { t: any }) => (
  <div style={{...styles.glassPanel, maxWidth: '900px'}} className="glass-panel-mobile">
    <h2 style={{color: theme.gold, textAlign: 'center', marginBottom: '30px'}}>{t.privacyTitle}</h2>
    <div style={{lineHeight: '1.8', color: '#ccc', textAlign: 'left', fontSize: '0.95rem'}}>
      <p style={{marginBottom: '20px'}}>{t.privacyIntro}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.privacyCollectionTitle}</h3>
      <p>{t.privacyCollectionDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.privacyUsageTitle}</h3>
      <p>{t.privacyUsageDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.privacyDataTitle}</h3>
      <p>{t.privacyDataDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.privacySecurityTitle}</h3>
      <p>{t.privacySecurityDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.privacyThirdPartyTitle}</h3>
      <p>{t.privacyThirdPartyDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.privacyRightsTitle}</h3>
      <p>{t.privacyRightsDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.privacyContactTitle}</h3>
      <p>{t.privacyContactDesc}</p>
    </div>
  </div>
);

export const TermsOfService = ({ t }: { t: any }) => (
  <div style={{...styles.glassPanel, maxWidth: '900px'}} className="glass-panel-mobile">
    <h2 style={{color: theme.gold, textAlign: 'center', marginBottom: '30px'}}>{t.termsTitle}</h2>
    <div style={{lineHeight: '1.8', color: '#ccc', textAlign: 'left', fontSize: '0.95rem'}}>
      <p style={{marginBottom: '20px'}}>{t.termsIntro}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.termsAcceptanceTitle}</h3>
      <p>{t.termsAcceptanceDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.termsServiceTitle}</h3>
      <p>{t.termsServiceDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.termsDisclaimerTitle}</h3>
      <p>{t.footerDisclaimer}</p>
      <p>{t.termsDisclaimerDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.termsLiabilityTitle}</h3>
      <p>{t.termsLiabilityDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.termsLawTitle}</h3>
      <p>{t.termsLawDesc}</p>
    </div>
  </div>
);

export const RefundPolicy = ({ t }: { t: any }) => (
  <div style={{...styles.glassPanel, maxWidth: '900px'}} className="glass-panel-mobile">
    <h2 style={{color: theme.gold, textAlign: 'center', marginBottom: '30px'}}>{t.refundTitle}</h2>
    <div style={{lineHeight: '1.8', color: '#ccc', textAlign: 'left', fontSize: '0.95rem'}}>
      <p style={{marginBottom: '20px'}}>{t.refundIntro}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.refundDigitalTitle}</h3>
      <p>{t.refundDigitalDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.refundPhysicalTitle}</h3>
      <p>{t.refundPhysicalDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.refundProcessTitle}</h3>
      <p>{t.refundProcessDesc}</p>
      
      <h3 style={{color: theme.gold, marginTop: '25px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '5px'}}>{t.refundContactTitle}</h3>
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
        fontFamily: 'Cinzel, serif',
        fontSize: '2.5rem',
        letterSpacing: '0.1em'
      }}>{t.aboutTitle}</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }} className="responsive-grid">
        <div style={{ position: 'relative' }}>
          <img 
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600" 
            alt="Spiritual" 
            referrerPolicy="no-referrer"
            style={{ width: '100%', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: `1px solid ${theme.darkGold}` }}
          />
          <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '100%', height: '100%', border: `1px solid ${theme.gold}`, borderRadius: '15px', zIndex: -1 }} />
        </div>
        
        <div style={{ lineHeight: '1.8', color: '#ccc', textAlign: 'left', fontSize: '1.05rem' }}>
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
