import React from 'react';

export interface Article2DDiagramProps {
  articleId: string;
  isZh: boolean;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

interface Callout {
  x: number; // Target x on SVG (0-400)
  y: number; // Target y on SVG (0-240)
  lx: number; // Label badge x
  ly: number; // Label badge y
  labelZh: string;
  labelEn: string;
  color?: string;
}

export interface ArticleDiagramSpec {
  type: 'face' | 'palm' | 'dual';
  titleZh: string;
  titleEn: string;
  callouts: Callout[];
}

export const DIAGRAM_SPECS: Record<string, ArticleDiagramSpec> = {
  // Category 1: 面相识人 (art-01 ~ art-08)
  'art-01': {
    type: 'face',
    titleZh: '天庭与官禄宫特征图解',
    titleEn: 'Forehead & Career Palace 2D Vector Diagram',
    callouts: [
      { x: 200, y: 52, lx: 70, ly: 38, labelZh: '天庭 / 官禄宫 (15-30岁运势)', labelEn: 'Forehead / Career Palace (Ages 15-30)', color: '#d4af37' },
      { x: 250, y: 38, lx: 310, ly: 30, labelZh: 'M型发际线 (创新与开拓格局)', labelEn: 'M-Hairline (Innovation Trajectory)', color: '#66c0f4' },
      { x: 200, y: 82, lx: 310, ly: 90, labelZh: '印堂 (精神能级与贵人枢纽)', labelEn: 'Indang (Third Eye & Allies Hub)', color: '#2ecc71' }
    ]
  },
  'art-02': {
    type: 'face',
    titleZh: '眉形与兄弟宫特征图解',
    titleEn: 'Eyebrow Geometrics & Allies Palace Diagram',
    callouts: [
      { x: 160, y: 95, lx: 65, ly: 85, labelZh: '新月眉/剑眉 (兄弟宫关照)', labelEn: 'Crescent/Sword Brow (Allies Palace)', color: '#d4af37' },
      { x: 200, y: 92, lx: 70, ly: 140, labelZh: '眉心距 (情商与沟通宽容度)', labelEn: 'Inter-Brow Span (EQ & Openness)', color: '#66c0f4' },
      { x: 242, y: 92, lx: 315, ly: 85, labelZh: '眉尾高扬 (决断力与魄力)', labelEn: 'Brow Arch (Executive Courage)', color: '#e74c3c' }
    ]
  },
  'art-03': {
    type: 'face',
    titleZh: '眼神与采听宫特征图解',
    titleEn: 'Eye Resonance & Vision Palace Diagram',
    callouts: [
      { x: 165, y: 112, lx: 65, ly: 105, labelZh: '凤眼/杏眼 (采听官灵气)', labelEn: 'Phoenix/Almond Eye (Vision)', color: '#66c0f4' },
      { x: 200, y: 112, lx: 70, ly: 165, labelZh: '眼神定力 (聚财与决策能级)', labelEn: 'Gaze Focus (Wealth Capacity)', color: '#d4af37' },
      { x: 235, y: 106, lx: 315, ly: 105, labelZh: '田宅宫 (不动产与心境安宁)', labelEn: 'Property Palace (Assets & Peace)', color: '#2ecc71' }
    ]
  },
  'art-04': {
    type: 'face',
    titleZh: '鼻梁与财帛宫特征图解',
    titleEn: 'Nose Geometry & Wealth Palace Diagram',
    callouts: [
      { x: 200, y: 135, lx: 70, ly: 125, labelZh: '财帛宫 (41-50岁黄金运势)', labelEn: 'Wealth Palace (Ages 41-50 Fortune)', color: '#d4af37' },
      { x: 200, y: 152, lx: 70, ly: 180, labelZh: '准头圆润 (正财资本积累)', labelEn: 'Nose Tip (Primary Capital)', color: '#2ecc71' },
      { x: 218, y: 152, lx: 315, ly: 150, labelZh: '鼻翼饱满 (偏财与风险控制)', labelEn: 'Nostril Wings (Risk & Luck)', color: '#66c0f4' }
    ]
  },
  'art-05': {
    type: 'face',
    titleZh: '嘴唇与下巴特征图解',
    titleEn: 'Lips & Chin Earthly Base Diagram',
    callouts: [
      { x: 200, y: 175, lx: 70, ly: 165, labelZh: '出纳官 (沟通说服与亲和力)', labelEn: 'Mouth (Communication Hub)', color: '#66c0f4' },
      { x: 200, y: 205, lx: 70, ly: 215, labelZh: '地阁方圆 (晚年根基与福泽)', labelEn: 'Earthly Base (Late-Life Anchor)', color: '#d4af37' },
      { x: 245, y: 195, lx: 315, ly: 190, labelZh: '奴仆宫 (团队号召力与拥戴)', labelEn: 'Leadership Base (Team Synergy)', color: '#9b59b6' }
    ]
  },
  'art-06': {
    type: 'face',
    titleZh: '人中与子息宫特征图解',
    titleEn: 'Philtrum Alignment & Legacy Diagram',
    callouts: [
      { x: 200, y: 165, lx: 70, ly: 155, labelZh: '人中深长 (人际共情与调和)', labelEn: 'Philtrum Depth (Relational Depth)', color: '#d4af37' },
      { x: 200, y: 170, lx: 315, ly: 155, labelZh: '寿堂 (生命基因与体质)', labelEn: 'Longevity Axis (Vital Reserves)', color: '#2ecc71' },
      { x: 220, y: 168, lx: 315, ly: 200, labelZh: '子息宫 (家庭气场与传承)', labelEn: 'Legacy Palace (Family Resonance)', color: '#66c0f4' }
    ]
  },
  'art-07': {
    type: 'face',
    titleZh: '三庭五眼特征图解',
    titleEn: 'Three Courts & Five Eyes Structural Diagram',
    callouts: [
      { x: 200, y: 50, lx: 65, ly: 40, labelZh: '上庭 (15-30岁 智力与早运)', labelEn: 'Upper Court (Ages 15-30 Intellect)', color: '#d4af37' },
      { x: 200, y: 130, lx: 65, ly: 120, labelZh: '中庭 (31-50岁 事业与奋斗)', labelEn: 'Middle Court (Ages 31-50 Action)', color: '#66c0f4' },
      { x: 200, y: 195, lx: 65, ly: 190, labelZh: '下庭 (51-80岁 晚运与丰收)', labelEn: 'Lower Court (Ages 51-80 Harvest)', color: '#2ecc71' },
      { x: 260, y: 110, lx: 315, ly: 110, labelZh: '五眼等分 (对称黄金比例)', labelEn: 'Five-Eye Golden Ratio', color: '#e74c3c' }
    ]
  },
  'art-08': {
    type: 'face',
    titleZh: '面部痣相特征图解',
    titleEn: 'Facial Moles Location & Meaning Diagram',
    callouts: [
      { x: 200, y: 80, lx: 65, ly: 70, labelZh: '印堂吉痣 (贵人暗中相助)', labelEn: 'Indang Mole (Mentor Blessing)', color: '#d4af37' },
      { x: 238, y: 135, lx: 315, ly: 130, labelZh: '颧骨权柄痣 (领导力与权威)', labelEn: 'Cheekbone Mole (Leadership)', color: '#2ecc71' },
      { x: 200, y: 148, lx: 65, ly: 155, labelZh: '财帛宫避凶点 (理财风控提醒)', labelEn: 'Wealth Guard Point (Caution)', color: '#e74c3c' }
    ]
  },

  // Category 2: 手相掌纹 (art-09 ~ art-16)
  'art-09': {
    type: 'palm',
    titleZh: '生命线与金星丘特征图解',
    titleEn: 'Life Line & Vitality Mount Diagram',
    callouts: [
      { x: 160, y: 110, lx: 65, ly: 90, labelZh: '生命线起点 (先天体质储备)', labelEn: 'Life Line Start (Innate Energy)', color: '#2ecc71' },
      { x: 150, y: 160, lx: 65, ly: 160, labelZh: '金星丘 (生命能量蓄水池)', labelEn: 'Venus Mount (Vitality Reserve)', color: '#d4af37' },
      { x: 180, y: 210, lx: 315, ly: 200, labelZh: '流年刻度轴 (45-70岁体质)', labelEn: 'Life Horizon (Ages 45-70)', color: '#66c0f4' }
    ]
  },
  'art-10': {
    type: 'palm',
    titleZh: '智慧线与木星丘特征图解',
    titleEn: 'Head Line & Decision Mindset Diagram',
    callouts: [
      { x: 160, y: 110, lx: 65, ly: 85, labelZh: '木星丘 (抱负与专注力)', labelEn: 'Jupiter Mount (Ambition Axis)', color: '#d4af37' },
      { x: 200, y: 130, lx: 65, ly: 140, labelZh: '智慧线 (逻辑思维与决策)', labelEn: 'Head Line (Logic & Strategy)', color: '#66c0f4' },
      { x: 250, y: 145, lx: 315, ly: 140, labelZh: '分支走向 (创意与实干平衡)', labelEn: 'Trajectory (Innovation/Action)', color: '#2ecc71' }
    ]
  },
  'art-11': {
    type: 'palm',
    titleZh: '感情线与水星丘特征图解',
    titleEn: 'Heart Line & Emotional EQ Diagram',
    callouts: [
      { x: 260, y: 105, lx: 315, ly: 95, labelZh: '水星丘 (沟通与社交气场)', labelEn: 'Mercury Mount (Social Harmony)', color: '#66c0f4' },
      { x: 210, y: 115, lx: 65, ly: 105, labelZh: '感情线 (情商与共情能力)', labelEn: 'Heart Line (EQ & Connection)', color: '#e74c3c' },
      { x: 165, y: 108, lx: 65, ly: 160, labelZh: '双叉分尾 (理智与温情兼备)', labelEn: 'Forked Tail (Empathy & Logic)', color: '#d4af37' }
    ]
  },
  'art-12': {
    type: 'palm',
    titleZh: '事业线与土星丘特征图解',
    titleEn: 'Fate Line & Career Breakthrough Diagram',
    callouts: [
      { x: 200, y: 210, lx: 65, ly: 200, labelZh: '事业线起点 (早期创业契机)', labelEn: 'Fate Line Origin (Early Venture)', color: '#66c0f4' },
      { x: 198, y: 130, lx: 65, ly: 125, labelZh: '35岁交汇节点 (重大转折期)', labelEn: 'Age 35 Pivot Point (Major Shift)', color: '#e74c3c' },
      { x: 196, y: 85, lx: 315, ly: 80, labelZh: '土星丘 (终身事业高峰格局)', labelEn: 'Saturn Mount (Peak Achievement)', color: '#d4af37' }
    ]
  },
  'art-13': {
    type: 'palm',
    titleZh: '太阳线与名声特征图解',
    titleEn: 'Sun Line & Acclaim Distinction Diagram',
    callouts: [
      { x: 230, y: 85, lx: 315, ly: 75, labelZh: '太阳丘 (艺术与社会影响力)', labelEn: 'Sun Mount (Creative Authority)', color: '#d4af37' },
      { x: 230, y: 120, lx: 315, ly: 130, labelZh: '太阳线 (名声与显赫声望)', labelEn: 'Sun Line (Acclaim & Distinction)', color: '#66c0f4' },
      { x: 210, y: 150, lx: 65, ly: 160, labelZh: '贵人辅助纹 (社会认可与提携)', labelEn: 'Mentor Line (Social Recognition)', color: '#2ecc71' }
    ]
  },
  'art-14': {
    type: 'palm',
    titleZh: '九宫掌丘特征图解',
    titleEn: 'Nine Palm Mounts Energy Field Diagram',
    callouts: [
      { x: 160, y: 85, lx: 65, ly: 75, labelZh: '木星丘/土星丘 (抱负与意志)', labelEn: 'Jupiter/Saturn (Ambition)', color: '#d4af37' },
      { x: 150, y: 160, lx: 65, ly: 165, labelZh: '金星丘 (体质与情感蓄水池)', labelEn: 'Venus Mount (Vitality Base)', color: '#2ecc71' },
      { x: 260, y: 170, lx: 315, ly: 170, labelZh: '月丘/水星丘 (直觉与财富)', labelEn: 'Moon/Mercury (Intuition/Wealth)', color: '#66c0f4' }
    ]
  },
  'art-15': {
    type: 'palm',
    titleZh: '岛纹与断裂警示特征图解',
    titleEn: 'Palm Islands & Warning Marks Diagram',
    callouts: [
      { x: 220, y: 130, lx: 315, ly: 115, labelZh: '智慧线岛纹 (注意力集中提醒)', labelEn: 'Island Mark (Focus Reminder)', color: '#e74c3c' },
      { x: 200, y: 170, lx: 65, ly: 165, labelZh: '事业线断裂重连 (转型重生)', labelEn: 'Line Break (Transformation)', color: '#d4af37' },
      { x: 160, y: 125, lx: 65, ly: 110, labelZh: '井字纹/十字纹 (避凶护佑符)', labelEn: 'Cross/Grille (Protection Sign)', color: '#2ecc71' }
    ]
  },
  'art-16': {
    type: 'dual',
    titleZh: '面手双相互证特征图解',
    titleEn: 'Face & Palm Dual Biometrics Diagram',
    callouts: [
      { x: 120, y: 65, lx: 25, ly: 45, labelZh: '面相官禄宫 (天命事业格局)', labelEn: 'Facial Career Palace (Destiny)', color: '#d4af37' },
      { x: 280, y: 150, lx: 320, ly: 140, labelZh: '手相事业线 (行动力实时印证)', labelEn: 'Palm Fate Line (Action Audit)', color: '#66c0f4' },
      { x: 200, y: 190, lx: 110, ly: 215, labelZh: '全息双向交织校验 (精准度99%)', labelEn: 'Holographic Dual Cross-Check', color: '#2ecc71' }
    ]
  },

  // Category 3: 五行风水 (art-17 ~ art-24)
  'art-17': {
    type: 'face',
    titleZh: '五行气场失衡特征图解',
    titleEn: 'Five Elements Facial Balance Diagram',
    callouts: [
      { x: 200, y: 50, lx: 65, ly: 40, labelZh: '火行(额) / 水行(下巴)', labelEn: 'Fire (Forehead) / Water (Chin)', color: '#e74c3c' },
      { x: 150, y: 135, lx: 65, ly: 140, labelZh: '木行(左颧) / 金行(右颧)', labelEn: 'Wood (Left) / Metal (Right)', color: '#2ecc71' },
      { x: 200, y: 150, lx: 315, ly: 140, labelZh: '土行(鼻准) (中宫调和基石)', labelEn: 'Earth (Nose Tip Hub)', color: '#d4af37' }
    ]
  },
  'art-18': {
    type: 'face',
    titleZh: '家居风水与面相感应特征图解',
    titleEn: 'Home Feng Shui Qi Resonance Diagram',
    callouts: [
      { x: 200, y: 50, lx: 65, ly: 40, labelZh: '明堂透光 (对应额头天庭)', labelEn: 'Bright Hall (Forehead Synergy)', color: '#d4af37' },
      { x: 200, y: 135, lx: 315, ly: 130, labelZh: '财位稳固 (对应鼻梁财帛)', labelEn: 'Wealth Corner (Nose Synergy)', color: '#66c0f4' },
      { x: 200, y: 200, lx: 65, ly: 190, labelZh: '基座扎实 (对应下巴地阁)', labelEn: 'Foundation (Chin Synergy)', color: '#2ecc71' }
    ]
  },
  'art-19': {
    type: 'palm',
    titleZh: '工位风水与手相布局特征图解',
    titleEn: 'Workplace Desk Feng Shui Diagram',
    callouts: [
      { x: 160, y: 85, lx: 65, ly: 75, labelZh: '左青龙位 (靠山稳固/木星丘)', labelEn: 'Left Dragon (Jupiter Anchor)', color: '#d4af37' },
      { x: 260, y: 105, lx: 315, ly: 95, labelZh: '右白虎位 (平整简洁/水星丘)', labelEn: 'Right Tiger (Mercury Balance)', color: '#66c0f4' },
      { x: 200, y: 170, lx: 65, ly: 180, labelZh: '明堂通透 (决策清晰/掌心)', labelEn: 'Clear Desk Center (Hand Mind)', color: '#2ecc71' }
    ]
  },
  'art-20': {
    type: 'face',
    titleZh: '五行色彩与气场频率特征图解',
    titleEn: 'Five Elements Color Palette Aura Diagram',
    callouts: [
      { x: 200, y: 60, lx: 65, ly: 50, labelZh: '喜用色彩共振 (提升能量场)', labelEn: 'Auspicious Color Frequency', color: '#d4af37' },
      { x: 150, y: 120, lx: 65, ly: 130, labelZh: '气场护盾 (阻隔负面干扰)', labelEn: 'Aura Shield (Harmonic Barrier)', color: '#66c0f4' },
      { x: 250, y: 120, lx: 315, ly: 130, labelZh: '五行穿搭 (每日磁场优化)', labelEn: 'Wardrobe Element Synergy', color: '#9b59b6' }
    ]
  },
  'art-21': {
    type: 'palm',
    titleZh: '水晶磁场与掌心防护特征图解',
    titleEn: 'Crystal Energy Aura Shield Diagram',
    callouts: [
      { x: 200, y: 170, lx: 65, ly: 165, labelZh: '掌心明堂轮 (晶体能量输入)', labelEn: 'Chakra Center (Crystal Flow)', color: '#d4af37' },
      { x: 150, y: 160, lx: 65, ly: 110, labelZh: '黑曜石/黄水晶 (磁场净化)', labelEn: 'Obsidian/Citrine (Purity Shield)', color: '#66c0f4' },
      { x: 260, y: 105, lx: 315, ly: 105, labelZh: '气场防护圈 (提振财富能级)', labelEn: 'Aura Protection (Wealth Field)', color: '#2ecc71' }
    ]
  },
  'art-22': {
    type: 'face',
    titleZh: '玄关纳气与第一印象特征图解',
    titleEn: 'Front Entryway Qi Gateway Diagram',
    callouts: [
      { x: 200, y: 80, lx: 65, ly: 70, labelZh: '玄关开阔 (提升印堂明亮度)', labelEn: 'Open Entrance (Illuminated Indang)', color: '#d4af37' },
      { x: 200, y: 135, lx: 315, ly: 130, labelZh: '纳气枢纽 (财帛宫能量源头)', labelEn: 'Qi Entrance (Wealth Palace Origin)', color: '#66c0f4' },
      { x: 200, y: 180, lx: 65, ly: 185, labelZh: '屏风遮挡 (聚气不散/保护地阁)', labelEn: 'Shielding Screen (Qi Preservation)', color: '#2ecc71' }
    ]
  },
  'art-23': {
    type: 'palm',
    titleZh: '方位生克与五行地理特征图解',
    titleEn: 'Compass Directions & Element Vectors',
    callouts: [
      { x: 200, y: 80, lx: 65, ly: 70, labelZh: '北方水 / 南方火 (方位方位感应)', labelEn: 'North Water / South Fire', color: '#66c0f4' },
      { x: 150, y: 150, lx: 65, ly: 160, labelZh: '东方木 / 西方金 (发展契机 vector)', labelEn: 'East Wood / West Metal Vector', color: '#d4af37' },
      { x: 250, y: 150, lx: 315, ly: 150, labelZh: '中央土 (个人五行磁场归枢)', labelEn: 'Center Earth (Anchor Axis)', color: '#2ecc71' }
    ]
  },
  'art-24': {
    type: 'face',
    titleZh: '卧室环境与睡眠修复特征图解',
    titleEn: 'Bedroom Sleep Rhythm & Aura Vector',
    callouts: [
      { x: 200, y: 80, lx: 65, ly: 70, labelZh: '印堂开朗 (睡眠心安无杂念)', labelEn: 'Calm Indang (Tranquil Mind)', color: '#2ecc71' },
      { x: 165, y: 110, lx: 65, ly: 130, labelZh: '眼神充沛 (睡眠中深度修复)', labelEn: 'Gaze Restored (Circadian Rest)', color: '#66c0f4' },
      { x: 200, y: 200, lx: 315, ly: 190, labelZh: '床位靠山 (晚间气场稳定充盈)', labelEn: 'Sanctuary Bed Anchor (Stability)', color: '#d4af37' }
    ]
  },

  // Category 4: 生肖八字 (art-25 ~ art-32)
  'art-25': {
    type: 'face',
    titleZh: '2026赤马年运势流年特征图解',
    titleEn: '2026 Red Horse Year Annual Face Transits',
    callouts: [
      { x: 200, y: 52, lx: 65, ly: 42, labelZh: '丙午火年 (额头天庭气色反映)', labelEn: '2026 Fire Horse (Forehead Energy)', color: '#e74c3c' },
      { x: 200, y: 82, lx: 315, ly: 80, labelZh: '印堂赤红/金黄 (机遇与考验)', labelEn: 'Indang Transits (Key Opportunity)', color: '#d4af37' },
      { x: 200, y: 140, lx: 65, ly: 150, labelZh: '乘风破浪 (30秒AI精准排盘)', labelEn: 'Strategic Guidance (AI Matrix)', color: '#2ecc71' }
    ]
  },
  'art-26': {
    type: 'palm',
    titleZh: '生肖贵人与掌相合纹特征图解',
    titleEn: 'Zodiac Ally Lines & Synergy Diagram',
    callouts: [
      { x: 160, y: 85, lx: 65, ly: 75, labelZh: '六合生肖 (契合贵人辅助纹)', labelEn: 'Six-Harmonies Ally Line', color: '#d4af37' },
      { x: 260, y: 105, lx: 315, ly: 95, labelZh: '三合生肖 (事业团队互补)', labelEn: 'Tri-Harmonies Team Synergy', color: '#66c0f4' },
      { x: 200, y: 170, lx: 65, ly: 180, labelZh: '掌心合纹 (借力强力磁场)', labelEn: 'Palm Synergy (Shared Energy)', color: '#2ecc71' }
    ]
  },
  'art-27': {
    type: 'face',
    titleZh: '八字四柱与面相映射特征图解',
    titleEn: 'Bazi Four Pillars Facial Mapping Diagram',
    callouts: [
      { x: 200, y: 50, lx: 65, ly: 40, labelZh: '年柱/月柱 (对应上庭与父母宫)', labelEn: 'Year/Month Pillars (Upper Court)', color: '#d4af37' },
      { x: 200, y: 135, lx: 315, ly: 130, labelZh: '日柱日主 (对应中庭与鼻梁)', labelEn: 'Day Master (Middle Court)', color: '#66c0f4' },
      { x: 200, y: 200, lx: 65, ly: 190, labelZh: '时柱 (对应下庭与地阁晩运)', labelEn: 'Hour Pillar (Lower Court)', color: '#2ecc71' }
    ]
  },
  'art-28': {
    type: 'face',
    titleZh: '太岁岁星与印堂气色特征图解',
    titleEn: 'Tai Sui Transit & Indang Signal Diagram',
    callouts: [
      { x: 200, y: 80, lx: 65, ly: 70, labelZh: '印堂气色 (太岁岁星感应窗口)', labelEn: 'Indang Aura (Tai Sui Signal)', color: '#d4af37' },
      { x: 160, y: 95, lx: 65, ly: 130, labelZh: '眉心清秀 (保持心态从容和合)', labelEn: 'Serene Eyebrows (Peaceful Mind)', color: '#2ecc71' },
      { x: 200, y: 140, lx: 315, ly: 140, labelZh: '祈福化解 (日常行善积德防护)', labelEn: 'Neutralization (Mindful Actions)', color: '#66c0f4' }
    ]
  },
  'art-29': {
    type: 'face',
    titleZh: '十天干性格原型特征图解',
    titleEn: 'Ten Heavenly Stems Archetype Diagram',
    callouts: [
      { x: 200, y: 50, lx: 65, ly: 40, labelZh: '甲乙木 / 丙丁火 (向上与光明)', labelEn: 'Wood & Fire (Vision & Warmth)', color: '#e74c3c' },
      { x: 200, y: 135, lx: 315, ly: 130, labelZh: '戊己土 (沉稳包容中宫)', labelEn: 'Earth (Stable & Nurturing)', color: '#d4af37' },
      { x: 200, y: 200, lx: 65, ly: 190, labelZh: '庚辛金 / 壬癸水 (决断与智慧)', labelEn: 'Metal & Water (Logic & Depth)', color: '#66c0f4' }
    ]
  },
  'art-30': {
    type: 'palm',
    titleZh: '十神格局与手相财官纹特征图解',
    titleEn: 'The Ten Gods & Palm Status Marks',
    callouts: [
      { x: 200, y: 210, lx: 65, ly: 200, labelZh: '正财/偏财 (财富积累路径)', labelEn: 'Direct/Indirect Wealth Drive', color: '#d4af37' },
      { x: 200, y: 130, lx: 315, ly: 120, labelZh: '正官/七杀 (事业决策与威望)', labelEn: 'Authority & Strategic Stars', color: '#66c0f4' },
      { x: 160, y: 85, lx: 65, ly: 75, labelZh: '食神/伤官 (创意与才华释放)', labelEn: 'Creative Drive & Expression', color: '#2ecc71' }
    ]
  },
  'art-31': {
    type: 'palm',
    titleZh: '十年大运与手掌年龄轴特征图解',
    titleEn: 'Decade Luck Cycles & Palm Timeline',
    callouts: [
      { x: 160, y: 110, lx: 65, ly: 90, labelZh: '20-30岁 (积累与选择阶段)', labelEn: 'Ages 20-30 (Growth Phase)', color: '#2ecc71' },
      { x: 198, y: 130, lx: 65, ly: 150, labelZh: '35-45岁 (事业关键突破轴)', labelEn: 'Ages 35-45 (Career Pivot)', color: '#e74c3c' },
      { x: 196, y: 85, lx: 315, ly: 80, labelZh: '50岁+ (收获与格局沉淀)', labelEn: 'Ages 50+ (Peak Harvest)', color: '#d4af37' }
    ]
  },
  'art-32': {
    type: 'palm',
    titleZh: '生肖饰物与掌心共振特征图解',
    titleEn: 'Zodiac Amulets & Hand Resonance',
    callouts: [
      { x: 200, y: 170, lx: 65, ly: 165, labelZh: '掌心气场 (饰物材质共振中心)', labelEn: 'Hand Energy Center (Resonance)', color: '#d4af37' },
      { x: 150, y: 160, lx: 65, ly: 110, labelZh: '玉石/金属/水晶 (五行加持)', labelEn: 'Jade/Metal/Crystal (Element)', color: '#66c0f4' },
      { x: 260, y: 105, lx: 315, ly: 105, labelZh: '佩戴开运 (频率调和提振)', labelEn: 'Amulet Activation (Aura Tuning)', color: '#2ecc71' }
    ]
  },

  // Category 5: 星象与易经 (art-33 ~ art-40)
  'art-33': {
    type: 'palm',
    titleZh: '水星逆行与思维线特征图解',
    titleEn: 'Mercury Retrograde & Head Line Vector',
    callouts: [
      { x: 260, y: 105, lx: 315, ly: 95, labelZh: '水星丘 (沟通与文件签署)', labelEn: 'Mercury Mount (Communication)', color: '#66c0f4' },
      { x: 200, y: 130, lx: 65, ly: 125, labelZh: '智慧线平稳 (水逆期沉着定力)', labelEn: 'Head Line (Calm Retrograde Mind)', color: '#d4af37' },
      { x: 160, y: 110, lx: 65, ly: 180, labelZh: '理性决策 (三思而后行)', labelEn: 'Equanimity (Mindful Action)', color: '#2ecc71' }
    ]
  },
  'art-34': {
    type: 'face',
    titleZh: '上升星座与外在面相特征图解',
    titleEn: 'Rising Sign Outer Persona Diagram',
    callouts: [
      { x: 200, y: 50, lx: 65, ly: 40, labelZh: '面相轮廓 (第一印象磁场)', labelEn: 'Facial Contour (Outer Persona)', color: '#d4af37' },
      { x: 165, y: 110, lx: 65, ly: 130, labelZh: '眼神气质 (上升星座能级)', labelEn: 'Gaze Aura (Rising Energy)', color: '#66c0f4' },
      { x: 200, y: 195, lx: 315, ly: 190, labelZh: '活出正能 (自信从容绽放)', labelEn: 'Highest Potential (Confidence)', color: '#2ecc71' }
    ]
  },
  'art-35': {
    type: 'palm',
    titleZh: '月亮星座与掌心感情特征图解',
    titleEn: 'Moon Sign Subconscious Needs Diagram',
    callouts: [
      { x: 210, y: 115, lx: 65, ly: 105, labelZh: '感情线 (潜意识情感安全感)', labelEn: 'Heart Line (Subconscious Need)', color: '#e74c3c' },
      { x: 260, y: 170, lx: 315, ly: 160, labelZh: '月丘 (直觉与梦境感应)', labelEn: 'Moon Mount (Intuition Sanctuary)', color: '#66c0f4' },
      { x: 150, y: 160, lx: 65, ly: 170, labelZh: '滋养内性 (建立内心庇护所)', labelEn: 'Nourishing Self (Inner Peace)', color: '#d4af37' }
    ]
  },
  'art-36': {
    type: 'palm',
    titleZh: '易经六十四卦与掌上八卦特征图解',
    titleEn: 'I Ching Hexagrams & Eight Trigrams Matrix',
    callouts: [
      { x: 160, y: 85, lx: 65, ly: 75, labelZh: '离卦/震卦/巽卦 (掌心三吉位)', labelEn: 'Li, Zhen, Xun Trigrams', color: '#d4af37' },
      { x: 200, y: 170, lx: 65, ly: 165, labelZh: '乾卦/坤卦 (阴阳交泰明堂)', labelEn: 'Qian & Kun (Yin-Yang Hub)', color: '#66c0f4' },
      { x: 260, y: 170, lx: 315, ly: 170, labelZh: '二进制逻辑 (变化与决策智慧)', labelEn: 'Binary Logic (Wisdom of Flux)', color: '#2ecc71' }
    ]
  },
  'art-37': {
    type: 'palm',
    titleZh: '奇门遁甲掌上时空盘特征图解',
    titleEn: 'Qi Men Dun Jia Chrono Tactics Diagram',
    callouts: [
      { x: 160, y: 85, lx: 65, ly: 75, labelZh: '休生伤杜景死惊开 (九宫八门)', labelEn: 'Eight Doors Qi Men Grid', color: '#d4af37' },
      { x: 200, y: 130, lx: 315, ly: 120, labelZh: '择吉时空 (抓住关键决策窗口)', labelEn: 'Auspicious Window Selection', color: '#66c0f4' },
      { x: 150, y: 160, lx: 65, ly: 170, labelZh: '时空战术 (占据竞争优势位)', labelEn: 'Chrono-Tactics Advantage', color: '#2ecc71' }
    ]
  },
  'art-38': {
    type: 'face',
    titleZh: '紫微斗数十二宫面相映射特征图解',
    titleEn: 'Zi Wei Dou Shu Twelve Palaces Diagram',
    callouts: [
      { x: 200, y: 80, lx: 65, ly: 70, labelZh: '命宫 (印堂 - 核心格局)', labelEn: 'Destiny Palace (Indang Center)', color: '#d4af37' },
      { x: 200, y: 50, lx: 315, ly: 40, labelZh: '官禄宫 (额头 - 事业与学业)', labelEn: 'Career Palace (Forehead)', color: '#66c0f4' },
      { x: 200, y: 150, lx: 65, ly: 160, labelZh: '财帛宫 (鼻梁 - 资产财富)', labelEn: 'Wealth Palace (Nose Bridge)', color: '#2ecc71' }
    ]
  },
  'art-39': {
    type: 'face',
    titleZh: '共时性信号与觉知感应特征图解',
    titleEn: 'Synchronicity Signals & Awareness Diagram',
    callouts: [
      { x: 165, y: 110, lx: 65, ly: 100, labelZh: '眼神专注 (感知微观共时信号)', labelEn: 'Gaze Focus (Synchronicity Perception)', color: '#66c0f4' },
      { x: 200, y: 80, lx: 315, ly: 75, labelZh: '灵感同频 (宇宙信号同频共振)', labelEn: 'Intuitive Frequency Resonance', color: '#d4af37' },
      { x: 200, y: 180, lx: 65, ly: 190, labelZh: '保持觉知 (顺应自然指引)', labelEn: 'Mindful Awareness (Universal Guidance)', color: '#2ecc71' }
    ]
  },
  'art-40': {
    type: 'dual',
    titleZh: 'AI高精度面手相矢量映射特征图解',
    titleEn: 'AI Biometric Computer Vision Vector Mesh',
    callouts: [
      { x: 120, y: 65, lx: 25, ly: 45, labelZh: '人脸 68 关键特征点阵网格', labelEn: '68-Point Facial Feature Mesh', color: '#66c0f4' },
      { x: 280, y: 150, lx: 320, ly: 140, labelZh: '手掌 21 关节与主要纹路识别', labelEn: '21-Hand Joint & Line Detection', color: '#d4af37' },
      { x: 200, y: 190, lx: 105, ly: 215, labelZh: '千万级古籍与天象数据库联动', labelEn: 'Big Data Metaphysic Engine', color: '#2ecc71' }
    ]
  }
};

export const Article2DDiagram: React.FC<Article2DDiagramProps> = ({
  articleId,
  isZh,
  height = 'auto',
  className = '',
  style = {}
}) => {
  const [activeCallout, setActiveCallout] = React.useState<number | null>(null);

  // Fallback to art-01 if article ID not found
  const spec = DIAGRAM_SPECS[articleId] || DIAGRAM_SPECS['art-01'];

  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: '1020px',
        margin: '0 auto',
        position: 'relative',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        ...style
      }}
    >
      {/* 1. SEPARATE INDEPENDENT DISPLAY BOX FOR "核心特征图解" TITLE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        background: 'rgba(15, 23, 36, 0.95)',
        borderRadius: '12px',
        border: '1px solid rgba(102, 192, 244, 0.35)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#d4af37',
            boxShadow: '0 0 10px #d4af37'
          }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.5px' }}>
            {isZh ? spec.titleZh : spec.titleEn}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.72rem',
          color: '#66c0f4',
          background: 'rgba(102, 192, 244, 0.1)',
          padding: '3px 10px',
          borderRadius: '12px',
          border: '1px solid rgba(102, 192, 244, 0.25)'
        }}>
          <i className="fas fa-crosshairs" style={{ fontSize: '0.7rem' }} />
          <span>{isZh ? '全息结构图解' : '2D Holographic Mesh'}</span>
        </div>
      </div>

      {/* 2. INDEPENDENT 2D DIAGRAM CANVAS DISPLAY BOX & ANNOTATIONS */}
      <div style={{
        borderRadius: '16px',
        border: '1px solid rgba(102, 192, 244, 0.3)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.55)',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #0d1522 0%, #080c14 100%)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* SVG STAGE CANVAS DISPLAY BOX (MAINTAINS NORMAL PROPORTIONS ACROSS PC, TABLET, MOBILE) */}
      <div
        className="article-diagram-stage"
        style={{
          position: 'relative',
          width: '100%',
          margin: '0 auto',
          background: 'radial-gradient(circle at 50% 50%, #111a28 0%, #06090f 100%)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(102, 192, 244, 0.2)'
        }}
      >
        <svg
          viewBox="0 0 400 240"
          style={{ width: '100%', height: '100%', display: 'block', margin: 'auto' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glowing Filters */}
            <filter id={`glow-cyan-${articleId}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id={`glow-gold-${articleId}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Linear Gradients */}
            <linearGradient id={`grad-cyan-${articleId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#66c0f4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1b2838" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id={`grad-gold-${articleId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1b2838" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* TECH GRID MESH BACKGROUND */}
          <g opacity="0.15" stroke="#66c0f4" strokeWidth="0.5">
            <line x1="0" y1="40" x2="400" y2="40" />
            <line x1="0" y1="80" x2="400" y2="80" />
            <line x1="0" y1="120" x2="400" y2="120" />
            <line x1="0" y1="160" x2="400" y2="160" />
            <line x1="0" y1="200" x2="400" y2="200" />

            <line x1="50" y1="0" x2="50" y2="240" />
            <line x1="100" y1="0" x2="100" y2="240" />
            <line x1="150" y1="0" x2="150" y2="240" />
            <line x1="200" y1="0" x2="200" y2="240" strokeDasharray="3,3" stroke="#d4af37" opacity="0.4" />
            <line x1="250" y1="0" x2="250" y2="240" />
            <line x1="300" y1="0" x2="300" y2="240" />
            <line x1="350" y1="0" x2="350" y2="240" />
          </g>

          {/* RADIAL TARGET RETICLES */}
          <g transform="translate(200, 120)" opacity="0.2">
            <circle r="95" fill="none" stroke="#66c0f4" strokeWidth="0.8" strokeDasharray="4,4" />
            <circle r="60" fill="none" stroke="#d4af37" strokeWidth="0.8" />
            <circle r="2" fill="#d4af37" />
          </g>

          {/* 2D SILHOUETTE VECTOR DRAWING */}
          {(spec.type === 'face' || spec.type === 'dual') && (
            <g transform={spec.type === 'dual' ? 'translate(-80, 0) scale(0.85)' : ''}>
              {/* FACE CONTOUR */}
              <path
                d="M 130 50 C 130 20, 270 20, 270 50 C 270 120, 260 215, 200 215 C 140 215, 130 120, 130 50 Z"
                fill="rgba(102, 192, 244, 0.04)"
                stroke="#66c0f4"
                strokeWidth="1.8"
                filter={`url(#glow-cyan-${articleId})`}
              />

              {/* HAIRLINE */}
              <path
                d="M 135 55 C 160 32, 180 50, 200 38 C 220 50, 240 32, 265 55"
                fill="none"
                stroke="#d4af37"
                strokeWidth="1.2"
                strokeDasharray="2,2"
              />

              {/* THREE COURTS HORIZONTAL GUIDELINES */}
              <line x1="130" y1="80" x2="270" y2="80" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />
              <line x1="130" y1="160" x2="270" y2="160" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />

              {/* EYEBROWS */}
              <path d="M 150 92 Q 170 82, 188 92" fill="none" stroke="#66c0f4" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 212 92 Q 230 82, 250 92" fill="none" stroke="#66c0f4" strokeWidth="2.5" strokeLinecap="round" />

              {/* EYES */}
              <path d="M 152 110 Q 170 100, 186 110 Q 170 118, 152 110 Z" fill="rgba(212, 175, 55, 0.1)" stroke="#d4af37" strokeWidth="1.2" />
              <circle cx="169" cy="109" r="4" fill="#66c0f4" />

              <path d="M 214 110 Q 230 100, 248 110 Q 230 118, 214 110 Z" fill="rgba(212, 175, 55, 0.1)" stroke="#d4af37" strokeWidth="1.2" />
              <circle cx="231" cy="109" r="4" fill="#66c0f4" />

              {/* NOSE */}
              <path d="M 200 82 L 200 135 L 190 152 Q 200 157, 210 152 L 200 135" fill="rgba(102, 192, 244, 0.08)" stroke="#66c0f4" strokeWidth="1.4" />

              {/* MOUTH */}
              <path d="M 175 178 Q 200 172, 225 178 Q 200 188, 175 178 Z" fill="rgba(212, 175, 55, 0.15)" stroke="#d4af37" strokeWidth="1.2" />

              {/* CHIN ACCENT */}
              <path d="M 185 202 Q 200 210, 215 202" fill="none" stroke="#66c0f4" strokeWidth="1" />
            </g>
          )}

          {(spec.type === 'palm' || spec.type === 'dual') && (
            <g transform={spec.type === 'dual' ? 'translate(80, 0) scale(0.85)' : ''}>
              {/* PALM SILHOUETTE OUTLINE */}
              <path
                d="M 120 230 L 120 180 Q 110 120, 125 70 C 130 50, 145 50, 148 75 L 152 120 L 155 45 C 160 25, 175 25, 178 45 L 182 115 L 185 30 C 190 10, 205 10, 208 30 L 212 118 L 216 55 C 220 38, 235 38, 238 58 L 242 135 Q 260 145, 275 170 Q 285 200, 275 230 Z"
                fill="rgba(212, 175, 55, 0.04)"
                stroke="#d4af37"
                strokeWidth="1.6"
                filter={`url(#glow-gold-${articleId})`}
              />

              {/* THUMB OUTLINE */}
              <path d="M 125 160 Q 90 130, 105 100 Q 120 90, 138 125" fill="none" stroke="#d4af37" strokeWidth="1.4" />

              {/* PALM MAJOR LINES */}
              {/* Life Line */}
              <path d="M 140 105 Q 185 130, 180 215" fill="none" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" />
              {/* Head Line */}
              <path d="M 140 108 Q 200 125, 255 145" fill="none" stroke="#66c0f4" strokeWidth="2" strokeLinecap="round" />
              {/* Heart Line */}
              <path d="M 265 105 Q 200 110, 160 78" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" />
              {/* Fate Line */}
              <path d="M 200 220 L 198 80" fill="none" stroke="#d4af37" strokeWidth="1.8" strokeDasharray="5,2" />
              {/* Sun Line */}
              <path d="M 230 160 L 228 80" fill="none" stroke="#9b59b6" strokeWidth="1.5" />

              {/* PALM MOUNT CIRCLES */}
              <circle cx="160" cy="75" r="12" fill="none" stroke="#66c0f4" strokeWidth="0.8" strokeDasharray="2,2" />
              <circle cx="190" cy="72" r="11" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="2,2" />
              <circle cx="228" cy="74" r="11" fill="none" stroke="#9b59b6" strokeWidth="0.8" strokeDasharray="2,2" />
              <circle cx="260" cy="95" r="11" fill="none" stroke="#66c0f4" strokeWidth="0.8" strokeDasharray="2,2" />
              <circle cx="150" cy="165" r="18" fill="none" stroke="#2ecc71" strokeWidth="0.8" strokeDasharray="2,2" />
              <circle cx="260" cy="180" r="16" fill="none" stroke="#e74c3c" strokeWidth="0.8" strokeDasharray="2,2" />
            </g>
          )}

          {/* HIGH-PRECISION GLOW TARGET NODES WITH NUMBERED BADGES */}
          {spec.callouts.map((c, idx) => {
            const color = c.color || '#d4af37';
            const isActive = activeCallout === idx;
            const numStr = String(idx + 1).padStart(2, '0');

            return (
              <g
                key={idx}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveCallout(idx)}
                onMouseLeave={() => setActiveCallout(null)}
                onClick={() => setActiveCallout(isActive ? null : idx)}
              >
                {/* ACTIVE RIPPLE LASER LINE */}
                {isActive && (
                  <line
                    x1={c.x}
                    y1={c.y}
                    x2={200}
                    y2={120}
                    stroke={color}
                    strokeWidth="1"
                    strokeDasharray="3,3"
                    opacity="0.8"
                  />
                )}

                {/* TARGET PULSING RINGS */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isActive ? "14" : "10"}
                  fill="none"
                  stroke={color}
                  strokeWidth={isActive ? "1.8" : "1"}
                  opacity={isActive ? "1" : "0.7"}
                >
                  <animate attributeName="r" values={isActive ? "12;18;12" : "8;13;8"} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* SOLID CENTER TARGET DOT */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isActive ? "6" : "4.5"}
                  fill={color}
                  filter={`url(#glow-gold-${articleId})`}
                />

                {/* FLOATING NUMBER PIN BADGE */}
                <g transform={`translate(${c.x > 320 ? c.x - 18 : (c.x < 80 ? c.x + 4 : c.x + 8)}, ${c.y - 14})`}>
                  <rect
                    x="-2"
                    y="-10"
                    width="20"
                    height="16"
                    rx="8"
                    fill={isActive ? color : "rgba(10, 16, 26, 0.92)"}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  <text
                    x="8"
                    y="1.5"
                    fill={isActive ? "#0A101A" : "#FFFFFF"}
                    fontSize="8.5"
                    fontWeight="800"
                    textAnchor="middle"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {numStr}
                  </text>
                </g>
              </g>
            );
          })}

          {/* VECTOR WATERMARK */}
          <text
            x="388"
            y="230"
            fill="#66c0f4"
            fontSize="8"
            fontWeight="bold"
            opacity="0.5"
            textAnchor="end"
          >
            BIOMETRIC MAP V2.0
          </text>
        </svg>
      </div>

      {/* RESPONSIVE ANNOTATIONS SECTION (POSITIONED STRICTLY OUTSIDE THE 2D DISPLAY BOX - HEIGHT INCREASED BY 1X) */}
      <div
        className="article-diagram-annotations"
        style={{
          background: 'rgba(11, 17, 26, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          borderTop: '1px solid rgba(102, 192, 244, 0.2)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          color: '#89A2B6',
          marginBottom: '14px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#D4AF37' }}>
            <i className="fas fa-list-ol" style={{ color: '#d4af37', fontSize: '0.9rem' }} />
            {isZh ? `核心特征图解标识 (${spec.callouts.length}项)` : `Core Biometric Annotations (${spec.callouts.length})`}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#66C0F4', opacity: 0.85 }}>
            {isZh ? '点击/悬停卡片高亮节点' : 'Tap card to highlight node'}
          </span>
        </div>

        {/* CALLOUT CARDS RESPONSIVE GRID */}
        <div
          className="article-diagram-annotations-grid"
          style={{
            display: 'grid',
            width: '100%'
          }}
        >
          {spec.callouts.map((c, idx) => {
            const color = c.color || '#d4af37';
            const isActive = activeCallout === idx;
            const labelText = isZh ? c.labelZh : c.labelEn;
            const numStr = String(idx + 1).padStart(2, '0');

            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveCallout(idx)}
                onMouseLeave={() => setActiveCallout(null)}
                onClick={() => setActiveCallout(isActive ? null : idx)}
                className="article-diagram-annotation-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(102, 192, 244, 0.2)' : 'rgba(21, 32, 48, 0.75)',
                  border: `1px solid ${isActive ? color : 'rgba(102, 192, 244, 0.22)'}`,
                  boxShadow: isActive ? `0 0 16px ${color}44` : '0 4px 12px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {/* BADGE NUMBER PILL */}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isActive ? color : 'rgba(10, 16, 26, 0.88)',
                  color: isActive ? '#0A101A' : color,
                  border: `1.8px solid ${color}`,
                  fontSize: '0.88rem',
                  fontWeight: '800',
                  flexShrink: 0
                }}>
                  {numStr}
                </span>

                {/* LABEL TEXT */}
                <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: isActive ? '#FFFFFF' : '#E1E9F0',
                    lineHeight: '1.4',
                    textAlign: 'left',
                    wordBreak: 'break-word'
                  }}>
                    {labelText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
};
