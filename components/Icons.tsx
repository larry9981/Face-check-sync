
import React from 'react';

export const BaguaSVG = (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="bagua-icon">
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path d="M70.7 29.3 L129.3 29.3 L170.7 70.7 L170.7 129.3 L129.3 170.7 L70.7 170.7 L29.3 129.3 L29.3 70.7 Z" 
          fill="none" stroke="#d4af37" strokeWidth="2" />
    <g stroke="#d4af37" strokeWidth="2" strokeLinecap="round">
      <line x1="90" y1="40" x2="110" y2="40" />
      <line x1="90" y1="36" x2="110" y2="36" />
      <line x1="90" y1="32" x2="110" y2="32" />
      <line x1="90" y1="160" x2="98" y2="160" /><line x1="102" y1="160" x2="110" y2="160" />
      <line x1="90" y1="164" x2="98" y2="164" /><line x1="102" y1="164" x2="110" y2="164" />
      <line x1="90" y1="168" x2="98" y2="168" /><line x1="102" y1="168" x2="110" y2="168" />
      <line x1="40" y1="90" x2="40" y2="110" />
      <line x1="36" y1="90" x2="36" y2="98" /><line x1="36" y1="102" x2="36" y2="110" />
      <line x1="32" y1="90" x2="32" y2="110" />
      <line x1="160" y1="90" x2="160" y2="98" /><line x1="160" y1="102" x2="160" y2="110" />
      <line x1="164" y1="90" x2="164" y2="110" />
      <line x1="168" y1="90" x2="168" y2="98" /><line x1="168" y1="102" x2="168" y2="110" />
    </g>
    <circle cx="100" cy="100" r="28" fill="#d4af37" opacity="0.1" />
    <path d="M100,72 a14,14 0 0,1 0,28 a14,14 0 0,0 0,28 a28,28 0 0,1 0,-56" fill="#d4af37" />
    <path d="M100,72 a14,14 0 0,1 0,28 a14,14 0 0,0 0,28 a28,28 0 0,0 0,-56" fill="rgba(0,0,0,0.5)" stroke="#d4af37" strokeWidth="1" />
    <circle cx="100" cy="86" r="3" fill="#050511" />
    <circle cx="100" cy="114" r="3" fill="#d4af37" />
  </svg>
);

export const FaceMapSVG = ({ t }: { t: any }) => {
  const LabelLine = ({ x1, y1, x2, y2, text, subtext, align = 'left' }: any) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4af37" strokeWidth="0.5" strokeDasharray="2,2" />
      <circle cx={x1} cy={y1} r="2" fill="#d4af37" />
      <text x={x2} y={y2 - 5} fill="#d4af37" fontSize="10" fontWeight="bold" textAnchor={align}>{text}</text>
      <text x={x2} y={y2 + 6} fill="#aaa" fontSize="8" textAnchor={align}>{subtext}</text>
    </g>
  );

  return (
    <div style={{position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg viewBox="0 0 340 400" xmlns="http://www.w3.org/2000/svg" style={{width: '100%', height: '100%', maxHeight: '100%', objectFit: 'contain'}}>
        <g stroke="#d4af37" strokeWidth="1.5" fill="none" opacity="0.8">
          <path d="M110,80 C110,40 230,40 230,80 C230,130 220,240 170,260 C120,240 110,130 110,80" />
          <path d="M110,110 C100,110 100,140 110,150" />
          <path d="M230,110 C240,110 240,140 230,150" />
          <path d="M125,105 Q140,95 155,105" />
          <path d="M185,105 Q200,95 215,105" />
          <path d="M130,120 Q140,115 150,120 Q140,125 130,120" />
          <path d="M190,120 Q200,115 210,120 Q200,125 190,120" />
          <path d="M170,120 L165,160 L175,160 Z" fill="rgba(212,175,55,0.1)"/>
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
