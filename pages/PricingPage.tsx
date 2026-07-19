
import React from 'react';
import { theme, styles } from '../theme';
import { Plan } from '../types';

export const PricingPage = ({ t, onSelectPlan }: { t: any, onSelectPlan: (plan: Plan) => void }) => {
    const plans: Plan[] = [
        { id: 'sub_monthly', title: t.planSubMonth, price: t.planSubMonthPrice, desc: t.planSubMonthDesc, isSub: true, priceId: 'price_monthly_placeholder' },
        { id: 'one_month', title: t.planOneMonth, price: t.planOneMonthPrice, desc: t.planOneMonthDesc, isSub: true, priceId: 'price_onemonth_placeholder' },
        { id: 'sub_year', title: t.planSubYear, price: t.planSubYearPrice, desc: t.planSubYearDesc, isSub: true, priceId: 'price_yearly_placeholder' },
    ];
    return (
      <div style={{maxWidth: '1200px', width: '95%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h2 style={{color: theme.gold, fontFamily: '"Space Grotesk", sans-serif', fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center'}}>{t.pricingTitle}</h2>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', width: '100%'}}>
          {plans.map((plan, idx) => {
              const isFeatured = plan.id === 'sub_monthly';
              return (
                <div key={idx} style={{...styles.glassPanel, maxWidth: '280px', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: isFeatured ? `2px solid rgba(102, 192, 244, 0.85)` : `1px solid rgba(102, 192, 244, 0.22)`, transform: isFeatured ? 'scale(1.05)' : 'scale(1)', zIndex: isFeatured ? 2 : 1}}>
                    {isFeatured && <div style={{position: 'absolute', top: '-15px', background: 'rgba(102, 192, 244, 1)', color: '#0d121a', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'}}>POPULAR</div>}
                    <h3 style={{color: theme.gold, fontSize: '1.2rem', marginBottom: '0.5rem', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>{plan.title}</h3>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: theme.text, marginBottom: '1rem', fontFamily: '"Space Grotesk", sans-serif'}}>{plan.price}</div>
                    <p style={{textAlign: 'center', color: '#ccc', marginBottom: '2rem', flex: 1, fontSize: '0.9rem'}}>{plan.desc}</p>
                    <button style={{...styles.button, minWidth: 'auto', width: '100%'}} onClick={() => onSelectPlan(plan)}>{t.selectPlan}</button>
                </div>
              );
          })}
        </div>
      </div>
    );
};
