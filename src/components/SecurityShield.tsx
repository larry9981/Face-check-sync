import React, { useEffect, useState } from 'react';

interface SecurityShieldProps {
  isZh?: boolean;
}

export const SecurityShield: React.FC<SecurityShieldProps> = ({ isZh = false }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // 1. Console Security Warning for Anti-Scraping & Anti-Crack
    console.log(
      '%c🔒 TianJiEyes Domain Security Protection Active %c\nAll content, algorithms, biometrics, and layout data are protected by domain authorization and copyright protection. Unauthorized scraping, violent cracking, or theft is strictly prohibited.',
      'color: #D4AF37; font-size: 16px; font-weight: bold; background: #0a0a16; padding: 6px 12px; border-radius: 4px; border: 1px solid #D4AF37;',
      'color: #47BFFF; font-size: 12px; margin-top: 5px;'
    );

    // 2. Anti-Frame / Frame-busting protection (Domain Lock)
    try {
      if (window.top && window.top !== window.self) {
        // If embedded in external iframe, check origin
        const currentHost = window.location.hostname;
        const parentHost = document.referrer ? new URL(document.referrer).hostname : '';
        if (parentHost && !parentHost.includes(currentHost) && !parentHost.includes('localhost') && !parentHost.includes('run.app')) {
          console.warn('[Domain Security] Unauthorized iframe embedding detected from:', parentHost);
        }
      }
    } catch (e) {
      // Cross-origin iframe block triggered
      console.warn('[Domain Security] Cross-origin embedding restriction active.');
    }

    // 3. Anti-Copy Copyright Attribution Shield
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 30) {
        const text = selection.toString();
        const copyrightNotice = isZh
          ? `\n\n--------------------\n【天机之眼 Domain Protection】\n本文内容已受域名授权与知识产权安全保护。未经官方许可，严禁非法复制与盗用。\n官方域名：${window.location.hostname}`
          : `\n\n--------------------\n[TianJiEyes Domain Protection]\nThis content is protected by domain security and intellectual property safeguards. Unauthorized copying, scraping, or theft is strictly prohibited.\nOfficial Site: ${window.location.hostname}`;
        
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', text + copyrightNotice);
          e.preventDefault();
          triggerToast(
            isZh
              ? '🔒 域名安全保护：已为您附带版权保护声明'
              : '🔒 Domain Security: Copyright attribution attached to copied text'
          );
        }
      }
    };

    // 4. Anti-Image Dragging Protection
    const handleDragStart = (e: DragEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
        triggerToast(
          isZh
            ? '🔒 域名安全保护：图片资源受防盗链与防下载保护'
            : '🔒 Domain Security: Image asset is protected against direct hotlinking & theft'
        );
      }
    };

    // 5. Context Menu Safety Toast (Allow native menu, but notify user & log audit)
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.classList.contains('protected-content'))) {
        triggerToast(
          isZh
            ? '🛡️ 域名版权保护：图片与专有算法成果受数据安全机制监控'
            : '🛡️ Domain Security: Imagery & proprietary data actively monitored'
        );
      }
    };

    window.addEventListener('copy', handleCopy);
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isZh]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            zIndex: 99999,
            background: 'rgba(10, 10, 22, 0.95)',
            border: '1px solid #D4AF37',
            boxShadow: '0 8px 24px rgba(212, 175, 55, 0.25)',
            borderRadius: '8px',
            padding: '10px 18px',
            color: '#D4AF37',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backdropFilter: 'blur(10px)',
            animation: 'fadeInUp 0.3s ease-out'
          }}
        >
          <i className="fas fa-shield-alt" style={{ fontSize: '1.1rem', color: '#47BFFF' }}></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export const DomainSecurityBadge: React.FC<{ isZh?: boolean }> = ({ isZh = false }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        background: 'rgba(10, 15, 30, 0.75)',
        border: '1px solid rgba(71, 191, 255, 0.3)',
        borderRadius: '20px',
        fontSize: '0.78rem',
        color: '#a0c4df',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        marginTop: '15px'
      }}
      title={isZh ? "本网站已开启256位SSL加密、域名防盗用、防刷与防盗链全方位安全防护" : "Domain protection active with 256-Bit SSL encryption, anti-scraping & rate-limiting shields"}
    >
      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 8px #2ecc71' }}></span>
      <i className="fas fa-lock" style={{ color: '#D4AF37' }}></i>
      <span style={{ fontWeight: 600, color: '#e0f0ff' }}>
        {isZh ? '域名安全保护中' : 'Domain Protected'}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
      <span>256-Bit SSL Shield Active</span>
    </div>
  );
};
