

import React from 'react';
import { theme, styles } from '../theme';

export const PrivacyPolicy = ({ t }: { t: any }) => (
  <div style={{...styles.glassPanel, maxWidth: '800px'}} className="glass-panel-mobile">
    <h2 style={{color: theme.gold, textAlign: 'center', marginBottom: '20px'}}>{t.privacyTitle}</h2>
    <div style={{lineHeight: '1.6', color: '#ccc', textAlign: 'left'}}>
      <p>{t.privacyIntro}</p>
      <h3 style={{color: theme.darkGold, marginTop: '20px'}}>{t.privacyCollectionTitle}</h3>
      <p>{t.privacyCollectionDesc}</p>
      <h3 style={{color: theme.darkGold, marginTop: '20px'}}>{t.privacyUsageTitle}</h3>
      <p>{t.privacyUsageDesc}</p>
    </div>
  </div>
);

export const TermsOfService = ({ t }: { t: any }) => (
  <div style={{...styles.glassPanel, maxWidth: '800px'}} className="glass-panel-mobile">
    <h2 style={{color: theme.gold, textAlign: 'center', marginBottom: '20px'}}>{t.termsTitle}</h2>
    <div style={{lineHeight: '1.6', color: '#ccc', textAlign: 'left'}}>
      <p>{t.termsIntro}</p>
      <h3 style={{color: theme.darkGold, marginTop: '20px'}}>{t.termsDisclaimerTitle}</h3>
      <p>{t.footerDisclaimer}</p>
      <p>{t.termsDisclaimerDesc}</p>
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
