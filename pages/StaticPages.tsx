
import React from 'react';
import { theme, styles } from '../theme';

export const PrivacyPolicy = ({ t }: { t: any }) => (
  <div style={{...styles.glassPanel, maxWidth: '800px'}} className="glass-panel-mobile">
    <h2 style={{color: theme.gold, textAlign: 'center', marginBottom: '20px'}}>{t.privacy} Policy</h2>
    <div style={{lineHeight: '1.6', color: '#ccc', textAlign: 'left'}}>
      <p>This privacy policy explains how Mystic Face ("we", "us", or "our") collects, uses, and discloses your information.</p>
      <h3 style={{color: theme.darkGold, marginTop: '20px'}}>Information Collection</h3>
      <p>We do not store your face data. Images processed for face reading are analyzed in real-time and are not permanently saved on our servers.</p>
      <h3 style={{color: theme.darkGold, marginTop: '20px'}}>Usage</h3>
      <p>We use the data solely to provide the fortune-telling service. Payment information is processed securely by third-party providers.</p>
    </div>
  </div>
);

export const TermsOfService = ({ t }: { t: any }) => (
  <div style={{...styles.glassPanel, maxWidth: '800px'}} className="glass-panel-mobile">
    <h2 style={{color: theme.gold, textAlign: 'center', marginBottom: '20px'}}>{t.terms} of Service</h2>
    <div style={{lineHeight: '1.6', color: '#ccc', textAlign: 'left'}}>
      <p>By using Mystic Face, you agree to these terms.</p>
      <h3 style={{color: theme.darkGold, marginTop: '20px'}}>Disclaimer</h3>
      <p>{t.footerDisclaimer}</p>
      <p>This service is for entertainment purposes only. The advice given is simulated based on traditional physiognomy and should not replace professional medical, legal, or financial advice.</p>
    </div>
  </div>
);

export const AboutPage = ({ t }: { t: any }) => (
  <div style={{...styles.glassPanel, maxWidth: '800px'}} className="glass-panel-mobile">
    <h2 style={{color: theme.gold, textAlign: 'center', marginBottom: '20px'}}>{t.about} Mystic Face</h2>
    <div style={{lineHeight: '1.6', color: '#ccc', textAlign: 'center'}}>
      <p>We combine the ancient art of Mianxiang (Chinese Face Reading) with modern Artificial Intelligence to provide insights into your destiny.</p>
      <p>Our system analyzes 108 facial landmarks to interpret your wealth, career, and relationship prospects based on centuries-old texts.</p>
    </div>
  </div>
);
