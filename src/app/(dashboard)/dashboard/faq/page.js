export const instant = false;

import { HelpCircle } from 'lucide-react';

const faqs = [
  { q: "How do I place an order?", a: "Go to the Shop page, select your product, and click Order Now." },
  { q: "What are the delivery charges?", a: "Delivery is free for orders over ৳ 2000. Otherwise, a nominal fee applies." },
  { q: "How long does delivery take?", a: "Typically 2-4 hours within the city area." },
  { q: "Can I cancel my order?", a: "Yes, you can cancel before the order is marked as 'Delivered' by contacting support." },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-500/10 rounded-xl">
          <HelpCircle className="w-6 h-6 text-brand-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Frequently Asked Questions</h1>
          <p className="text-sm text-slate-400">Find answers to common questions</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-surface-800 border border-surface-700 rounded-xl p-5">
            <h3 className="text-white font-medium mb-2">{f.q}</h3>
            <p className="text-sm text-slate-400">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
