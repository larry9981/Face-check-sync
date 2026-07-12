import React, { useState, useEffect, useRef } from 'react';
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
  ShieldCheck,
  Star,
  Users,
  Calendar
} from 'lucide-react';
import { HomepageConfig } from '../types';

interface LandingPageProps {
  t: any;
  onExplore: (type?: 'face' | 'palm' | 'shop') => void;
  homepageConfigs?: HomepageConfig[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ t, onExplore, homepageConfigs = [] }) => {
  const isZh = t.home === '首页' || t.title === '玄机面相';

  // State for Interactive Destiny Compass
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [oracleIndex, setOracleIndex] = useState<number | null>(null);

  // State for Live Oracle Desk
  const [clientName, setClientName] = useState('');
  const [clientGender, setClientGender] = useState<'male' | 'female'>('male');
  const [queryDimension, setQueryDimension] = useState<'career' | 'wealth' | 'love' | 'health'>('career');
  const [birthHour, setBirthHour] = useState('子时 (23:00 - 01:00)');
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultResult, setConsultResult] = useState<any | null>(null);

  const oracleRef = useRef<HTMLDivElement | null>(null);

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

  // Professional Scripture-backed predictions based on user inputs
  const liveOracles = {
    career: {
      verse: isZh ? "“潜龙勿用，阳气潜藏；或跃在渊，终至飞龙在天。” ——《易经·乾卦》" : '"Submerged dragon does not act. Or leaping in the abyss, eventually the dragon flies in heaven." — I Ching',
      explanation: isZh 
        ? "【事业天命命象】：当前星轨行至木星岁位，主事业处于潜龙在渊之变局。虽然暂时有浮云蔽日之扰，但你元气充沛。若能戒骄戒躁，专注于沉淀专业学养，未来三个月内必有北方贵人出手帮扶，冲破瓶颈，开启扶摇直上的大吉格局。"
        : "[CAREER DESTINY ORACLE]: Your temporal trajectory intersects the wood quadrant, denoting a 'latent breakthrough' phase. Although temporary fog shadows your vision, your core energetic balance remains intact. Focus on inward mastery; a guardian from the northern sector will initiate an pivotal advancement within ninety days.",
      remedy: isZh ? "【五行转运指南】：建议办公桌左侧摆放青铜开运器物，多着墨绿、深蓝衣饰以固木水之气。" : "[ELEMENTAL CALIBRATION]: Position a bronze or metallic artifact on the left side of your desk. Wearing deep jade or midnight blue colors stabilizes your rising trajectory."
    },
    wealth: {
      verse: isZh ? "“地势坤，君子以厚德载物。货殖之利，存乎诚与静。” ——《周易·坤卦》" : '"The terrain of the earth is receptive; the noble carrying all things with thick virtue." — I Ching',
      explanation: isZh 
        ? "【财富金匮命象】：你的命盘呈现‘土中蕴金’之偏财运势。正财沉稳，偏财暗动。然而，水气稍显不足，切记‘急躁必漏财’。未来在土行、金行行业（如不动产、精密器械或文化收藏）有小幅突破之机。务必坚守学术诚信，福报不求自得。"
        : "[FINANCIAL COFFER METAPHYSICS]: Your energetic profile displays a 'Gold in Soil' signature. While your core active income is stable, a speculative stream is brewing. However, elemental water deficiency suggests volatility in hurried deals. Professional alignment with earth and metal activities provides steady, heavy prosperity.",
      remedy: isZh ? "【五行聚财指南】：宜在居所东南方摆放白瓷或玉石葫芦，用以吸纳八方财气，调顺风水。" : "[FINANCIAL REMEDY]: Introduce white porcelain or jade figurines in the southeastern sector of your study to ground fluctuating monetary tides."
    },
    love: {
      verse: isZh ? "“两仪和合，乾坤交泰。相濡以沫，家门余庆。” ——《易经·咸卦》" : '"Yin and Yang in harmony. The cosmic pairing is receptive, bringing perpetual blessings." — I Ching',
      explanation: isZh 
        ? "【良缘宿命命象】：乾坤相吸，红鸾星动。对于已婚或有伴侣者，相濡以沫、互尊互谅，能极大化解命带劫财之磨难；对于单身者，下一次新月之时，星盘火行能量将与你的命宫交汇，易在学术、文化交流场所结识命中注定的知己，两情相悦，气运共享。"
        : "[RELATIONAL METAPHYSICS]: Red thread alignment. For committed profiles, cultivating mutual reverence acts as a canonical barrier against external discord. For single individuals, the upcoming lunar cycle stimulates your fire quadrant, favoring fateful matches within environments of art, history, or classical literature.",
      remedy: isZh ? "【气场调和指南】：卧房床头摆放天然紫水晶，有助稳固两仪磁场，招徕和合贵气。" : "[HARMONY REMEDY]: Install a natural purple quartz cluster near your headboard to neutralize friction and attract harmonious emotional frequencies."
    },
    health: {
      verse: isZh ? "“水木清华，肝肺调和。秋收冬藏，元气归元。” ——《黄帝内经》" : '"The liver and lungs are in harmony. Absorb in autumn, conserve in winter; primal Qi returns to source." — Yellow Emperor\'s Inner Canon',
      explanation: isZh 
        ? "【五行康泰命象】：五行之中，火金克制，木气偶有凝滞，容易导致心火上炎或肝气郁结。当前天时利于“藏”，不宜过度耗神。每日子时至丑时（23点至3点）乃肝胆排毒元气归原之金子时间，必须确保深度睡眠。顺应古法养生，自得松鹤之寿。"
        : "[VITALITY SPECTRUM]: Elemental friction between fire and metal occasionally restricts your wood flow, leading to internal heat and fatigue. Your current temporal cycle highly favors conservation. Circadian alignment—especially deep rest between 11 PM and 3 AM—restores primal liver Qi, building resilience.",
      remedy: isZh ? "【调理开运指南】：饮食宜增添天然酸、甘之物，随身佩戴沉香、檀木手串以宁神聚气。" : "[VITALITY REMEDY]: Enrich your diet with warming organic infusions. Adorning natural agarwood or sandalwood bracelets directly calms high-tension circadian pulses."
    }
  };

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
      const randomIndex = Math.floor(Math.random() * oracles.length);
      setOracleIndex(randomIndex);
    }, 2800);
  };

  const handleConsultOracle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) {
      alert(isZh ? "请输入测算者姓名以昭告天命。" : "Please enter a name for the celestial query.");
      return;
    }
    setIsConsulting(true);
    setConsultResult(null);

    setTimeout(() => {
      setIsConsulting(false);
      setConsultResult(liveOracles[queryDimension]);
      // Scroll to result smoothly
      setTimeout(() => {
        oracleRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2200);
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden', background: '#0F0B08', color: theme.text }}>
      
      {/* 1. ACADEMIC OBSERVATORY & HERO SECTION */}
      <section style={{ 
        minHeight: '85vh', 
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        background: 'radial-gradient(circle at 50% 40%, #20130E 0%, #080504 100%)',
        borderBottom: `1px solid rgba(212, 175, 55, 0.15)`
      }}>
        {/* Ancient stardust cosmic background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(2px 2px at 30px 40px, #D4AF37, rgba(0,0,0,0)), radial-gradient(2px 2px at 80px 120px, #fff, rgba(0,0,0,0)), radial-gradient(3px 3px at 150px 250px, rgba(212,175,55,0.4), rgba(0,0,0,0))',
          backgroundSize: '300px 300px',
          opacity: 0.25,
          pointerEvents: 'none'
        }} />

        <div style={{ 
          maxWidth: '1200px', 
          width: '100%', 
          display: 'grid', 
          gridTemplateColumns: '1.15fr 0.85fr', 
          gap: '50px', 
          alignItems: 'center',
          position: 'relative',
          zIndex: 5
        }} className="responsive-hero-grid">
          
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ textAlign: 'left' }}
          >
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              background: 'rgba(212, 175, 55, 0.08)', 
              padding: '6px 14px', 
              borderRadius: '0px', 
              border: `1px solid rgba(212, 175, 55, 0.3)`,
              marginBottom: '20px'
            }}>
              <Sparkles size={14} color={theme.gold} />
              <span style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '0.8rem', 
                letterSpacing: '2px', 
                color: theme.gold,
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                {isZh ? "五千年古典命理学正统传承 · 皇家科学推演" : "5,000 Years of Classical Metaphysics · Scientific Calculus"}
              </span>
            </div>

            <h1 style={{ 
              fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', 
              fontFamily: 'Cinzel, serif', 
              color: theme.gold, 
              lineHeight: '1.25',
              fontWeight: 700,
              marginBottom: '20px',
              letterSpacing: '1px'
            }}>
              {isZh ? "华夏古法天命传承" : "Imperial Astrological"}
              <br />
              <span style={{ color: '#fff' }}>
                {isZh ? "科学析命与未来昭示" : "Destiny Forecast"}
              </span>
            </h1>

            <p style={{ 
              fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', 
              color: '#DFDFD5', 
              lineHeight: '1.75', 
              marginBottom: '35px',
              maxWidth: '620px',
              textAlign: 'justify',
              fontFamily: 'Playfair Display, SimSun, serif'
            }}>
              {isZh ? (
                "我们摒弃世俗繁杂浮夸的图文混排，还原命理学术研究的纯粹与严肃。深度解构《周易》、《滴天髓》、《神相全编》等绝世典籍，结合现代高精密信息建模，从生物相理（面相与掌纹）、时空坐标（四柱八字）、星宿运转（紫微斗数）等唯物维度，为您还原最真实、客观、严谨的人生运势研判与五行调理指南。"
              ) : (
                "Restoring the rigorous, scientific dignity of ancient eastern destiny systems. By combining canonical treatises—such as the Book of Changes and Shenxiang Quanbian—with systematic biometric modeling, we extract facial palaces, palm traces, and natal coordinates to deliver objective, structured calculations of your temporal trajectory and vital energy states."
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
                {isZh ? "进入专业测算大厅" : "Enter Astro-Forecast Hall"} 
                <ArrowRight size={18} />
              </motion.button>

              <button
                onClick={() => {
                  const el = document.getElementById('consultation-desk');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  ...styles.secondaryButton,
                  margin: 0,
                  padding: '15px 30px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(0,0,0,0.5)',
                  borderColor: 'rgba(212, 175, 55, 0.4)',
                  color: theme.gold,
                  borderRadius: '0px',
                  cursor: 'pointer'
                }}
              >
                {isZh ? "即时天命推演" : "Instant Fate Query"}
              </button>
            </div>
          </motion.div>

          {/* Hero Right: Classic Spinning Bagua Astrolabe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
            className="hero-right-compass"
          >
            {/* Ambient gold rings */}
            <div style={{
              position: 'absolute',
              width: '340px',
              height: '340px',
              border: '1px dashed rgba(212, 175, 55, 0.12)',
              borderRadius: '50%',
              animation: 'spin 80s linear infinite'
            }} />
            <div style={{
              position: 'absolute',
              width: '280px',
              height: '280px',
              border: '1px solid rgba(212, 175, 55, 0.08)',
              borderRadius: '50%',
              animation: 'spin 50s linear infinite reverse'
            }} />
            
            {/* Bagua Vector Map */}
            <div style={{
              width: '240px',
              height: '240px',
              opacity: 0.45,
              animation: 'spin 40s linear infinite',
              filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.2))'
            }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="48" fill="none" stroke={theme.gold} strokeWidth="0.8" />
                <circle cx="50" cy="50" r="41" fill="none" stroke={theme.gold} strokeWidth="0.5" strokeDasharray="3,3" />
                <circle cx="50" cy="50" r="28" fill="none" stroke={theme.gold} strokeWidth="0.5" />
                
                {/* Axes */}
                <line x1="50" y1="2" x2="50" y2="98" stroke={theme.gold} strokeWidth="0.2" strokeOpacity="0.4" />
                <line x1="2" y1="50" x2="98" y2="50" stroke={theme.gold} strokeWidth="0.2" strokeOpacity="0.4" />
                
                {/* Trigrams */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
                  const rad = (angle * Math.PI) / 180;
                  const x = 50 + 34 * Math.cos(rad);
                  const y = 50 + 34 * Math.sin(rad);
                  return (
                    <g key={idx} transform={`translate(${x},${y}) rotate(${angle + 90})`}>
                      <line x1="-3" y1="-2" x2="3" y2="-2" stroke={theme.gold} strokeWidth="0.7" />
                      {idx % 2 === 0 ? (
                        <line x1="-3" y1="0" x2="3" y2="0" stroke={theme.gold} strokeWidth="0.7" />
                      ) : (
                        <>
                          <line x1="-3" y1="0" x2="-0.8" y2="0" stroke={theme.gold} strokeWidth="0.7" />
                          <line x1="0.8" y1="0" x2="3" y2="0" stroke={theme.gold} strokeWidth="0.7" />
                        </>
                      )}
                      <line x1="-3" y1="2" x2="3" y2="2" stroke={theme.gold} strokeWidth="0.7" />
                    </g>
                  );
                })}

                {/* Yin Yang Core */}
                <path d="M 50,22 A 14,14 0 0,0 50,50 A 14,14 0 0,1 50,78 A 28,28 0 0,1 50,22 Z" fill={theme.gold} fillOpacity="0.15" />
                <circle cx="50" cy="36" r="2.5" fill={theme.gold} fillOpacity="0.4" />
                <circle cx="50" cy="64" r="2.5" fill="none" stroke={theme.gold} strokeWidth="0.5" />
              </svg>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. MYSTICAL METAPHYSICAL BANNERS (玄道开运锦囊 - Replaces Enter Natal Attributes) */}
      <section id="mystical-banners" style={{ 
        padding: '80px 20px', 
        background: '#070504',
        borderBottom: `1px solid rgba(212, 175, 55, 0.1)`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient background glows */}
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)', top: '10%', left: '5%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(147, 51, 234, 0.03) 0%, transparent 70%)', bottom: '5%', right: '5%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: theme.gold, marginBottom: '10px' }}>
              <Sparkles size={16} />
              <span style={{ fontSize: '0.85rem', fontFamily: 'Cinzel, serif', letterSpacing: '2px', textTransform: 'uppercase' }}>
                {isZh ? "五行气场 · 天机秘传" : "The Celestial Qi & Mystic Stems"}
              </span>
            </div>
            <h2 style={{ 
              fontFamily: 'Cinzel, serif', 
              fontSize: '2.4rem', 
              color: theme.gold, 
              marginBottom: '15px',
              letterSpacing: '1px',
              textShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
            }}>
              {isZh ? "神妙开运气场 · 命理御守" : "Spiritual Guardians & Feng Shui Banners"}
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6', fontFamily: 'SimSun, serif' }}>
              {isZh ? (
                "调和阴阳乾坤，纳吉避凶。点击下方各大秘宝，即刻启动高精密 AI 面相/手相批命或寻访五行开运灵宝。"
              ) : (
                "Harmonize your earthly path and cosmic elements. Select a mystical domain below to trigger deep predictive readings or consult elemental spiritual protectors."
              )}
            </p>
          </div>

          {/* Three Gorgeous Metaphysical Banners */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            marginTop: '20px'
          }}>
            {[
              {
                id: 'face',
                titleZh: "乾坤面相 · 气数流转",
                titleEn: "Celestial Mianxiang: Aura Flow",
                descZh: "面刻三世因果，眼藏神气盛衰。高精密 AI 扫描面部骨相与五岳比例，窥见天命。",
                descEn: "Your facial features map three lifetimes of karma. Scan five sensory areas to interpret deep character traits & current fortune.",
                btnZh: "立即面相测算",
                btnEn: "Scan Face Reading",
                imgPrompt: "gorgeous mystical ancient taoist mountain peak with glowing golden qi energy flows, starry sky, deep purple nebula, watercolor ink style, 16:9, cinematic lighting",
                action: () => onExplore('face')
              },
              {
                id: 'palm',
                titleZh: "掌纹天机 · 命元轨迹",
                titleEn: "Sacred Palmistry: Lifeline Destiny",
                descZh: "手揽日月星辰，纹显命格起伏。AI 捕捉生命线、智慧线、感情线之微妙交错。",
                descEn: "Grasp the solar and lunar starlight. AI processes intersections of the life, head, heart, and fate lines with pixel-level precision.",
                btnZh: "立即手相测算",
                btnEn: "Scan Palm Reading",
                imgPrompt: "spiritual celestial glowing hands with golden lines of destiny, sacred geometry constellations, high fantasy digital painting, deep violet and gold starry space, 16:9",
                action: () => onExplore('palm')
              },
              {
                id: 'shop',
                titleZh: "五行灵宝 · 气场调理",
                titleEn: "Spiritual Guardians: Feng Shui Charms",
                descZh: "依循先天生辰，查漏五行盈缺。迎请朱砂、黑曜石及开光灵宝，辟邪纳福。",
                descEn: "Calculate your missing elemental energy. Invite natural crystals, cinnabar pendants, and consecrated charms to align your space's harmony.",
                btnZh: "寻访开运灵宝",
                btnEn: "Visit Spiritual Shop",
                imgPrompt: "gorgeous sacred zen water fountain with glowing crystal quartz, feng shui garden, starry night, misty ancient oriental courtyard, cinematic light, 16:9",
                action: () => onExplore('shop')
              }
            ].map((banner, index) => {
              const bgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(banner.imgPrompt)}?width=400&height=250&nologo=true&seed=${index + 88}`;
              return (
                <div 
                  key={banner.id}
                  style={{
                    position: 'relative',
                    background: '#0B0806',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    height: '380px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '25px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.7), inset 0 0 20px rgba(212,175,55,0.03)',
                    transition: 'all 0.3s ease',
                  }}
                  className="hover:border-amber-400 group cursor-pointer"
                  onClick={banner.action}
                >
                  {/* Background Image with hover zoom */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={bgUrl} 
                      alt={banner.titleEn}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                      className="group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Shadow overlay to make text highly legible */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(6, 4, 3, 0.95) 0%, rgba(6, 4, 3, 0.6) 50%, rgba(6, 4, 3, 0.1) 100%)',
                    }} />
                  </div>

                  {/* Text Contents */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h3 style={{
                      color: theme.gold,
                      fontSize: '1.35rem',
                      fontFamily: 'Cinzel, serif, SimSun',
                      fontWeight: 'bold',
                      margin: '0 0 10px 0',
                      textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(212,175,55,0.3)'
                    }}>
                      {isZh ? banner.titleZh : banner.titleEn}
                    </h3>
                    <p style={{
                      color: '#ddd',
                      fontSize: '0.88rem',
                      lineHeight: '1.5',
                      margin: '0 0 20px 0',
                      fontFamily: isZh ? 'SimSun, serif' : 'inherit',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      {isZh ? banner.descZh : banner.descEn}
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); banner.action(); }}
                      style={{
                        ...styles.button,
                        padding: '10px 20px',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: `1px solid ${theme.gold}`,
                        background: 'linear-gradient(180deg, rgba(212,175,55,0.2) 0%, rgba(138,110,47,0.4) 100%)',
                        color: '#fff',
                        cursor: 'pointer',
                        width: 'auto',
                        minWidth: 'auto',
                        boxShadow: '0 4px 10px rgba(212,175,55,0.1)'
                      }}
                      className="hover:bg-amber-500/30 group-hover:scale-105"
                    >
                      <span>{isZh ? banner.btnZh : banner.btnEn}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. FOUR CANONICAL ACADEMIC FOUNDATIONS (四大学术正统传承) */}
      <section style={{ 
        padding: '100px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: theme.gold, marginBottom: '10px' }}>
            <BookOpen size={16} />
            <span style={{ fontSize: '0.85rem', fontFamily: 'Cinzel, serif', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {isZh ? "学术正统 · 绝无玄虚" : "THE CANONICAL SCHOLARSHIP"}
            </span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', 
            fontFamily: 'Cinzel, serif', 
            color: '#fff',
            fontWeight: 600,
            letterSpacing: '1px',
            margin: 0
          }}>
            {isZh ? "四大古典命运测算学术主脉" : "The Four Pillars of Metaphysical Research"}
          </h2>
          <div style={{ width: '50px', height: '1.5px', background: theme.gold, margin: '20px auto 0 auto' }} />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '30px',
          width: '100%'
        }} className="responsive-pillars-grid">
          
          {/* Pillar 1 */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.02)',
            border: `1px solid rgba(212, 175, 55, 0.15)`,
            padding: '35px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.08)', padding: '10px', color: theme.gold }}>
                <Eye size={24} />
              </div>
              <h3 style={{ margin: 0, fontFamily: 'Cinzel, serif', fontSize: '1.3rem', color: theme.gold }}>
                {isZh ? "古典相理学 (面相与手相)" : "Traditional Physiognomy"}
              </h3>
            </div>
            <p style={{ color: '#bbb', fontSize: '0.9rem', lineHeight: '1.65', textAlign: 'justify', margin: 0, fontFamily: 'SimSun, serif' }}>
              {isZh ? (
                "以相学术典籍《神相全编》、《麻衣相法》为骨架。我们的算法高精度追踪面部的一百零八个关键生物特征点，提取十二宫（命宫、财帛、官禄等）的轮廓。手相部分则对感情、智慧、生命、命运三大主线进行断点与走势识别，客观解析 querent 的性格、骨骼精力及生财容纳。相由心生，指纹命定，数据为证。"
              ) : (
                "Guided strictly by classical textbooks of physiognomy such as 'Shenxiang Quanbian'. The system captures facial spatial proportions to analyze individual palaces (Life, Wealth, Career, and Marriage). It maps genetic contours to outline querents' base health status and capacity for stress management."
              )}
            </p>
          </div>

          {/* Pillar 2 */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.02)',
            border: `1px solid rgba(212, 175, 55, 0.15)`,
            padding: '35px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.08)', padding: '10px', color: theme.gold }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ margin: 0, fontFamily: 'Cinzel, serif', fontSize: '1.3rem', color: theme.gold }}>
                {isZh ? "四柱八字先天运盘" : "Stems & Branches Bazi"}
              </h3>
            </div>
            <p style={{ color: '#bbb', fontSize: '0.9rem', lineHeight: '1.65', textAlign: 'justify', margin: 0, fontFamily: 'SimSun, serif' }}>
              {isZh ? (
                "时间即是重力，宇宙重力决定五行流动。四柱八字利用Querent诞生之年、月、日、时对应的天干地支，计算出其先天气场状态。通过精细演算大运流年与日干的关系，找出最核心的‘喜用神’，在人生的周期波动中，提供趋吉避凶、进退自如的绝佳战略节点建议。"
              ) : (
                "Formulates the cosmic energy imprint from the precise solar coordinates of your birth time. We construct your primary Eight Characters matrix (Bazi) to locate the crucial Balancing Element (Yong Shen). This maps specific chronological trajectories to determine career and resource tides."
              )}
            </p>
          </div>

          {/* Pillar 3 */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.02)',
            border: `1px solid rgba(212, 175, 55, 0.15)`,
            padding: '35px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.08)', padding: '10px', color: theme.gold }}>
                <Star size={24} />
              </div>
              <h3 style={{ margin: 0, fontFamily: 'Cinzel, serif', fontSize: '1.3rem', color: theme.gold }}>
                {isZh ? "紫微斗数帝王星盘" : "Zi Wei Dou Shu Astrolabe"}
              </h3>
            </div>
            <p style={{ color: '#bbb', fontSize: '0.9rem', lineHeight: '1.65', textAlign: 'justify', margin: 0, fontFamily: 'SimSun, serif' }}>
              {isZh ? (
                "紫微斗数为华夏古代极具精密度的‘帝王学’。通过排布北斗、南斗百余颗主客星曜至您的十二命宫（如兄弟、夫妻、子女、福德等），以紫微星为中枢，精确展现命盘一生的社会层级、六亲因缘、大限变数。其繁复精密，乃数字推演天命之最佳底层工具。"
              ) : (
                "Often referred to as the 'Emperor Study' of metaphysics. Zi Wei Dou Shu constructs a highly elaborate chart mapping 108 celestial transits across 12 distinct palaces of social existence. This provides queried profiles with deep character matrices and relational forecasts."
              )}
            </p>
          </div>

          {/* Pillar 4 */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.02)',
            border: `1px solid rgba(212, 175, 55, 0.15)`,
            padding: '35px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.08)', padding: '10px', color: theme.gold }}>
                <Compass size={24} />
              </div>
              <h3 style={{ margin: 0, fontFamily: 'Cinzel, serif', fontSize: '1.3rem', color: theme.gold }}>
                {isZh ? "易理乾坤与五行平衡" : "Wu Xing Harmony & Remedies"}
              </h3>
            </div>
            <p style={{ color: '#bbb', fontSize: '0.9rem', lineHeight: '1.65', textAlign: 'justify', margin: 0, fontFamily: 'SimSun, serif' }}>
              {isZh ? (
                "我们不仅算命，更看重五行能量场的健康平衡。通过计算，量化解析您命格中金、木、水、火、土之多寡盈缺。根据《易经》六十四卦的生克变化之道，提供从饮食、居住方向选择、随身配伍法宝到心理调理等一站式开运指南，化煞生旺，调顺全身元气磁场。"
              ) : (
                "We calculate numerical proportions of Earth, Water, Metal, Wood, and Fire within your profile. System algorithms cross-check these proportions with classic hexagram rules of change, outputting real, actionable remedies to restore stable energetic reserves."
              )}
            </p>
          </div>

        </div>
      </section>

      {/* 4. ANCIENT COMPASS BRONZE SANDBOX (司南调气盘) */}
      <section style={{ 
        padding: '100px 20px', 
        background: '#0B0806',
        borderTop: `1px solid rgba(212, 175, 55, 0.1)`,
        borderBottom: `1px solid rgba(212, 175, 55, 0.1)`
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ marginBottom: '45px' }}>
            <h2 style={{ 
              fontFamily: 'Cinzel, serif', 
              fontSize: '2rem', 
              color: theme.gold, 
              marginBottom: '15px',
              letterSpacing: '1px'
            }}>
              {isZh ? "乾坤开运青铜司南星盘" : "The Astrolabe of Cosmic Alignment"}
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6', fontFamily: 'SimSun, serif' }}>
              {isZh ? (
                "点击启动古法青铜司南，排除杂念，调理气场。罗盘停止转动之时，便是乾坤定位、吉兆宣示之刻，获取属于您的当下箴言。"
              ) : (
                "Focus your mind and click below to align your energy coordinates with the rotating Astrolabe. Tap to spin and receive an instant canonical counsel."
              )}
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, rgba(20, 15, 10, 0.95) 0%, rgba(5, 4, 3, 0.98) 100%)',
            border: `1.5px solid ${theme.darkGold}`,
            padding: '50px 30px',
            borderRadius: '0px',
            boxShadow: '0 15px 50px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            
            {/* Compass Wheel */}
            <div style={{ position: 'relative', width: '280px', height: '280px', marginBottom: '40px' }}>
              
              {/* Pointer Needle */}
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

              {/* Disk rotation */}
              <div style={{
                width: '100%',
                height: '100%',
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 2.8s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none',
                position: 'relative'
              }}>
                <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
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
                          fontFamily="SimSun, serif" 
                          textAnchor="middle"
                          opacity="0.8"
                        >
                          {char}
                        </text>
                      </g>
                    );
                  })}

                  {/* Inner trigrams */}
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
                        <circle cx="0" cy="-10" r="1.5" fill={theme.gold} />
                      </g>
                    );
                  })}

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
                cursor: isSpinning ? 'default' : 'pointer',
                borderRadius: '0px'
              }}
            >
              {isSpinning ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> {isZh ? "五行逆转，推衍星轨..." : "Calibrating Astrolabe..."}
                </>
              ) : (
                <>
                  <Compass size={18} /> {isZh ? "旋转罗盘 · 调理五行" : "Spin astrolabe · Calibrate Luck"}
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
                    borderTop: '1px solid rgba(212,175,55,0.15)',
                    paddingTop: '25px',
                    width: '100%',
                    maxWidth: '650px',
                    fontFamily: 'SimSun, serif'
                  }}
                >
                  <p style={{
                    fontSize: '1.2rem',
                    color: theme.gold,
                    fontStyle: 'italic',
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
                    background: 'rgba(212, 175, 55, 0.04)',
                    border: `1px solid rgba(212,175,55,0.2)`,
                    padding: '15px 20px',
                    borderRadius: '0px',
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
                      <i className="fas fa-scroll"></i> {isZh ? "罗盘示兆" : "Astrolabe Decree"}
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

      {/* 5. ETHICAL STANDARDS & RIGOR CREDENTIALS (学术严谨性背书) */}
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
              {isZh ? "最高规格隐私保护" : "Secure Biometric Protection"}
            </h5>
            <p style={{ color: '#888', fontSize: '0.82rem', margin: 0, lineHeight: '1.5', fontFamily: 'SimSun, serif' }}>
              {isZh ? "所有上传的照片和生物特征参数只做瞬时内存计算，绝不在任何服务器留存，确保您的相理隐私安全无虞。" : "All bio-imaging is calculated within sandboxed buffers. Zero facial media remains stored in our data centers."}
            </p>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: theme.gold }}>
              <BookOpen size={32} />
            </div>
            <h5 style={{ color: '#fff', fontSize: '1.05rem', fontFamily: 'Cinzel, serif', marginBottom: '8px' }}>
              {isZh ? "经史典籍考证" : "Canonical Authenticity"}
            </h5>
            <p style={{ color: '#888', fontSize: '0.82rem', margin: 0, lineHeight: '1.5', fontFamily: 'SimSun, serif' }}>
              {isZh ? "测算库由资深华夏古典哲学研究团队编写，解说依据均可严密上溯经典命学专著，严防江湖杜撰。" : "Forecast scripts represent centuries of traditional eastern scholarship, derived without speculative or randomized fillers."}
            </p>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: theme.gold }}>
              <Sparkles size={32} />
            </div>
            <h5 style={{ color: '#fff', fontSize: '1.05rem', fontFamily: 'Cinzel, serif', marginBottom: '8px' }}>
              {isZh ? "五行能量平衡" : "Holistic Harmony Guidance"}
            </h5>
            <p style={{ color: '#888', fontSize: '0.82rem', margin: 0, lineHeight: '1.5', fontFamily: 'SimSun, serif' }}>
              {isZh ? "不仅研命，更注重能量之圆满。提供精确的五行缺失补配，指导 Querent 气场之和谐。" : "Focuses heavily on balance. We deliver tailored calibration guidelines including elements adjustments to align your fields."}
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION - BOTTOM PROMPT SECTION */}
      <section style={{ 
        padding: '100px 20px', 
        textAlign: 'center',
        background: 'linear-gradient(to bottom, #0F0B08, #20130E)',
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
            {isZh ? "参悟玄机 · 自得泰然" : "Map Your Cosmic Horizon"}
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#ccc', 
            marginBottom: '40px', 
            maxWidth: '650px', 
            margin: '0 auto 40px auto',
            lineHeight: '1.6',
            fontFamily: 'SimSun, serif'
          }}>
            {isZh ? (
              "天行有常，顺势而为。点击下方按钮，进入我们为您准备的高精密古典命理测算殿堂，参透属于您的未来大运走向。"
            ) : (
              "Nature follows constant cycles. Step inside our observation hall to query pixel-precise face structural analysis and elemental balances."
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
            {isZh ? "开启天命大运推演" : "START FULL FORECAST"}
          </motion.button>
        </div>
      </section>

      {/* Responsive mobile adjustments */}
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
