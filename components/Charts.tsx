
import React from 'react';
import { theme } from '../theme';

export const FiveElementsChart = ({ elements, t }: { elements: any, t: any }) => {
    if (!elements) return null;
    const { Metal, Wood, Water, Fire, Earth } = elements.scores;
    const data = [
      { color: '#F1C40F', label: t.elementMetal, val: Metal },
      { color: '#2ECC71', label: t.elementWood, val: Wood },
      { color: '#3498DB', label: t.elementWater, val: Water },
      { color: '#E74C3C', label: t.elementFire, val: Fire },
      { color: '#D35400', label: t.elementEarth, val: Earth }
    ];
    const total = data.reduce((acc, curr) => acc + curr.val, 0);
    let cumulativeAngle = -90;
    const size = 200;
    const center = size / 2;
    const radius = 80;

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0'}}>
            <svg viewBox={`0 0 ${size} ${size}`} width="200" height="200">
              {data.map((slice, i) => {
                  if (slice.val === 0) return null;
                  const startAngle = cumulativeAngle;
                  const angleSize = (slice.val / total) * 360;
                  const endAngle = startAngle + angleSize;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  const x1 = center + radius * Math.cos(startRad);
                  const y1 = center + radius * Math.sin(startRad);
                  const x2 = center + radius * Math.cos(endRad);
                  const y2 = center + radius * Math.sin(endRad);
                  const midAngle = startAngle + angleSize / 2;
                  const midRad = (midAngle * Math.PI) / 180;
                  const textR = radius * 0.7;
                  const tx = center + textR * Math.cos(midRad);
                  const ty = center + textR * Math.sin(midRad);
                  const largeArcFlag = slice.val / total > 0.5 ? 1 : 0;
                  const pathData = [`M ${center} ${center}`, `L ${x1} ${y1}`, `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(' ');
                  cumulativeAngle = endAngle;
                  return (
                    <g key={i}>
                      <path d={pathData} fill={slice.color} stroke={theme.darkGold} strokeWidth="1" />
                      {slice.val > 5 && (
                        <text x={tx} y={ty} fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="central" style={{ textShadow: '0px 0px 3px rgba(0,0,0,0.8)' }}>
                          {slice.val}%
                        </text>
                      )}
                    </g>
                  );
              })}
            </svg>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginTop: '15px'}}>
                {data.map((item, i) => (
                    <div key={i} style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#5d4037', fontWeight: 'bold'}}>
                        <div style={{width: '12px', height: '12px', background: item.color, borderRadius: '50%'}} />
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
};
