import React from 'react';

export const TopHeaderNav = ({
  t,
  onBack,
  onClose,
  title,
  className
}: {
  t?: any;
  onBack?: () => void;
  onClose?: () => void;
  title?: string;
  className?: string;
}) => {
  const isZh = !t || (t.home === '首页' || t.title === '玄机面相' || (t.backBtn && t.backBtn.includes('返回')));

  return (
    <div
      className={`top-header-nav ${className || ''}`}
      style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto 1.5rem auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 18px',
        background: 'rgba(15, 23, 36, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(102, 192, 244, 0.25)',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
        boxSizing: 'border-box'
      }}
    >
      {/* Back Button */}
      {onBack ? (
        <button
          className="nav-back-btn"
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(102, 192, 244, 0.12)',
            border: '1px solid rgba(102, 192, 244, 0.35)',
            color: '#66c0f4',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.88rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(102, 192, 244, 0.25)';
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(102, 192, 244, 0.12)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <span style={{ fontSize: '1rem', lineHeight: '1', whiteSpace: 'nowrap' }}>←</span>
          <span style={{ whiteSpace: 'nowrap' }}>{(t && t.backBtn) ? t.backBtn : (isZh ? '返回' : 'Back')}</span>
        </button>
      ) : (
        <div style={{ minWidth: '70px', flexShrink: 0 }} />
      )}

      {/* Title / Indicator */}
      {title ? (
        <div
          className="nav-title"
          style={{
            color: '#d4af37',
            fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            textAlign: 'center',
            fontFamily: '"Space Grotesk", sans-serif',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
        </div>
      ) : <div />}

      {/* Close Button */}
      {onClose ? (
        <button
          className="nav-close-btn"
          onClick={onClose}
          aria-label="Close"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(231, 76, 60, 0.15)',
            border: '1px solid rgba(231, 76, 60, 0.4)',
            color: '#ff6b6b',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(231, 76, 60, 0.3)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(231, 76, 60, 0.15)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <span style={{ fontSize: '1.15rem', lineHeight: '1' }}>✕</span>
        </button>
      ) : (
        <div style={{ minWidth: '90px' }} />
      )}
    </div>
  );
};
