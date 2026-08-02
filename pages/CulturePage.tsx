import React, { useState, useEffect, useMemo } from 'react';
import { theme, styles } from '../theme';
import { CULTURE_ARTICLES, Article } from '../data/cultureArticles';
import { getArticleContent } from '../data/articleTranslator';
import { Article2DDiagram } from '../components/Article2DDiagram';

interface CulturePageProps {
  language: string;
  onNavigateHome?: () => void;
  onStartAnalysis?: (type: 'face' | 'palm' | 'both', articleId?: string) => void;
  initialArticleId?: string | null;
  onArticleChange?: (articleId: string | null) => void;
}

const TAG_MAP_EN: Record<string, string> = {
  // Physiognomy & Facial Features
  '面相学': 'Physiognomy',
  '事业运': 'Career Destiny',
  '天庭': 'Forehead',
  '官禄宫': 'Career Palace',
  '眉毛面相': 'Eyebrow Reading',
  '眉毛': 'Eyebrows',
  '保寿官': 'Longevity Palace',
  '人际关系': 'Interpersonal Relations',
  '兄弟宫': 'Siblings Palace',
  '眼睛面相': 'Eye Reading',
  '监察官': 'Inspection Palace',
  '眼神': 'Gaze & Focus',
  '神气': 'Vital Aura',
  '财帛宫': 'Wealth Palace',
  '鼻子面相': 'Nose Reading',
  '财运': 'Financial Luck',
  '守财': 'Wealth Retention',
  '下巴面相': 'Chin & Jaw',
  '地阁': 'Jaw Court',
  '晚年运': 'Later Life Destiny',
  '嘴唇': 'Lips',
  '唇齿': 'Lips & Teeth',
  '人中': 'Philtrum',
  '夫妻宫': 'Spouse Palace',
  '婚姻运': 'Marital Luck',
  '家族运': 'Family Heritage',
  '三庭五眼': 'Three Courts & Five Eyes',
  '面相比例': 'Facial Proportions',
  '早年运': 'Early Life Fortune',
  '中年运': 'Mid-Life Destiny',
  '痣相': 'Facial Moles',
  '眉中藏珠': 'Hidden Gem Mole',
  '吉痣': 'Auspicious Moles',
  '财运痣': 'Wealth Moles',

  // Palmistry & Lines
  '手相学': 'Palmistry',
  '生命线': 'Life Line',
  '智慧线': 'Head Line',
  '感情线': 'Heart Line',
  '事业线': 'Fate Line',
  '命运线': 'Destiny Line',
  '太阳线': 'Sun Line',
  '成功线': 'Success Line',
  '通天纹': 'Celestial Palm Line',
  '名望': 'Fame & Prestige',
  '掌丘': 'Palm Mounts',
  '手掌丘陵': 'Palm Mounts',
  '掌纹': 'Palm Lines',
  '金星丘': 'Venus Mount',
  '木星丘': 'Jupiter Mount',
  '水星丘': 'Mercury Mount',
  '元气': 'Vital Qi Energy',
  '岛纹': 'Island Patterns',
  '掌纹化解': 'Palm Line Remedy',
  '后天开运': 'Destiny Enhancement',
  '气血调理': 'Vitality Balance',
  '双相互证': 'Dual Biometrics',
  '面手双证': 'Face & Palm Dual Verification',
  '职业规划': 'Career Pathing',
  '思维模式': 'Mindset Pattern',
  '决断力': 'Decision Power',
  '姻缘': 'Love Affinity',
  '情感智商': 'Emotional IQ',
  '婚姻手相': 'Marriage Palmistry',
  '转折点': 'Turning Points',
  '年龄预测': 'Age Timeline',
  '能量补足': 'Energy Replenishment',

  // Five Elements & Feng Shui
  '五行': 'Five Elements',
  '五行调理': 'Five Elements Remedies',
  '五行缺失': 'Elemental Deficiency',
  '喜用神': 'Favorable Element',
  '开运补足': 'Auspicious Balancing',
  '能量平衡': 'Energy Equilibrium',
  '风水': 'Feng Shui',
  '家居风水': 'Home Feng Shui',
  '居家风水': 'Residential Feng Shui',
  '明财位': 'Primary Wealth Corner',
  '聚气': 'Qi Energy Assembly',
  '客厅风水': 'Living Room Feng Shui',
  '办公风水': 'Office Feng Shui',
  '办公室': 'Workplace',
  '青龙白虎': 'Dragon & Tiger Balance',
  '职场贵人': 'Career Mentors',
  '防小人': 'Shielding Misfortune',
  '玄关风水': 'Entryway Feng Shui',
  '纳气口': 'Qi Intake Portal',
  '阳宅环境': 'Residential Environment',
  '家居气场': 'Home Aura Field',
  '开运方位': 'Lucky Compass Directions',
  '方位吉凶': 'Compass Directions',
  '五行喜忌': 'Elemental Compatibility',
  '地理风水': 'Geomantic Feng Shui',
  '发展方向': 'Strategic Direction',
  '卧室风水': 'Bedroom Feng Shui',
  '睡眠质量': 'Sleep Quality',
  '安神气场': 'Tranquil Aura Field',
  '健康理疗': 'Wellness & Balance',
  '色彩': 'Color Harmony',
  '颜色五行': 'Color Five Elements',
  '穿搭开运': 'Auspicious Fashion',
  '喜用神颜色': 'Lucky Element Colors',
  '水晶': 'Crystal Resonance',
  '水晶能量': 'Crystal Energy',
  '黑曜石': 'Obsidian Crystal',
  '和田玉': 'Imperial Hetian Jade',
  '生物磁场': 'Biometric Field',
  '能量磁场': 'Energy Field',

  // Zodiac, Bazi & Calendar
  '2026丙午年': '2026 Fire Horse Year',
  '赤马年': 'Red Fire Horse Year',
  '十二生肖': 'Twelve Zodiac Signs',
  '生肖': 'Zodiac',
  '流年运势': 'Annual Horoscope',
  '生肖六合': 'Six Zodiac Harmonies',
  '生肖三合': 'Three Zodiac Combinations',
  '贵人磁场': 'Mentor Attraction',
  '合伙创业': 'Business Partnership',
  '八字': 'Bazi Chart',
  '八字入门': 'Bazi Basics',
  '四柱命理': 'Four Pillars Astrology',
  '日干': 'Day Master',
  '人生坐标': 'Life Blueprint Coordinates',
  '犯太岁': 'Clash with Tai Sui',
  '值太岁': 'Presiding Tai Sui',
  '冲太岁': 'Direct Clash Tai Sui',
  '太岁': 'Tai Sui Guardian',
  '开运护身符': 'Auspicious Amulet',
  '十天干': 'Ten Heavenly Stems',
  '天干': 'Heavenly Stems',
  '甲木': 'Yang Wood (Jia)',
  '丙火': 'Yang Fire (Bing)',
  '庚金': 'Yang Metal (Geng)',
  '性格底色': 'Core Personality Base',
  '十神': 'Ten Gods Archetypes',
  '正财偏财': 'Direct & Indirect Wealth',
  '正官七杀': 'Authority & Challenger Gods',
  '命理格局': 'Destiny Structure',
  '大运': 'Major Luck Cycles',
  '大运交接': 'Luck Cycle Transition',
  '人生转折': 'Life Milestone Shifts',
  '顺势而为': 'Flow with Destiny',
  '吉祥物原理': 'Amulet Mechanics',
  '开运饰品': 'Fortune Accessories',
  '微电场': 'Micro Electro-Magnetic Field',
  '符文共振': 'Talismanic Resonance',

  // Astrology & Numerology
  '水星逆行': 'Mercury Retrograde',
  '星座指南': 'Zodiac Horoscope',
  '沟通契约': 'Contracts & Communication',
  '复盘反思': 'Review & Reflection',
  '上升星座': 'Rising Sign (Ascendant)',
  '星盘': 'Astrological Natal Chart',
  '第一印象': 'First Impression',
  '人格面具': 'Persona Mask',
  '月亮星座': 'Moon Sign',
  '潜意识': 'Subconscious Mind',
  '安全感': 'Emotional Security',
  '情绪疗愈': 'Emotional Healing',

  // I Ching & Ancient Strategy
  '易经': 'I Ching',
  '六十四卦': '64 Hexagrams',
  '二进制思维': 'Binary Matrix Logic',
  '现代决策': 'Modern Decision Making',
  '奇门遁甲': 'Qi Men Dun Jia',
  '帝王之学': 'Royal Strategic Science',
  '择日择方': 'Auspicious Timing & Location',
  '商业谈判': 'High-Stakes Negotiation',
  '紫微斗数': 'Zi Wei Dou Shu',
  '十二宫位': 'Twelve Life Palaces',
  '命宫': 'Self Palace',
  '紫微星': 'Emperor Star (Zi Wei)',
  '同步性': 'Synchronicity',
  '共时性': 'Synchronicity',
  '荣格': 'Carl Jung',
  '宇宙信号': 'Cosmic Signals',
  '心灵感应': 'Telepathic Resonance',

  // AI & Metaphysics
  'AI命理': 'AI Destiny Analytics',
  'AI玄学': 'AI Metaphysics',
  'AI': 'AI Technology',
  '算法准确度': 'Algorithm Precision',
  '天机之眼': 'TianJiEyes Platform',
  '科技命理': 'Tech-Driven Destiny',
  '高精度分析': 'High-Precision Analytics'
};

export const CulturePage: React.FC<CulturePageProps> = ({
  language,
  onNavigateHome,
  onStartAnalysis,
  initialArticleId,
  onArticleChange
}) => {
  const isZh = language.startsWith('zh');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [articlesList, setArticlesList] = useState<Article[]>(CULTURE_ARTICLES);
  const [activeArticle, setActiveArticle] = useState<Article | null>(() => {
    if (initialArticleId) {
      return CULTURE_ARTICLES.find(a => a.id === initialArticleId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (initialArticleId) {
      const found = articlesList.find(a => a.id === initialArticleId);
      if (found) {
        setActiveArticle(found);
      }
    }
  }, [initialArticleId, articlesList]);

  const handleSetArticle = (art: Article | null) => {
    setActiveArticle(art);
    if (onArticleChange) {
      onArticleChange(art ? art.id : null);
    }
  };

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setArticlesList(data);
        }
      })
      .catch(err => console.error("Failed to fetch live articles:", err));
  }, []);

  const categories = useMemo(() => {
    return [
      { id: 'ALL', label: isZh ? `全部文章 (${articlesList.length})` : `All Articles (${articlesList.length})` },
      { id: '面相识人', label: isZh ? '面相识人' : 'Physiognomy' },
      { id: '手相掌纹', label: isZh ? '手相掌纹' : 'Palmistry' },
      { id: '五行风水', label: isZh ? '五行风水' : 'Feng Shui' },
      { id: '生肖八字', label: isZh ? '生肖八字' : 'Zodiac & Bazi' },
      { id: '星象星座', label: isZh ? '星象星座' : 'Astrology' },
      { id: '易经奇门', label: isZh ? '易经奇门' : 'I Ching & Strategy' },
    ];
  }, [isZh, articlesList.length]);

  const filteredArticles = useMemo(() => {
    return articlesList.filter(art => {
      const matchCat = selectedCategory === 'ALL' || art.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchCat;

      const titleMatch = (isZh ? art.title : (art.titleEn || art.title)).toLowerCase().includes(query);
      const summaryMatch = (isZh ? art.summary : (art.summaryEn || art.summary)).toLowerCase().includes(query);
      const tagMatch = (art.tags || []).some(t => t.toLowerCase().includes(query) || (TAG_MAP_EN[t] || '').toLowerCase().includes(query));

      return matchCat && (titleMatch || summaryMatch || tagMatch);
    });
  }, [articlesList, selectedCategory, searchQuery, isZh]);

  return (
    <div style={{ width: '100%', minHeight: '85vh', padding: '2rem 1rem', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* HEADER HERO */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem',
          padding: '2.5rem 1.5rem',
          background: 'linear-gradient(180deg, rgba(27, 40, 56, 0.95) 0%, rgba(23, 26, 33, 0.9) 100%)',
          borderRadius: '20px',
          border: `1px solid rgba(102, 192, 244, 0.3)`,
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(102, 192, 244, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            background: 'rgba(102, 192, 244, 0.12)',
            border: `1px solid rgba(102, 192, 244, 0.4)`,
            borderRadius: '30px',
            color: theme.gold,
            fontSize: '0.85rem',
            fontWeight: '600',
            letterSpacing: '2px',
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>
            {isZh ? '☯️ 东方智慧与现代天象探索' : '☯️ Celestial Esoteric Wisdom Hub'}
          </div>

          <h1 style={{
            fontFamily: isZh ? '"PingFang SC", "Microsoft YaHei", sans-serif' : 'Space Grotesk, serif',
            fontSize: '2.5rem',
            color: '#FFFFFF',
            margin: '0 0 1rem 0',
            fontWeight: '700',
            letterSpacing: '1px'
          }}>
            {isZh ? '玄学文化与命理探索' : 'Mystic Culture & Esoteric Insights'}
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#A0B0C0',
            maxWidth: '780px',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            {isZh
              ? '汇聚面相解析、手相全息、五行风水、生肖八字、西洋星象与易经奇门40篇经典研习文章。探索天人合一之理，洞察生命磁场轨迹。'
              : 'Explore 40 curated insights on Physiognomy, Palmistry, Five Elements Feng Shui, Chinese Zodiac Bazi, Astrology, and I Ching Strategy.'}
          </p>

          {/* SEARCH BAR */}
          <div style={{ marginTop: '2rem', maxWidth: '560px', margin: '2rem auto 0 auto', position: 'relative' }}>
            <input
              type="text"
              placeholder={isZh ? '搜索面相、手相、风水、生肖等关键词...' : 'Search face reading, palmistry, feng shui, zodiac...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px 14px 48px',
                borderRadius: '30px',
                border: `1px solid rgba(102, 192, 244, 0.4)`,
                background: 'rgba(11, 16, 26, 0.9)',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
              }}
            />
            <i className="fas fa-search" style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.gold,
              fontSize: '1rem'
            }} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '2rem',
          scrollbarWidth: 'thin'
        }}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '25px',
                  border: isActive ? `1px solid ${theme.gold}` : '1px solid rgba(102, 192, 244, 0.18)',
                  background: isActive ? 'linear-gradient(90deg, #1A44C2 0%, #47BFFF 100%)' : 'rgba(23, 38, 54, 0.7)',
                  color: isActive ? '#FFFFFF' : '#89A2B6',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? '600' : '400',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 4px 15px rgba(71, 191, 255, 0.3)' : 'none'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* RESULTS COUNT */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#89A2B6',
          fontSize: '0.88rem',
          marginBottom: '1.5rem',
          padding: '0 4px'
        }}>
          <span>
            {isZh
              ? `共找到 ${filteredArticles.length} 篇玄学文化文章`
              : `Found ${filteredArticles.length} esoteric articles`}
          </span>
          {searchQuery && (
            <span style={{ color: theme.gold, cursor: 'pointer' }} onClick={() => setSearchQuery('')}>
              {isZh ? '清除搜索' : 'Clear search'}
            </span>
          )}
        </div>

        {/* ARTICLE GRID */}
        {filteredArticles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            background: 'rgba(23, 38, 54, 0.5)',
            borderRadius: '16px',
            border: '1px dashed rgba(102,192,244,0.2)'
          }}>
            <i className="fas fa-book-open" style={{ fontSize: '3rem', color: theme.gold, marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ color: '#A0B0C0', fontSize: '1rem' }}>
              {isZh ? '未找到匹配的文章，请尝试切换分类或搜索其他关键词。' : 'No articles match your search. Try another category or keyword.'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredArticles.map((article) => {
              const title = isZh ? article.title : article.titleEn;
              const summary = isZh ? article.summary : (article.summaryEn || article.summary);
              const categoryName = isZh ? article.category : (article.categoryEn || article.category);
              const authorName = isZh ? article.author : (article.authorEn || article.author);
              const articleTitle = isZh ? article.title : (article.titleEn || article.title);

              return (
                <div
                  key={article.id}
                  onClick={() => handleSetArticle(article)}
                  style={{
                    background: 'rgba(23, 38, 54, 0.85)',
                    borderRadius: '16px',
                    border: '1px solid rgba(102, 192, 244, 0.2)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                    position: 'relative'
                  }}
                  className="article-card-hover"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = theme.gold;
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 192, 244, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(102, 192, 244, 0.2)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)';
                  }}
                >
                  {/* CARD BODY */}
                  <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    
                    {/* TOP CATEGORY & READ TIME HEADER BAR */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <span style={{
                        background: 'rgba(102, 192, 244, 0.12)',
                        color: theme.gold,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        border: '1px solid rgba(102, 192, 244, 0.3)'
                      }}>
                        {categoryName}
                      </span>
                      <span style={{
                        color: '#7B94A6',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <i className="far fa-clock" /> {isZh ? article.readTime : (article.readTimeEn || article.readTime.replace('分钟', ' min read'))}
                      </span>
                    </div>

                    {/* ARTICLE TITLE */}
                    <h3 style={{
                      margin: '0 0 0.75rem 0',
                      color: '#FFFFFF',
                      fontSize: '1.12rem',
                      fontWeight: '600',
                      lineHeight: '1.5',
                      textAlign: 'left',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {articleTitle}
                    </h3>

                    {/* SUMMARY */}
                    <p style={{
                      margin: '0 0 1.25rem 0',
                      color: '#90A0B0',
                      fontSize: '0.88rem',
                      lineHeight: '1.6',
                      textAlign: 'left',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1
                    }}>
                      {summary}
                    </p>

                    {/* TAGS */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.72rem',
                          background: 'rgba(102, 192, 244, 0.08)',
                          color: '#66C0F4',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(102, 192, 244, 0.2)'
                        }}>
                          #{isZh ? tag : (TAG_MAP_EN[tag] || tag)}
                        </span>
                      ))}
                    </div>

                    {/* CARD FOOTER */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid rgba(102, 192, 244, 0.1)',
                      paddingTop: '0.88rem',
                      marginTop: 'auto'
                    }}>
                      <span style={{ fontSize: '0.78rem', color: '#668095' }}>
                        <i className="far fa-calendar-alt" style={{ marginRight: '4px' }} />
                        {article.publishDate}
                      </span>

                      <span style={{
                        color: theme.gold,
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {isZh ? '阅读全文' : 'Read Article'} <i className="fas fa-arrow-right" style={{ fontSize: '0.75rem' }} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FULL ARTICLE MODAL READ VIEW WITH TOP-RIGHT CLOSE 'X' BUTTON */}
        {activeArticle && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(11, 16, 26, 0.92)',
            backdropFilter: 'blur(16px)',
            zIndex: 3000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '2rem 1rem',
            overflowY: 'auto'
          }}>
            <div style={{
              background: 'linear-gradient(180deg, #1B2838 0%, #171A21 100%)',
              border: `1px solid rgba(102, 192, 244, 0.35)`,
              borderRadius: '24px',
              maxWidth: '1080px',
              width: '100%',
              margin: '2rem auto',
              boxShadow: '0 30px 80px rgba(0,0,0,0.95)',
              position: 'relative',
              overflow: 'hidden',
              color: '#D6E2EB',
              lineHeight: '1.8'
            }}>
              
              {/* TOP-RIGHT CLOSE BUTTON 'X' */}
              <button
                onClick={() => handleSetArticle(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid rgba(102, 192, 244, 0.4)`,
                  color: '#FFFFFF',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#c0392b';
                  e.currentTarget.style.borderColor = '#e74c3c';
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(102, 192, 244, 0.4)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title={isZh ? '关闭文章 (返回列表)' : 'Close Article (Return to List)'}
              >
                ✕
              </button>

              {/* ARTICLE HERO HEADER */}
              <div style={{
                padding: '3rem 2.5rem 2rem 2.5rem',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(26, 40, 56, 0.98) 0%, rgba(15, 22, 32, 0.95) 100%)',
                borderBottom: '1px solid rgba(102, 192, 244, 0.25)',
                boxSizing: 'border-box',
                textAlign: 'left'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '220px',
                  height: '220px',
                  background: 'radial-gradient(circle, rgba(102, 192, 244, 0.12) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }} />

                <span style={{
                  display: 'inline-block',
                  background: 'rgba(102, 192, 244, 0.2)',
                  border: '1px solid rgba(102, 192, 244, 0.45)',
                  color: theme.gold,
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  {isZh ? activeArticle.category : (activeArticle.categoryEn || activeArticle.category)}
                </span>

                <h1 style={{
                  margin: 0,
                  color: '#FFFFFF',
                  fontSize: '1.85rem',
                  fontWeight: '700',
                  lineHeight: '1.4',
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                  maxWidth: '720px'
                }}>
                  {isZh ? activeArticle.title : (activeArticle.titleEn || activeArticle.title)}
                </h1>
              </div>

              {/* ARTICLE META INFO */}
              <div style={{
                display: 'flex',
                gap: '20px',
                padding: '16px 28px',
                borderBottom: '1px solid rgba(102, 192, 244, 0.15)',
                background: 'rgba(0,0,0,0.2)',
                fontSize: '0.85rem',
                color: '#89A2B6',
                flexWrap: 'wrap'
              }}>
                <span><i className="fas fa-feather-alt" style={{ marginRight: '6px', color: theme.gold }} />{isZh ? activeArticle.author : (activeArticle.authorEn || activeArticle.author)}</span>
                <span><i className="far fa-calendar-alt" style={{ marginRight: '6px', color: theme.gold }} />{activeArticle.publishDate}</span>
                <span><i className="far fa-clock" style={{ marginRight: '6px', color: theme.gold }} />{isZh ? activeArticle.readTime : (activeArticle.readTimeEn || activeArticle.readTime.replace('分钟', ' min read'))}</span>
              </div>

              {/* ARTICLE CONTENT */}
              <div style={{ padding: '24px 28px', fontSize: '0.98rem', color: '#D6E2EB', lineHeight: '1.75', textAlign: 'left' }}>
                
                {/* SUMMARY HIGHLIGHT BOX */}
                <div style={{
                  background: 'rgba(102, 192, 244, 0.08)',
                  borderLeft: `4px solid ${theme.gold}`,
                  padding: '14px 18px',
                  borderRadius: '0 10px 10px 0',
                  marginBottom: '1.2rem',
                  fontSize: '0.95rem',
                  color: '#E0EBF5',
                  fontStyle: 'italic',
                  textAlign: 'left'
                }}>
                  {isZh ? activeArticle.summary : (activeArticle.summaryEn || activeArticle.summary)}
                </div>

                {/* 2D DIAGRAM PLACED DIRECTLY BELOW TITLE & SUMMARY AT ARTICLE TOP */}
                <div style={{ margin: '1.2rem 0 1.6rem 0' }}>
                  <Article2DDiagram articleId={activeArticle.id} isZh={isZh} />
                </div>

                {/* MAIN MARKDOWN-LIKE CONTENT WITH TIGHT PARAGRAPH SPACING */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'left' }}>
                  {(() => {
                    const fullContent = getArticleContent(activeArticle, isZh);
                    const paragraphs = fullContent.split('\n');

                    return paragraphs.map((paragraph, pIdx) => {
                      let trimmed = paragraph.trim();
                      if (!trimmed) return null;

                      // Remove all asterisks "*"
                      trimmed = trimmed.replace(/\*/g, '');

                      // Clean up forbidden jargon phrases
                      trimmed = trimmed
                        .replace(/2D 标题导航图全息特征深度图解分析[：:]?/g, '特征结构图解分析：')
                        .replace(/2D Title Navigation Diagram Holographic Feature Analysis[：:]?/g, 'Feature Structure Analysis:')
                        .replace(/2D 标题导航图/g, '结构图解')
                        .replace(/2D 矢量标注/g, '特征标注')
                        .replace(/2D 标注/g, '特征标注')
                        .replace(/2D Navigation Diagram Callout/g, 'Feature Callout')
                        .replace(/通过AI高精度视觉映射算法/g, '通过精准特征分析')
                        .replace(/AI高精度视觉映射算法/g, '特征分析')
                        .replace(/高精度视觉映射算法/g, '特征分析');

                      trimmed = trimmed.trim();
                      if (!trimmed) return null;

                      // Inline Markdown Image Parser ![alt](url)
                      const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
                      if (imgMatch) {
                        const altText = imgMatch[1];
                        const imgUrl = imgMatch[2];
                        return (
                          <div key={pIdx} className="article-real-image-wrapper" style={{ margin: '1.2rem 0', textAlign: 'center', width: '100%' }}>
                            <div className="article-real-image-container" style={{
                              width: '100%',
                              maxWidth: '600px',
                              margin: '0 auto',
                              aspectRatio: '4 / 3',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              border: '1px solid rgba(102, 192, 244, 0.35)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                              background: '#0a101a',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <img
                                src={imgUrl}
                                alt={altText}
                                className="article-generated-real-image"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  display: 'block',
                                  borderRadius: '12px'
                                }}
                              />
                            </div>
                            {altText && (
                              <p style={{
                                fontSize: '0.8rem',
                                color: '#89A2B6',
                                marginTop: '8px',
                                textAlign: 'center',
                                fontStyle: 'italic',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}>
                                <i className="fas fa-camera" style={{ color: theme.gold, fontSize: '0.75rem' }} />
                                {isZh ? `插图：${altText}` : `Figure: ${altText}`}
                              </p>
                            )}
                          </div>
                        );
                      }

                      if (trimmed.startsWith('### ')) {
                        return (
                          <h3 key={pIdx} style={{
                            fontSize: '1.15rem',
                            color: theme.gold,
                            marginTop: '1.2rem',
                            marginBottom: '0.3rem',
                            fontWeight: '600',
                            borderBottom: '1px solid rgba(102,192,244,0.18)',
                            paddingBottom: '6px',
                            textAlign: 'left'
                          }}>
                            {trimmed.replace('### ', '')}
                          </h3>
                        );
                      }

                      if (trimmed.startsWith('#### ')) {
                        return (
                          <h4 key={pIdx} style={{
                            fontSize: '1.05rem',
                            color: '#66C0F4',
                            marginTop: '0.9rem',
                            marginBottom: '0.2rem',
                            fontWeight: '600',
                            textAlign: 'left'
                          }}>
                            {trimmed.replace('#### ', '')}
                          </h4>
                        );
                      }

                      if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ') || trimmed.startsWith('5. ') || trimmed.startsWith('6. ')) {
                        return (
                          <div key={pIdx} style={{
                            background: 'rgba(23, 38, 54, 0.65)',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 192, 244, 0.15)',
                            margin: '2px 0',
                            textAlign: 'left',
                            lineHeight: '1.65'
                          }}>
                            {trimmed}
                          </div>
                        );
                      }

                      if (trimmed.startsWith('> ')) {
                        return (
                          <blockquote key={pIdx} style={{
                            margin: '8px 0',
                            padding: '10px 14px',
                            background: 'rgba(102, 192, 244, 0.05)',
                            borderLeft: `3px solid ${theme.gold}`,
                            color: '#B0C8DC',
                            fontStyle: 'italic',
                            textAlign: 'left',
                            borderRadius: '0 6px 6px 0'
                          }}>
                            {trimmed.replace('> ', '')}
                          </blockquote>
                        );
                      }

                      if (trimmed === '---') {
                        return <hr key={pIdx} style={{ border: 'none', borderTop: '1px solid rgba(102, 192, 244, 0.15)', margin: '1rem 0' }} />;
                      }

                      return (
                        <p key={pIdx} style={{ margin: '0.15rem 0', textAlign: 'left', lineHeight: '1.75' }}>
                          {trimmed}
                        </p>
                      );
                    });
                  })()}
                </div>

                {/* INTERACTIVE CALL TO ACTION BOX */}
                <div style={{
                  marginTop: '2.5rem',
                  padding: '1.5rem 1rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(26, 68, 194, 0.3) 0%, rgba(71, 191, 255, 0.15) 100%)',
                  border: `1px solid ${theme.gold}`,
                  textAlign: 'center',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                  boxSizing: 'border-box',
                  width: '100%'
                }}>
                  <i className="fas fa-yin-yang" style={{ fontSize: '2rem', color: theme.gold, marginBottom: '0.75rem', display: 'inline-block' }} />
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#FFFFFF', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)' }}>
                    {isZh ? '想探知您个人的面相与手相全息密码？' : 'Ready to decode your unique biometric destiny chart?'}
                  </h3>
                  <p style={{ margin: '0 0 1.25rem 0', color: '#B0C5D8', fontSize: '0.9rem', lineHeight: '1.5', textAlign: 'center' }}>
                    {isZh
                      ? '结合天象与生物特征数据库，30秒生成100%深度精批报告。'
                      : 'Map your facial geometry and palm lines with our biometric scanner for instant destiny insights.'}
                  </p>

                  <button
                    onClick={() => {
                      if (onStartAnalysis) {
                        onStartAnalysis('both', activeArticle ? activeArticle.id : undefined);
                      }
                    }}
                    style={{
                      ...styles.button,
                      margin: '0 auto',
                      padding: '12px 16px',
                      fontSize: 'clamp(0.85rem, 3.8vw, 0.95rem)',
                      width: '100%',
                      maxWidth: '380px',
                      minWidth: '0',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      boxSizing: 'border-box',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fas fa-camera" />
                    <span>{isZh ? '面相+手相深度测算' : 'Biometric Reading'}</span>
                  </button>
                </div>

                {/* BOTTOM RETURN NAVIGATION BUTTON */}
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                  <button
                    onClick={() => handleSetArticle(null)}
                    style={{
                      background: 'none',
                      border: `1px solid rgba(102, 192, 244, 0.4)`,
                      color: theme.gold,
                      padding: '10px 24px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s'
                    }}
                  >
                    <i className="fas fa-arrow-left" />
                    {isZh ? '返回玄学文化文章导航' : 'Return to Article Navigation'}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
