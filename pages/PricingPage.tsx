import React from 'react';
import { theme, styles } from '../theme';
import { Plan } from '../types';
import { Sparkles, CheckCircle2, Shield, Zap, Crown } from 'lucide-react';
import { TopHeaderNav } from '../components/HeaderControls';

export const PricingPage = ({ t, onSelectPlan, onBack, onClose }: { t: any, onSelectPlan: (plan: Plan) => void, onBack?: () => void, onClose?: () => void }) => {
    const plans: (Plan & { maxUses: string; isPopular?: boolean })[] = [
        { 
          id: 'one_month', 
          title: t.planOneMonth || '单月使用', 
          price: t.planOneMonthPrice || '$19.99', 
          maxUses: t.planOneMonthMaxUses || '最高使用 100 次',
          desc: t.planOneMonthDesc || '单月畅享版，30天内最高可测算 100 次，一次性支付不自动续费。', 
          isSub: false 
        },
        { 
          id: 'sub_monthly', 
          title: t.planSubMonth || '连续包月', 
          price: t.planSubMonthPrice || '$16.99 /月', 
          maxUses: t.planSubMonthMaxUses || '最高使用 100 次/月',
          desc: t.planSubMonthDesc || '连续包月超值方案，每月最高可测算 100 次，按月自动续费，随时可取消。', 
          isSub: true, 
          isPopular: true,
          priceId: 'price_monthly_placeholder' 
        },
        { 
          id: 'sub_year', 
          title: t.planSubYear || '包年会员', 
          price: t.planSubYearPrice || '$99.99 /年', 
          maxUses: t.planSubYearMaxUses || '最高使用 1200 次',
          desc: t.planSubYearDesc || '尊享包年方案，全年最高可测算 1200 次，单次低至 $0.08，最划算首选！', 
          isSub: true, 
          priceId: 'price_yearly_placeholder' 
        },
    ];

    return (
      <div style={{ maxWidth: '1100px', width: '95%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0 3.5rem 0' }}>
        
        {/* Top View Header Controls for Back & Close */}
        <TopHeaderNav t={t} onBack={onBack} onClose={onClose} title={t.tierTitle || "VIP 订阅中心"} />

        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(102, 192, 244, 0.1)', border: '1px solid rgba(102, 192, 244, 0.3)', padding: '6px 16px', borderRadius: '20px', color: theme.gold, fontSize: '0.85rem', marginBottom: '1rem' }}>
            <Sparkles size={16} />
            <span>{t.tierTitle || 'VIP 会员方案与尊享特权'}</span>
          </div>
          <h2 style={{ color: '#ffffff', fontFamily: '"Space Grotesk", "Cinzel", sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, margin: '0 0 0.75rem 0' }}>
            {t.pricingTitle || '选择属于您的会员尊享方案'}
          </h2>
          <p style={{ color: '#A0B0C0', maxWidth: '680px', margin: '0 auto', fontSize: '0.98rem', lineHeight: '1.6' }}>
            {t.tierSubtitle || '支持单次精准买断，或选择包月/包年 VIP 无限测算特权'}
          </p>
        </div>

        {/* Plans Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          width: '100%',
          alignItems: 'stretch'
        }}>
          {plans.map((plan) => {
            const isFeatured = Boolean(plan.isPopular);
            return (
              <div
                key={plan.id}
                style={{
                  ...styles.glassPanel,
                  position: 'relative',
                  padding: '2.2rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  border: isFeatured ? '1.5px solid rgba(255, 215, 0, 0.8)' : '1px solid rgba(102, 192, 244, 0.25)',
                  background: isFeatured
                    ? 'linear-gradient(160deg, rgba(30, 48, 70, 0.95) 0%, rgba(18, 28, 42, 0.98) 100%)'
                    : 'linear-gradient(160deg, rgba(23, 38, 54, 0.75) 0%, rgba(17, 26, 38, 0.85) 100%)',
                  boxShadow: isFeatured ? '0 15px 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(255, 215, 0, 0.08)' : '0 10px 30px rgba(0,0,0,0.6)'
                }}
              >
                {isFeatured && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                    color: '#0D121A',
                    padding: '4px 16px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px'
                  }}>
                    {t.popularBadge || 'MOST POPULAR'}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ color: theme.gold, fontSize: '1.35rem', fontWeight: 700, margin: 0, fontFamily: '"Space Grotesk", sans-serif' }}>
                    {plan.title}
                  </h3>
                  {isFeatured ? <Crown size={22} color="#FFD700" /> : <Zap size={22} color="#66C0F4" />}
                </div>

                {/* Max Uses Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 215, 0, 0.12)',
                  border: '1px solid rgba(255, 215, 0, 0.4)',
                  color: '#FFD700',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  width: 'fit-content'
                }}>
                  <span>⚡ {plan.maxUses}</span>
                </div>

                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem 0', fontFamily: '"Space Grotesk", sans-serif' }}>
                  {plan.price}
                </div>

                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
                  {plan.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#D6E2EB' }}>
                    <CheckCircle2 size={16} color="#66C0F4" />
                    <span>{t.featureAiBiometrics || 'AI 生物特征毫秒级识别与建模'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#D6E2EB' }}>
                    <CheckCircle2 size={16} color="#66C0F4" />
                    <span>{t.featureBaziAnalysis || '八字五行生克与命理大运解析'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#00FFD0' }}>
                    <CheckCircle2 size={16} color="#00FFD0" />
                    <span>{plan.maxUses} {t.featureVipPrivileges || 'VIP 算命特权'}</span>
                  </div>
                </div>

                <button
                  style={{
                    ...styles.button,
                    width: '100%',
                    background: isFeatured ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #1A44C2, #47BFFF)',
                    color: isFeatured ? '#0d121a' : '#ffffff',
                    fontWeight: 'bold',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: 'auto'
                  }}
                  onClick={() => onSelectPlan(plan)}
                >
                  {plan.isSub ? (t.subscribeNow || '立即开通会员') : (t.subscribeSingleNow || '立即开通单月')}
                </button>
              </div>
            );
          })}
        </div>

        {/* Security guarantee footer */}
        <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#8A9BB0', fontSize: '0.85rem' }}>
          <Shield size={16} color="#66C0F4" />
          <span>{t.sslSecurityNotice || '采用银行级 SSL 加密交易 · 随时在账户中心取消订阅'}</span>
        </div>

      </div>
    );
};
