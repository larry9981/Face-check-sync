import { Article } from './cultureArticles';
import { ENGLISH_ARTICLES } from './englishArticles';
import { DIAGRAM_SPECS } from '../components/Article2DDiagram';

function generateDiagramAnalysis(article: Article, isZh: boolean): string {
  const spec = DIAGRAM_SPECS[article.id];
  if (!spec) return '';

  const diagramTitle = isZh ? spec.titleZh : spec.titleEn;
  const articleTitle = isZh ? article.title : (article.titleEn || article.title);

  if (isZh) {
    const calloutDetails = spec.callouts.map((c, idx) => {
      return `【特征解析 ${idx + 1}：${c.labelZh}】\n精准定位于图解坐标 (${c.x}, ${c.y})。在面相与手相流年切片中，此节点代表核心气场枢纽。评估该部位的丰盈度、线条连贯性与光泽气色，可直接反映出在该阶段的心理状态、事业决策效率与潜在贵人运势。`;
    }).join('\n\n');

    return `\n\n---\n\n### 特征结构图解分析：${diagramTitle}\n\n在《${articleTitle}》的核心结构图解中，标定了主要生理特征与气场坐标。以下是针对各个标注节点的逐项深度拆解分析：\n\n${calloutDetails}\n\n### 综合气场调理与运势协同指南\n1. 视觉对照：建议结合图解上的标注节点，观察自身镜像中的对应位置。若线条清晰、气色红润光洁，预示当前正处于能量升腾周期。\n2. 空间与心智共振：针对图解所指示的弱项节点，可通过调整日常坐姿、光线照明以及搭配对应五行水晶，补足气场频段，达成心智与环境的完美平衡。\n3. 实时测算：点击下方测算按钮，导入您的真实面部与手掌照片，生成专属 100% 深度精批报告。`;
  } else {
    const calloutDetails = spec.callouts.map((c, idx) => {
      return `[Feature Analysis ${idx + 1}: ${c.labelEn}]\nPrecisely calibrated at coordinates (${c.x}, ${c.y}). Within the physiognomy matrix, this coordinate serves as a primary energy conduit. Evaluating structural elevation, symmetry, and luminosity at this point directly reflects cognitive stamina, career decision efficiency, and guardian ally resonance during key transit ages.`;
    }).join('\n\n');

    return `\n\n---\n\n### Feature Structure Analysis: ${diagramTitle}\n\nIn the official structure diagram accompanying "${articleTitle}", we map the critical energetic coordinates of this subject. Below is a comprehensive breakdown of each callout feature annotated in the image:\n\n${calloutDetails}\n\n### Comprehensive Energetic Alignment & Optimization Guidelines\n1. Mirror Comparison: Compare the exact coordinate points highlighted in the diagram with your own natural features. Luminosity and structural symmetry at these points indicate high active vitality.\n2. Spatial & Mental Resonance: To balance minor asymmetries identified in the diagram coordinates, optimize daily workplace lighting, maintain posture alignment, and integrate corresponding element frequency remedies.\n3. Real-Time Audit: Launch our instant scanner below to map your real-time facial and palm geometry against this coordinate system for a personalized report.`;
  }
}

export function getArticleContent(article: Article, isZh: boolean): string {
  let baseContent = '';

  if (isZh) {
    baseContent = article.content || '';
  } else {
    if (ENGLISH_ARTICLES[article.id]) {
      baseContent = ENGLISH_ARTICLES[article.id];
    } else if (article.contentEn && article.contentEn.trim().length > 30) {
      baseContent = article.contentEn;
    } else {
      baseContent = article.content || '';
    }
  }

  // Check if diagram analysis is already embedded in base content
  const hasDiagramAnalysis = baseContent.includes('特征结构图解分析') || baseContent.includes('Feature Structure Analysis');

  if (!hasDiagramAnalysis) {
    const extraAnalysis = generateDiagramAnalysis(article, isZh);
    return baseContent + extraAnalysis;
  }

  return baseContent;
}
