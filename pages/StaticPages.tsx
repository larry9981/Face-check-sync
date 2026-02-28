

import React from 'react';
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
  <div style={{...styles.glassPanel, maxWidth: '800px'}} className="glass-panel-mobile">
    <h2 style={{color: theme.gold, textAlign: 'center', marginBottom: '20px'}}>{t.aboutTitle}</h2>
    <div style={{lineHeight: '1.6', color: '#ccc', textAlign: 'center'}}>
      <p>{t.aboutDesc1}</p>
      <p>{t.aboutDesc2}</p>
    </div>
  </div>
);
