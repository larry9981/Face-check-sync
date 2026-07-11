import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme, styles } from '../theme';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  Hand, 
  Activity, 
  BookOpen, 
  TrendingUp, 
  Award,
  ShieldCheck
} from 'lucide-react';
import { HomepageConfig } from '../types';

interface LandingPageProps {
  t: any;
  onExplore: () => void;
  homepageConfigs?: HomepageConfig[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ t, onExplore, homepageConfigs = [] }) => {
  const isZh = t.home === '首页' || t.title === '玄机面相';

  // State for Interactive Destiny Compass
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [oracleIndex, setOracleIndex] = useState<number | null>(null);

  // Ancient Wisdom Oracle Quotes in Bilingual
  const oracles = isZh ? [
    { text: "“天行健，君子以自强不息；地势坤，君子以厚德载物。”", source: "——《周易·乾坤》", result: "乾坤大吉：顺应天时，当前正是奋发有为、稳步积累之大吉运势。" },
    { text: "“命自我作，福自我求。心若光明，则乾坤无阻。”", source: "——《了凡四训》", result: "中庸和合：命运的轮廓已现，行善积德、调理气运，即可逢凶化吉。" },
    { text: "“太极动而生阳，动极而静，静而生阴，静极复动。”", source: "——《太极图说》", result: "阴阳相生：运势起伏乃宇宙常理，当前宜收敛锋芒，静待转折良机。" },
    { text: "“积善之家，必有余庆；积不善之家，必有余殃。”", source: "——《易经·坤卦·文言》", result: "因果厚德：家庭或事业有贵人暗中相助，宜保持宽容慈悲之心，福报渐近。" },
    { text: "“致中和，天地位焉，万物育焉。”", source: "——《中庸》", result: "五行平衡：当前能量场有些微失衡，急需通过补全喜用神、调理风水来聚财避邪。" }
  ] : [
    { text: '"The heavens move with strength; the noble person strengthens themselves unceasingly."', source: "— I Ching (Book of Changes)", result: "Auspicious alignment: The universe is moving in your favor. It is time for active and steady growth." },
    { text: '"Destiny is created by myself, and fortune is sought by myself. If the heart is light, the cosmos has no barriers."', source: "— Liao-Fan's Four Lessons", result: "Harmonious flow: While destiny provides the map, your actions define the path. Great fortune lies in alignment." },
    { text: '"Yin and Yang interact, creating all things under Heaven. Balance is the ultimate law."', source: "— Taiji Philosophy", result: "Cosmic balance: Energy fluctuates like the tides. Be patient, structure your thoughts, and wait for the perfect transition." },
    { text: '"A family that accumulates good deeds will have abundant blessings remaining."', source: "— I Ching canonical texts", result: "Noble blessing: Generous guardians are in your vicinity. Cultivate altruism, and outstanding fortune will return shortly." },
    { text: '"Achieve central harmony, and heaven and earth will sit in their proper places."', source: "— The Doctrine of the Mean", result: "Elemental harmony: Some minor elemental friction detected. Focus on grounding yourself and balancing your surrounding colors." }
  ];

  const handleSpinCompass = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setOracleIndex(null);
    
    // Spin 3 to 5 full rounds + a random slice
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalNewRotation = rotation + 1440 + extraDegrees;
    setRotation(totalNewRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // Determine oracle based on degrees
      const randomIndex = Math.floor(Math.random() * oracles.length);
      setOracleIndex(randomIndex);
    }, 2800);
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden', background: '#0F0B08', color: theme.text }}>
      
      {/* 1. CELESTIAL BACKGROUND & HERO SECTION */}
      <section style={{ 
        minHeight: '85vh', 
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        background: 'radial-gradient(circle at 50% 40%, #2A1710 0%, #080504 100%)',
        borderBottom: `1px solid rgba(212, 175, 55, 0.15)`
      }}>
        {/* Dynamic moving stardust overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(2px 2px at 20px 30px, #D4AF37, rgba(0,0,0,0)), radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)), radial-gradient(3px 3px at 50px 160px, rgba(212,175,55,0.5), rgba(0,0,0,0))',
          backgroundSize: '200px 200px',
          opacity: 0.35,
          pointerEvents: 'none'
        }} />

        <div style={{ 
          maxWidth: '1200px', 
          width: '100%', 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 0.8fr', 
          gap: '50px', 
          alignItems: 'center',
          position: 'relative',
          zIndex: 5
        }} className="responsive-hero-grid">
          
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ textAlign: 'left' }}
          >
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              background: 'rgba(212, 175, 55, 0.08)', 
              padding: '8px 16px', 
              borderRadius: '2px', 
              border: `1px solid rgba(212, 175, 55, 0.25)`,
              marginBottom: '25px'
            }}>
              <Sparkles size={16} color={theme.gold} />
              <span style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '0.85rem', 
                letterSpacing: '2px', 
                color: theme.gold,
                textTransform: 'uppercase'
              }}>
                {isZh ? "五千年中华智慧之大成 · 数字化新生" : "5,000 Years of Ancient Destiny Calculus · AI Reborn"}
              </span>
            </div>

            <h1 style={{ 
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', 
              fontFamily: 'Cinzel, serif', 
              color: theme.gold, 
              lineHeight: '1.25',
              fontWeight: 700,
              marginBottom: '20px',
              letterSpacing: '1px',
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.9)'
            }}>
              {isZh ? "古老文化传承" : "Ancient Wisdom"}
              <br />
              <span style={{ color: '#fff' }}>
                {isZh ? "科学剖析与未来洞察" : "Decodes Your Future"}
              </span>
            </h1>

            <p style={{ 
              fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', 
              color: '#DFDFD5', 
              lineHeight: '1.75', 
              marginBottom: '35px',
              maxWidth: '640px',
              textAlign: 'justify'
            }}>
              {isZh ? (
                "摒弃市俗图文混排，回归命理学术之严谨。我们深度挖掘《易经》、《滴天髓》、《神相全编》等旷世经典，结合现代高精度图像识别及多维神经网络，从面相相格、手掌纹理、出生八字及姓名五行等四个维度，为您提供权威、专业、毫无浮夸之气的人生轨迹剖析与气场调理建议。"
              ) : (
                "Moving beyond superficial fortunes, we restore the scholarly rigor of traditional metaphysics. By cross-examining seminal treatises—such as the I Ching and Shenxiang Quanbian—with biometric vision models, we deliver objective analyses across facial structures, palm lines, and elemental natal charts to guide your career, relationships, and health."
              )}
            </p>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: `0 0 25px rgba(212, 175, 55, 0.35)` }}
                whileTap={{ scale: 0.97 }}
                onClick={onExplore}
                style={{
                  ...styles.button,
                  margin: 0,
                  padding: '16px 36px',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                {isZh ? "立即开启命运测算" : "Begin Destiny Exploration"} 
                <ArrowRight size={18} />
              </motion.button>

              <button
                onClick={() => {
                  const el = document.getElementById('systems-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  ...styles.secondaryButton,
                  margin: 0,
                  padding: '15px 30px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(0,0,0,0.4)',
                  borderColor: 'rgba(212, 175, 55, 0.4)',
                  color: theme.gold
                }}
              >
                {isZh ? "了解学术原理" : "Scholarly Principles"}
              </button>
            </div>
          </motion.div>

          {/* Hero Right: Decorative Subtle Rotating Bagua Compass (Visual Only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
            className="hero-right-compass"
          >
            {/* Outer golden halo */}
            <div style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              border: '1px dashed rgba(212, 175, 55, 0.15)',
              borderRadius: '50%',
              animation: 'spin 60s linear infinite'
            }} />
            <div style={{
              position: 'absolute',
              width: '260px',
              height: '260px',
              border: '1px solid rgba(212, 175, 55, 0.08)',
              borderRadius: '50%',
              animation: 'spin 40s linear infinite reverse'
            }} />
            
            {/* Main Bagua Graphic */}
            <div style={{
              width: '220px',
              height: '220px',
              opacity: 0.4,
              animation: 'spin 30s linear infinite',
              filter: 'drop-shadow(0 0 25px rgba(212, 175, 55, 0.25))'
            }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="48" fill="none" stroke={theme.gold} strokeWidth="0.75" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={theme.gold} strokeWidth="0.5" strokeDasharray="2,2" />
                <circle cx="50" cy="50" r="28" fill="none" stroke={theme.gold} strokeWidth="0.5" />
                
                {/* Crosslines */}
                <line x1="50" y1="2" x2="50" y2="98" stroke={theme.gold} strokeWidth="0.25" strokeOpacity="0.5" />
                <line x1="2" y1="50" x2="98" y2="50" stroke={theme.gold} strokeWidth="0.25" strokeOpacity="0.5" />
                <line x1="16" y1="16" x2="84" y2="84" stroke={theme.gold} strokeWidth="0.25" strokeOpacity="0.3" />
                <line x1="84" y1="16" x2="16" y2="84" stroke={theme.gold} strokeWidth="0.25" strokeOpacity="0.3" />

                {/* Trigrams Ring */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
                  const rad = (angle * Math.PI) / 180;
                  const x = 50 + 34 * Math.cos(rad);
                  const y = 50 + 34 * Math.sin(rad);
                  return (
                    <g key={idx} transform={`translate(${x},${y}) rotate(${angle + 90})`}>
                      {/* Trigram Marks */}
                      <line x1="-3" y1="-2" x2="3" y2="-2" stroke={theme.gold} strokeWidth="0.8" />
                      {idx % 2 === 0 ? (
                        <line x1="-3" y1="0" x2="3" y2="0" stroke={theme.gold} strokeWidth="0.8" />
                      ) : (
                        <>
                          <line x1="-3" y1="0" x2="-0.8" y2="0" stroke={theme.gold} strokeWidth="0.8" />
                          <line x1="0.8" y1="0" x2="3" y2="0" stroke={theme.gold} strokeWidth="0.8" />
                        </>
                      )}
                      <line x1="-3" y1="2" x2="3" y2="2" stroke={theme.gold} strokeWidth="0.8" />
                    </g>
                  );
                })}

                {/* Center Yin Yang */}
                <path d="M 50,22 A 14,14 0 0,0 50,50 A 14,14 0 0,1 50,78 A 28,28 0 0,1 50,22 Z" fill={theme.gold} fillOpacity="0.15" />
                <path d="M 50,22 A 14,14 0 0,0 50,50 A 14,14 0 0,1 50,78 A 28,28 0 0,0 50,22 Z" fill="none" stroke={theme.gold} strokeWidth="0.5" />
                <circle cx="50" cy="36" r="3" fill={theme.gold} fillOpacity="0.4" />
                <circle cx="50" cy="64" r="3" fill="none" stroke={theme.gold} strokeWidth="0.5" />
              </svg>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. INTERACTIVE DESTINY COMPASS (旋转命盘/星盘) */}
      <section style={{ 
        padding: '90px 20px', 
        background: '#0B0806',
        borderBottom: `1px solid rgba(212, 175, 55, 0.1)`,
        position: 'relative'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ marginBottom: '45px' }}>
            <h2 style={{ 
              fontFamily: 'Cinzel, serif', 
              fontSize: '2rem', 
              color: theme.gold, 
              marginBottom: '15px',
              letterSpacing: '2px'
            }}>
              {isZh ? "乾坤开运司南命盘" : "The Astrolabe of Universal Fortune"}
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
              {isZh ? (
                "凡事预则立，不预则废。点击启动下方古法青铜司南命盘，凝神静气，调整您的个人能量，获取此时此刻天地运转赋予您的命运箴言与大运批示。"
              ) : (
                "Calibrate your frequency with the rotation of cosmos. Tap below to spin the ancient bronze Astrolabe to align your Qi and unlock a real-time canonical guidance."
              )}
            </p>
          </div>

          {/* Compass Display Sandbox */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(20, 15, 10, 0.95) 0%, rgba(5, 4, 3, 0.98) 100%)',
            border: `1.5px solid ${theme.darkGold}`,
            padding: '50px 30px',
            borderRadius: '4px',
            boxShadow: '0 15px 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(212,175,55,0.05)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            
            {/* Spinning Compass Core */}
            <div style={{ position: 'relative', width: '280px', height: '280px', marginBottom: '40px' }}>
              
              {/* Triangular Pointer Needle on top (fixed) */}
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: `18px solid ${theme.gold}`,
                zIndex: 15,
                filter: 'drop-shadow(0 2px 5px rgba(212,175,55,0.5))'
              }} />

              {/* Rotatable Disk */}
              <div style={{
                width: '100%',
                height: '100%',
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 2.8s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none',
                position: 'relative'
              }}>
                <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
                  {/* Disk background */}
                  <circle cx="100" cy="100" r="98" fill="#1C1410" stroke={theme.gold} strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="90" fill="#160E0A" stroke={theme.darkGold} strokeWidth="1" />
                  <circle cx="100" cy="100" r="65" fill="#110A07" stroke={theme.gold} strokeWidth="0.5" strokeDasharray="3,3" />
                  <circle cx="100" cy="100" r="35" fill="none" stroke={theme.gold} strokeWidth="1" />
                  
                  {/* Stem and Branch Rings (Ancient letters representation) */}
                  {[
                    "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥",
                    "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"
                  ].map((char, index, arr) => {
                    const angle = (index * 360) / arr.length;
                    const rad = (angle * Math.PI) / 180;
                    const x = 100 + 78 * Math.cos(rad);
                    const y = 100 + 78 * Math.sin(rad);
                    return (
                      <g key={index} transform={`translate(${x}, ${y}) rotate(${angle + 90})`}>
                        <text 
                          x="0" 
                          y="4" 
                          fill={theme.gold} 
                          fontSize="7" 
                          fontFamily="Cinzel, serif, SimSun" 
                          textAnchor="middle"
                          opacity="0.8"
                        >
                          {char}
                        </text>
                      </g>
                    );
                  })}

                  {/* Inner trigrams text ring */}
                  {["乾", "兑", "离", "震", "巽", "坎", "艮", "坤"].map((char, index, arr) => {
                    const angle = (index * 360) / arr.length;
                    const rad = (angle * Math.PI) / 180;
                    const x = 100 + 48 * Math.cos(rad);
                    const y = 100 + 48 * Math.sin(rad);
                    return (
                      <g key={index} transform={`translate(${x}, ${y}) rotate(${angle + 90})`}>
                        <text 
                          x="0" 
                          y="3" 
                          fill={theme.gold} 
                          fontSize="9" 
                          fontWeight="bold"
                          fontFamily="SimSun, serif" 
                          textAnchor="middle"
                        >
                          {char}
                        </text>
                        {/* Golden dot indicator */}
                        <circle cx="0" cy="-10" r="1.5" fill={theme.gold} />
                      </g>
                    );
                  })}

                  {/* Central Spindle */}
                  <circle cx="100" cy="100" r="12" fill="#1C1410" stroke={theme.gold} strokeWidth="1" />
                  <circle cx="100" cy="100" r="5" fill={theme.gold} />
                </svg>
              </div>

            </div>

            {/* Spin CTA Button */}
            <button 
              onClick={handleSpinCompass}
              disabled={isSpinning}
              style={{
                ...styles.button,
                marginTop: 0,
                width: '100%',
                maxWidth: '320px',
                background: isSpinning ? 'rgba(212,175,55,0.1)' : `linear-gradient(180deg, ${theme.gold} 0%, ${theme.darkGold} 100%)`,
                borderColor: isSpinning ? 'rgba(212,175,55,0.2)' : '#fff',
                color: isSpinning ? theme.gold : '#0F0B08',
                cursor: isSpinning ? 'default' : 'pointer'
              }}
            >
              {isSpinning ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> {isZh ? "乾坤轮转，星轨推演中..." : "Deriving Astral Alignment..."}
                </>
              ) : (
                <>
                  <Compass size={18} /> {isZh ? "启动罗盘 · 凝聚福运" : "Spin Compass · Align Fortune"}
                </>
              )}
            </button>

            {/* Oracle Result Panel */}
            <AnimatePresence mode="wait">
              {oracleIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    marginTop: '35px',
                    borderTop: '1px solid rgba(212,175,55,0.2)',
                    paddingTop: '25px',
                    width: '100%',
                    maxWidth: '650px'
                  }}
                >
                  <p style={{
                    fontSize: '1.2rem',
                    color: theme.gold,
                    fontStyle: 'italic',
                    fontFamily: '"Playfair Display", "Noto Serif", serif',
                    marginBottom: '10px',
                    lineHeight: '1.6'
                  }}>
                    {oracles[oracleIndex].text}
                  </p>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#888',
                    marginBottom: '15px',
                    textAlign: 'right'
                  }}>
                    {oracles[oracleIndex].source}
                  </p>
                  <div style={{
                    background: 'rgba(212, 175, 55, 0.05)',
                    border: `1px solid rgba(212,175,55,0.25)`,
                    padding: '15px 20px',
                    borderRadius: '2px',
                    textAlign: 'left'
                  }}>
                    <div style={{ 
                      color: theme.gold, 
                      fontWeight: 'bold', 
                      fontSize: '0.8rem', 
                      letterSpacing: '1px', 
                      marginBottom: '5px',
                      textTransform: 'uppercase'
                    }}>
                      <i className="fas fa-scroll"></i> {isZh ? "乾坤断语 (Destiny Decoded)" : "Canonical Decree"}
                    </div>
                    <p style={{ color: '#fff', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>
                      {oracles[oracleIndex].result}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </section>

      {/* 3. CORE PREDICTION SYSTEMS (三大天命传承体系) */}
      <section id="systems-section" style={{ 
        padding: '100px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: theme.gold, marginBottom: '10px' }}>
            <BookOpen size={18} />
            <span style={{ fontSize: '0.9rem', fontFamily: 'Cinzel, serif', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {isZh ? "学术正统 · 精准研判" : "The Canonical Foundation"}
            </span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
            fontFamily: 'Cinzel, serif', 
            color: '#fff',
            fontWeight: 600,
            letterSpacing: '1px',
            margin: 0
          }}>
            {isZh ? "三大古老命运测算脉络" : "The Three Pillars of Ancient Metaphysics"}
          </h2>
          <div style={{ width: '60px', height: '2px', background: theme.gold, margin: '20px auto 0 auto' }} />
        </div>

        {/* Replaced 10 raw graphic rows with 3 highly polished professional grid columns */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '35px',
          width: '100%'
        }} className="responsive-pillars-grid">
          
          {/* Pillar 1: Face & Palm Readings */}
          <motion.div
            whileHover={{ y: -8, borderColor: theme.gold }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: 'linear-gradient(135deg, rgba(25, 20, 15, 0.8) 0%, rgba(10, 8, 12, 0.95) 100%)',
              border: `1.5px solid rgba(212, 175, 55, 0.2)`,
              borderRadius: '4px',
              padding: '40px 30px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 35px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', gap: '12px', color: theme.gold, marginBottom: '25px' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '12px', borderRadius: '2px' }}>
                <Eye size={26} />
              </div>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '12px', borderRadius: '2px' }}>
                <Hand size={26} />
              </div>
            </div>

            <h3 style={{ 
              fontFamily: 'Cinzel, serif', 
              fontSize: '1.4rem', 
              color: theme.gold, 
              marginBottom: '15px',
              letterSpacing: '1px'
            }}>
              {isZh ? "乾坤相理学" : "Physiognomy & Chiromancy"}
            </h3>

            <p style={{ 
              color: '#bbb', 
              fontSize: '0.92rem', 
              lineHeight: '1.65', 
              textAlign: 'justify', 
              margin: 0,
              flexGrow: 1
            }}>
              {isZh ? (
                "整合面相学（Mianxiang）与手相学（Palmistry）之精髓。面相以《神相全编》、《公笃相法》为基准，提取面部108个关键坐标、十二宫轮廓，探寻其饱满与亏损，洞悉性格特质与财富容量。手相则高精度追踪感情线、智慧线、生命线、命运线的交错起伏，勾勒您的精力富裕度、智慧层次及一生转折。数字成像，实时断案，绝无玄虚。"
              ) : (
                "A meticulous merger of face structure reading (Mianxiang) and hand analysis (Chiromancy). Using classical landmarks mapped to the 'Twelve Palaces,' our system processes spatial distributions to determine inborn wealth capacity and potential life transitions. Simultaneously, palm trace analysis segments the major creases—Life, Heart, Wisdom, and Fate—providing immediate insight into vital reserves, intellect, and career epochs."
              )}
            </p>

            <button 
              onClick={onExplore}
              style={{
                background: 'transparent',
                border: 'none',
                color: theme.gold,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '30px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}
            >
              {isZh ? "开启相面测算" : "Scan Physiognomy"} <ArrowRight size={14} />
            </button>
          </motion.div>

          {/* Pillar 2: Birth Charts & Zi Wei Astrolabe */}
          <motion.div
            whileHover={{ y: -8, borderColor: theme.gold }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: 'linear-gradient(135deg, rgba(25, 20, 15, 0.8) 0%, rgba(10, 8, 12, 0.95) 100%)',
              border: `1.5px solid rgba(212, 175, 55, 0.2)`,
              borderRadius: '4px',
              padding: '40px 30px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 35px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', gap: '12px', color: theme.gold, marginBottom: '25px' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '12px', borderRadius: '2px' }}>
                <Compass size={26} />
              </div>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '12px', borderRadius: '2px' }}>
                <Sparkles size={26} />
              </div>
            </div>

            <h3 style={{ 
              fontFamily: 'Cinzel, serif', 
              fontSize: '1.4rem', 
              color: theme.gold, 
              marginBottom: '15px',
              letterSpacing: '1px'
            }}>
              {isZh ? "四柱八字与紫微斗数" : "Bazi & Celestial Astrologies"}
            </h3>

            <p style={{ 
              color: '#bbb', 
              fontSize: '0.92rem', 
              lineHeight: '1.65', 
              textAlign: 'justify', 
              margin: 0,
              flexGrow: 1
            }}>
              {isZh ? (
                "时间，即是能量。四柱八字（Bazi）基于您诞生的年、月、日、时干支坐标，推演先天阴阳格局。而紫微斗数（Zi Wei Dou Shu）作为古代极高精密的“帝王之学”，则是通过排布紫微、天府等百余颗星曜到十二命宫。我们将这两者相结合，解构您的喜用神所在、先天格局优劣、大运流年起伏，让您在岁月的浪潮中，顺势而为，因时制宜。"
              ) : (
                "Time itself is an energy footprint. Four Pillars (Bazi) decodes the celestial stems and earthly branches corresponding to your birth moment to define your innate spiritual configuration and 'useful elements' (Yong Shen). Coupled with Zi Wei Dou Shu, also known as the ancient 'Emperor Study,' we compile a comprehensive multi-dimensional natal chart that charts specific celestial transits over your macro career cycles."
              )}
            </p>

            <button 
              onClick={onExplore}
              style={{
                background: 'transparent',
                border: 'none',
                color: theme.gold,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '30px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}
            >
              {isZh ? "开启八字排盘" : "Chart Natal Bazi"} <ArrowRight size={14} />
            </button>
          </motion.div>

          {/* Pillar 3: Five Elements Balance & I Ching */}
          <motion.div
            whileHover={{ y: -8, borderColor: theme.gold }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: 'linear-gradient(135deg, rgba(25, 20, 15, 0.8) 0%, rgba(10, 8, 12, 0.95) 100%)',
              border: `1.5px solid rgba(212, 175, 55, 0.2)`,
              borderRadius: '4px',
              padding: '40px 30px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 35px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', gap: '12px', color: theme.gold, marginBottom: '25px' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '12px', borderRadius: '2px' }}>
                <Activity size={26} />
              </div>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '12px', borderRadius: '2px' }}>
                <BookOpen size={26} />
              </div>
            </div>

            <h3 style={{ 
              fontFamily: 'Cinzel, serif', 
              fontSize: '1.4rem', 
              color: theme.gold, 
              marginBottom: '15px',
              letterSpacing: '1px'
            }}>
              {isZh ? "五行平衡与易道乾坤" : "Wu Xing & I Ching Alchemy"}
            </h3>

            <p style={{ 
              color: '#bbb', 
              fontSize: '0.92rem', 
              lineHeight: '1.65', 
              textAlign: 'justify', 
              margin: 0,
              flexGrow: 1
            }}>
              {isZh ? (
                "天地乾坤，万物归宿于金、木、水、火、土之五行（Wu Xing）流动。任何能量盈余或亏缺，都会在面相及人生命运中折射。我们不仅算命，更重于“调命”。系统将精确量化计算您的五行比重，找出缺失之本。结合《周易》六十四卦的变易之道，为您定制最适宜的饮食、方位开运习惯、姓名笔画微调、甚至是随身佩戴的特定开运法宝，化煞生财，重构气运和谐。"
              ) : (
                "The cosmos operates through the endless flow of five elemental vectors: Wood, Fire, Earth, Metal, and Water. Energy deficits or congestion mirror directly in your physical form and path. Our core mission is harmonization. We numerically map your elemental ratios to uncover structural imbalances, offering tailored corrective strategies, diet recommendations, and canonical cures to recalibrate your field and channel luck."
              )}
            </p>

            <button 
              onClick={onExplore}
              style={{
                background: 'transparent',
                border: 'none',
                color: theme.gold,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '30px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}
            >
              {isZh ? "调理五行气场" : "Balance Five Elements"} <ArrowRight size={14} />
            </button>
          </motion.div>

        </div>
      </section>

      {/* 4. SCHOLARLY METHODOLOGY SECTION (严谨预测原理) */}
      <section style={{ 
        padding: '90px 20px', 
        background: '#0B0806',
        borderTop: `1px solid rgba(212, 175, 55, 0.1)`,
        borderBottom: `1px solid rgba(212, 175, 55, 0.1)`
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '55px' }}>
            <h2 style={{ 
              fontFamily: 'Cinzel, serif', 
              fontSize: '1.8rem', 
              color: theme.gold, 
              marginBottom: '10px' 
            }}>
              {isZh ? "严谨的命理演算步骤" : "Algorithmic Precision Matrix"}
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem' }}>
              {isZh ? "融合五千年古籍理论，通过现代神经网络架构实现客观推演" : "Transforming ancient scrolls into quantifiable patterns through advanced neural architectures"}
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '30px' 
          }}>
            {[
              {
                step: "01",
                icon: <Activity size={22} color={theme.gold} />,
                title: isZh ? "三维信息采集" : "Multidimensional Ingestion",
                desc: isZh ? "精确捕捉面部128个关键相格骨骼节点或手掌掌纹主线走向，同时收集高精度的时空（八字出生日期）与姓名文字信息。" : "Captures 128 anatomical landmarks from facial structures or palm creases, synchronized with solar-calendar chronological metadata."
              },
              {
                step: "02",
                icon: <BookOpen size={22} color={theme.gold} />,
                title: isZh ? "经典古籍校对" : "Canonical Treatises Cross-Reference",
                desc: isZh ? "将采集的生物与时空特征，与后台录入的《神相全编》、《麻衣神相》、《滴天髓》、《紫微斗数全书》等数百部经典古文库进行精细化映射。" : "Matches captured landmarks directly against specialized textual repositories of ancient treatises, interpreting physical indices purely via canonical texts."
              },
              {
                step: "03",
                icon: <TrendingUp size={22} color={theme.gold} />,
                title: isZh ? "五行比重测算" : "Wu Xing Ratio Computation",
                desc: isZh ? "计算出体内金、木、水、火、土之精确百分比占比。识别阻碍您运势发展的最弱或缺失之原色，确定您命局喜用神。" : "Calculates precise ratios of the Five Elements to identify structural energy blocks or missing elements (Yong Shen) holding back your growth."
              },
              {
                step: "04",
                icon: <Award size={22} color={theme.gold} />,
                title: isZh ? "输出改运方案" : "Actionable Remedies Output",
                desc: isZh ? "为您量身生成专属的未来运势走向报告，并针对缺失五行提供精确到饮食、开运色、作息与灵宝加持等全方位的平衡调理方案。" : "Generates a highly-personalized destiny path report, supplemented by detailed guidance for daily colors, directions, and physical amulets."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(212, 175, 55, 0.1)',
                  padding: '30px 20px',
                  borderRadius: '2px',
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '20px',
                  fontSize: '2rem',
                  fontFamily: 'Cinzel, serif',
                  fontWeight: 'bold',
                  color: 'rgba(212, 175, 55, 0.08)',
                  lineHeight: 1
                }}>
                  {item.step}
                </div>
                <div style={{ color: theme.gold, marginBottom: '15px' }}>
                  {item.icon}
                </div>
                <h4 style={{ 
                  color: '#fff', 
                  fontSize: '1.1rem', 
                  fontFamily: 'Cinzel, serif', 
                  marginBottom: '10px' 
                }}>
                  {item.title}
                </h4>
                <p style={{ 
                  color: '#999', 
                  fontSize: '0.85rem', 
                  lineHeight: '1.55', 
                  textAlign: 'justify', 
                  margin: 0 
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. PROFESSIONAL COMMITMENT & BADGES (学术严谨性背书) */}
      <section style={{ 
        padding: '80px 20px', 
        background: '#0F0B08',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '30px',
          textAlign: 'center'
        }} className="responsive-badges-grid">
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: theme.gold }}>
              <ShieldCheck size={32} />
            </div>
            <h5 style={{ color: '#fff', fontSize: '1.05rem', fontFamily: 'Cinzel, serif', marginBottom: '8px' }}>
              {isZh ? "隐私高标准保护" : "Secure Biometric Handling"}
            </h5>
            <p style={{ color: '#888', fontSize: '0.82rem', margin: 0, lineHeight: '1.5' }}>
              {isZh ? "所有上传的照片和生物特征信息皆经由本地高加密计算，服务器概不保存，确保隐私无虞。" : "All facial assets are processed in real-time under end-to-end memory buffers. Zero files are stored long-term on our servers."}
            </p>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: theme.gold }}>
              <BookOpen size={32} />
            </div>
            <h5 style={{ color: '#fff', fontSize: '1.05rem', fontFamily: 'Cinzel, serif', marginBottom: '8px' }}>
              {isZh ? "典籍出处考究" : "Canonical Faithfulness"}
            </h5>
            <p style={{ color: '#888', fontSize: '0.82rem', margin: 0, lineHeight: '1.5' }}>
              {isZh ? "分析语料及解词依据均严密考证《周易六十四卦》、《滴天髓》及《麻衣相法》等命学专著。" : "Interpretations correspond closely to classical treatises. No speculative or randomized mock answers."}
            </p>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: theme.gold }}>
              <Sparkles size={32} />
            </div>
            <h5 style={{ color: '#fff', fontSize: '1.05rem', fontFamily: 'Cinzel, serif', marginBottom: '8px' }}>
              {isZh ? "大师研判调理" : "Bespoke Taoist Guidance"}
            </h5>
            <p style={{ color: '#888', fontSize: '0.82rem', margin: 0, lineHeight: '1.5' }}>
              {isZh ? "提供深度的五行缺失补足方案、开运颜色配伍与灵宝阁开光物件指引，实现天人相融。" : "Provides precise five element cures, diet advice, and hand-crafted lucky artifacts designed to restore Qi."}
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION - BOTTOM PROMPT SECTION */}
      <section style={{ 
        padding: '100px 20px', 
        textAlign: 'center',
        background: 'linear-gradient(to bottom, #0F0B08, #23140F)',
        borderTop: `1px solid rgba(212, 175, 55, 0.15)`
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            fontFamily: 'Cinzel, serif', 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            color: theme.gold, 
            marginBottom: '1.5rem',
            letterSpacing: '2px',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}>
            {isZh ? "乾坤已备 · 只待君来" : "The Cosmic Matrix Awaits You"}
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#ccc', 
            marginBottom: '40px', 
            maxWidth: '650px', 
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            {isZh ? (
              "一朝解密，受益终身。点击下方按钮进入测算大厅，开启关于您的性格、事业大运、良缘归宿及五行平衡的深度探索之旅。"
            ) : (
              "Decode your cosmic map today and master your path. Step into our predictive hall to analyze your face, palm lines, and elemental ratios."
            )}
          </p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(212, 175, 55, 0.45)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onExplore}
            style={{
              ...styles.button,
              padding: '1.6rem 5rem',
              fontSize: '1.25rem',
              borderRadius: '0px',
              background: `linear-gradient(135deg, ${theme.gold}, ${theme.darkGold})`,
              border: `1.5px solid #FFF`,
              color: '#0F0B08',
              fontWeight: 'bold',
              letterSpacing: '3px'
            }}
          >
            {isZh ? "立即推演宿命" : "START PATH ANALYSIS"}
          </motion.button>
        </div>
      </section>

      {/* Custom responsive overrides */}
      <style>{`
        @media (max-width: 991px) {
          .responsive-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center !important;
          }
          .responsive-hero-grid div {
            text-align: center !important;
          }
          .hero-right-compass {
            display: none !important;
          }
          .responsive-pillars-grid {
            grid-template-columns: 1fr !important;
            gap: 25px !important;
          }
          .responsive-badges-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>

    </div>
  );
};
