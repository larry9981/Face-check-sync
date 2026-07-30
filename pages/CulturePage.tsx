import React, { useState, useEffect, useMemo } from 'react';
import { theme, styles } from '../theme';
import { CULTURE_ARTICLES, Article } from '../data/cultureArticles';

interface CulturePageProps {
  language: string;
  onNavigateHome?: () => void;
  onStartAnalysis?: (type: 'face' | 'palm' | 'both') => void;
}

export const CulturePage: React.FC<CulturePageProps> = ({
  language,
  onNavigateHome,
  onStartAnalysis
}) => {
  const isZh = language.startsWith('zh');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [articlesList, setArticlesList] = useState<Article[]>(CULTURE_ARTICLES);

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
      const tagMatch = (art.tags || []).some(t => t.toLowerCase().includes(query));

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
              const summary = isZh ? article.summary : article.summaryEn;
              const categoryName = isZh ? article.category : article.categoryEn;
              const authorName = isZh ? article.author : article.authorEn;

              return (
                <div
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
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
                  {/* CARD COVER IMAGE */}
                  <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={article.coverImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop'}
                      alt={title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(11, 16, 26, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: theme.gold,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: `1px solid rgba(102, 192, 244, 0.4)`
                    }}>
                      {categoryName}
                    </div>

                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '12px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#CCC',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <i className="far fa-clock" /> {article.readTime}
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <h3 style={{
                      margin: '0 0 0.75rem 0',
                      color: '#FFFFFF',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      lineHeight: '1.5',
                      textAlign: 'left',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {title}
                    </h3>

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
                          #{tag}
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
              maxWidth: '860px',
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
                onClick={() => setActiveArticle(null)}
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
                title={isZh ? '关闭文章 (返回上级)' : 'Close Article (Return)'}
              >
                ✕
              </button>

              {/* ARTICLE BANNER IMAGE */}
              <div style={{ height: '320px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={activeArticle.coverImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop'}
                  alt={isZh ? activeArticle.title : activeArticle.titleEn}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(27, 40, 56, 0.95) 100%)'
                }} />

                <div style={{ position: 'absolute', bottom: '24px', left: '28px', right: '80px' }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(102, 192, 244, 0.2)',
                    border: '1px solid rgba(102, 192, 244, 0.5)',
                    color: theme.gold,
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    marginBottom: '10px'
                  }}>
                    {isZh ? activeArticle.category : activeArticle.categoryEn}
                  </span>

                  <h1 style={{
                    margin: 0,
                    color: '#FFFFFF',
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                  }}>
                    {isZh ? activeArticle.title : activeArticle.titleEn}
                  </h1>
                </div>
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
                <span><i className="fas fa-feather-alt" style={{ marginRight: '6px', color: theme.gold }} />{isZh ? activeArticle.author : activeArticle.authorEn}</span>
                <span><i className="far fa-calendar-alt" style={{ marginRight: '6px', color: theme.gold }} />{activeArticle.publishDate}</span>
                <span><i className="far fa-clock" style={{ marginRight: '6px', color: theme.gold }} />{activeArticle.readTime}</span>
              </div>

              {/* ARTICLE CONTENT */}
              <div style={{ padding: '28px 36px', fontSize: '1rem', color: '#D6E2EB', lineHeight: '1.9', textAlign: 'left' }}>
                
                {/* SUMMARY HIGHLIGHT BOX */}
                <div style={{
                  background: 'rgba(102, 192, 244, 0.08)',
                  borderLeft: `4px solid ${theme.gold}`,
                  padding: '16px 20px',
                  borderRadius: '0 12px 12px 0',
                  marginBottom: '2rem',
                  fontSize: '0.98rem',
                  color: '#E0EBF5',
                  fontStyle: 'italic',
                  textAlign: 'left'
                }}>
                  {isZh ? activeArticle.summary : activeArticle.summaryEn}
                </div>

                {/* MAIN MARKDOWN-LIKE CONTENT WITH INTERSPERSED IMAGES */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                  {(isZh ? activeArticle.content : (activeArticle.contentEn || activeArticle.content))
                    .split('\n')
                    .map((paragraph, pIdx) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return null;

                      // Inline Markdown Image Parser ![alt](url)
                      const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
                      if (imgMatch) {
                        const altText = imgMatch[1];
                        const imgUrl = imgMatch[2];
                        return (
                          <div key={pIdx} style={{ margin: '1.2rem 0', textAlign: 'left' }}>
                            <img
                              src={imgUrl}
                              alt={altText}
                              style={{
                                width: '100%',
                                maxHeight: '380px',
                                objectFit: 'cover',
                                borderRadius: '14px',
                                border: '1px solid rgba(102, 192, 244, 0.35)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                                display: 'block'
                              }}
                            />
                            {altText && (
                              <p style={{
                                fontSize: '0.85rem',
                                color: '#89A2B6',
                                marginTop: '8px',
                                textAlign: 'left',
                                fontStyle: 'italic',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                <i className="fas fa-camera" style={{ color: theme.gold, fontSize: '0.8rem' }} />
                                {isZh ? `插图：${altText}` : `Figure: ${altText}`}
                              </p>
                            )}
                          </div>
                        );
                      }

                      if (trimmed.startsWith('### ')) {
                        return (
                          <h3 key={pIdx} style={{
                            fontSize: '1.3rem',
                            color: theme.gold,
                            marginTop: '1.6rem',
                            marginBottom: '0.6rem',
                            fontWeight: '600',
                            borderBottom: '1px solid rgba(102,192,244,0.18)',
                            paddingBottom: '8px',
                            textAlign: 'left'
                          }}>
                            {trimmed.replace('### ', '')}
                          </h3>
                        );
                      }

                      if (trimmed.startsWith('* ')) {
                        return (
                          <div key={pIdx} style={{ display: 'flex', gap: '8px', marginLeft: '4px', margin: '4px 0', textAlign: 'left' }}>
                            <span style={{ color: theme.gold, fontWeight: 'bold' }}>•</span>
                            <span style={{ textAlign: 'left' }}>{trimmed.replace('* ', '')}</span>
                          </div>
                        );
                      }

                      if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ') || trimmed.startsWith('5. ') || trimmed.startsWith('6. ')) {
                        return (
                          <div key={pIdx} style={{
                            background: 'rgba(23, 38, 54, 0.65)',
                            padding: '12px 18px',
                            borderRadius: '10px',
                            border: '1px solid rgba(102, 192, 244, 0.15)',
                            margin: '4px 0',
                            textAlign: 'left',
                            lineHeight: '1.7'
                          }}>
                            {trimmed}
                          </div>
                        );
                      }

                      if (trimmed.startsWith('> ')) {
                        return (
                          <blockquote key={pIdx} style={{
                            margin: '12px 0',
                            padding: '12px 18px',
                            background: 'rgba(102, 192, 244, 0.05)',
                            borderLeft: `3px solid ${theme.gold}`,
                            color: '#B0C8DC',
                            fontStyle: 'italic',
                            textAlign: 'left',
                            borderRadius: '0 8px 8px 0'
                          }}>
                            {trimmed.replace('> ', '')}
                          </blockquote>
                        );
                      }

                      if (trimmed === '---') {
                        return <hr key={pIdx} style={{ border: 'none', borderTop: '1px solid rgba(102, 192, 244, 0.15)', margin: '1.5rem 0' }} />;
                      }

                      return (
                        <p key={pIdx} style={{ margin: 0, textAlign: 'left', lineHeight: '1.85' }}>
                          {trimmed}
                        </p>
                      );
                    })}
                </div>

                {/* INTERACTIVE CALL TO ACTION BOX */}
                <div style={{
                  marginTop: '3rem',
                  padding: '2rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(26, 68, 194, 0.3) 0%, rgba(71, 191, 255, 0.15) 100%)',
                  border: `1px solid ${theme.gold}`,
                  textAlign: 'center',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.5)'
                }}>
                  <i className="fas fa-yin-yang" style={{ fontSize: '2.5rem', color: theme.gold, marginBottom: '1rem', display: 'inline-block' }} />
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#FFFFFF', fontSize: '1.3rem' }}>
                    {isZh ? '想探知您个人的面相与手相全息密码？' : 'Ready to decode your unique biometric destiny chart?'}
                  </h3>
                  <p style={{ margin: '0 0 1.5rem 0', color: '#B0C5D8', fontSize: '0.92rem' }}>
                    {isZh
                      ? '通过AI高精度视觉映射算法，结合千万级天象与生物特征数据库，30秒生成100%深度精批报告。'
                      : 'Map your facial geometry and palm lines with our AI biometric scanner for instant destiny insights.'}
                  </p>

                  <button
                    onClick={() => {
                      setActiveArticle(null);
                      if (onStartAnalysis) {
                        onStartAnalysis('both');
                      }
                    }}
                    style={{
                      ...styles.button,
                      margin: 0,
                      padding: '14px 28px',
                      fontSize: '0.95rem'
                    }}
                  >
                    <i className="fas fa-camera" />
                    {isZh ? '立即开始 AI 面相+手相深度测算' : 'Start Free AI Biometric Reading'}
                  </button>
                </div>

                {/* BOTTOM RETURN NAVIGATION BUTTON */}
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                  <button
                    onClick={() => setActiveArticle(null)}
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
