import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: ['3 repurposes/month', 'All 5 platforms', 'Basic support'],
    cta: 'Start Free',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Creator',
    price: '$19',
    period: '/month',
    features: ['30 repurposes/month', 'Brand voice settings', 'Priority support', 'Export options'],
    cta: 'Upgrade',
    href: '/signup?plan=creator',
    popular: true,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    features: ['Unlimited repurposes', 'API access', 'Team seats', 'Custom templates'],
    cta: 'Contact Us',
    href: 'mailto:hello@repurposeflow.com',
    popular: false,
  },
];

export function PricingCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>
          )}

          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold text-foreground">{plan.price}</span>
              <span className="text-muted">{plan.period}</span>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Link href={plan.href} className="block">
              <Button
                variant={plan.popular ? 'primary' : 'secondary'}
                className="w-full"
              >
                {plan.cta}
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
