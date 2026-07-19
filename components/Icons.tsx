
import React from 'react';

export const BaguaSVG = (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="bagua-icon" style={{ stroke: 'currentColor', fill: 'none' }}>
    <circle cx="100" cy="100" r="95" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
    <circle cx="100" cy="100" r="85" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="65" strokeWidth="1" opacity="0.8" />
    <circle cx="100" cy="100" r="40" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
    
    {/* 12 Astrological House Radials */}
    <g strokeWidth="0.75" opacity="0.6">
      <line x1="100" y1="15" x2="100" y2="185" />
      <line x1="15" y1="100" x2="185" y2="100" />
      <line x1="40" y1="40" x2="160" y2="160" />
      <line x1="160" y1="40" x2="40" y2="160" />
      <line x1="100" y1="100" x2="147.5" y2="18.2" />
      <line x1="100" y1="100" x2="52.5" y2="181.8" />
      <line x1="100" y1="100" x2="52.5" y2="18.2" />
      <line x1="100" y1="100" x2="147.5" y2="181.8" />
      <line x1="100" y1="100" x2="181.8" y2="52.5" />
      <line x1="100" y1="100" x2="18.2" y2="147.5" />
      <line x1="100" y1="100" x2="18.2" y2="52.5" />
      <line x1="100" y1="100" x2="181.8" y2="147.5" />
    </g>

    {/* Center Astrolabe / Sun and Moon core */}
    <g transform="translate(100, 100)" fill="currentColor">
      {/* Radiant Central Star */}
      <path d="M 0,-18 L 3,-5 L 16,-8 L 5,-2 L 18,0 L 5,2 L 16,8 L 3,5 L 0,18 L -3,5 L -16,8 L -5,2 L -18,0 L -5,-2 L -16,-8 L -3,-5 Z" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="6" fill="#000" stroke="currentColor" strokeWidth="1" />
      <circle cx="0" cy="0" r="3" fill="currentColor" />
    </g>

    {/* Elegant Starry Accents */}
    <g fill="currentColor">
      {/* Northern Star */}
      <path d="M 100,2 L 102,10 L 110,12 L 102,14 L 100,22 L 98,14 L 90,12 L 98,10 Z" />
      {/* Moon Phases along the inner circle */}
      <path d="M 165,100 A 8,8 0 1,0 165,116 A 6,6 0 1,1 165,100" transform="rotate(45, 100, 100)" />
      <path d="M 165,100 A 8,8 0 1,0 165,116 A 6,6 0 1,1 165,100" transform="rotate(135, 100, 100)" />
      <path d="M 165,100 A 8,8 0 1,0 165,116 A 6,6 0 1,1 165,100" transform="rotate(225, 100, 100)" />
      <path d="M 165,100 A 8,8 0 1,0 165,116 A 6,6 0 1,1 165,100" transform="rotate(315, 100, 100)" />
    </g>
  </svg>
);

export const FaceMapSVG = ({ t }: { t: any }) => {
  const LabelLine = ({ x1, y1, x2, y2, text, subtext, align = 'left' }: any) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-accent)" strokeWidth="0.5" strokeDasharray="2,2" />
      <circle cx={x1} cy={y1} r="2" fill="var(--color-accent)" />
      <text x={x2} y={y2 - 5} fill="var(--color-accent)" fontSize="10" fontWeight="bold" textAnchor={align}>{text}</text>
      <text x={x2} y={y2 + 6} fill="#aaa" fontSize="8" textAnchor={align}>{subtext}</text>
    </g>
  );

  return (
    <div style={{position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg viewBox="0 15 340 270" xmlns="http://www.w3.org/2000/svg" style={{width: '100%', height: '100%', maxHeight: '100%', objectFit: 'contain'}}>
        <g stroke="var(--color-accent)" strokeWidth="1.5" fill="none" opacity="0.8">
          <path d="M110,80 C110,40 230,40 230,80 C230,130 220,240 170,260 C120,240 110,130 110,80" />
          <path d="M110,110 C100,110 100,140 110,150" />
          <path d="M230,110 C240,110 240,140 230,150" />
          <path d="M125,105 Q140,95 155,105" />
          <path d="M185,105 Q200,95 215,105" />
          <path d="M130,120 Q140,115 150,120 Q140,125 130,120" />
          <path d="M190,120 Q200,115 210,120 Q200,125 190,120" />
          <path d="M170,120 L165,160 L175,160 Z" fill="rgba(192,132,252,0.1)"/>
          <path d="M170,120 L170,160 Q160,170 170,175 Q180,170 170,160" />
          <path d="M150,195 Q170,200 190,195" />
          <path d="M155,195 Q170,210 185,195" />
          <circle cx="170" cy="65" r="10" strokeDasharray="1,2" opacity="0.5" />
          <circle cx="170" cy="170" r="8" strokeDasharray="1,2" opacity="0.5" />
        </g>
        <LabelLine x1="130" y1="60" x2="50" y2="40" text={t.zoneParentsTitle} subtext={t.zoneParentsDesc} align="start" />
        <LabelLine x1="170" y1="65" x2="260" y2="40" text={t.zoneForeheadTitle} subtext={t.zoneForeheadDesc} align="start" />
        <LabelLine x1="140" y1="100" x2="60" y2="90" text={t.zoneBrowsTitle} subtext={t.zoneBrowsDesc} align="end" />
        <LabelLine x1="200" y1="120" x2="270" y2="100" text={t.zoneEyesTitle} subtext={t.zoneEyesDesc} align="start" />
        <LabelLine x1="220" y1="115" x2="280" y2="140" text={t.zoneSpouseTitle} subtext={t.zoneSpouseDesc} align="start" />
        <LabelLine x1="200" y1="135" x2="270" y2="180" text={t.zoneChildrenTitle} subtext={t.zoneChildrenDesc} align="start" />
        <LabelLine x1="170" y1="165" x2="80" y2="165" text={t.zoneNoseTitle} subtext={t.zoneNoseDesc} align="end" />
        <LabelLine x1="170" y1="200" x2="80" y2="210" text={t.zoneMouthTitle} subtext={t.zoneMouthDesc} align="end" />
        <LabelLine x1="170" y1="250" x2="80" y2="260" text={t.zoneChinTitle} subtext={t.zoneChinDesc} align="end" />
      </svg>
    </div>
  );
};
