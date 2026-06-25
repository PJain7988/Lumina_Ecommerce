import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export function About() {
  return (
    <div className="container-custom py-12 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-4xl text-brand mb-4">About Lumina</h1>
        <p className="text-lg text-gray-500 mb-8">Redefining premium shopping, one product at a time.</p>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="font-display font-semibold text-xl text-brand mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">Lumina was founded with a single purpose: to create a marketplace where quality meets trust. We carefully curate every product and seller to ensure our customers receive only the best.</p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-xl text-brand mb-3">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">We envision a world where premium shopping is accessible to everyone. Through technology and curation, we're building the future of e-commerce in India.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 p-8 bg-gradient-to-r from-primary to-accent rounded-3xl text-white text-center">
          {[{ n: '1M+', l: 'Happy Customers' }, { n: '50K+', l: 'Products' }, { n: '10K+', l: 'Verified Sellers' }].map((s) => (
            <div key={s.l}><p className="font-display font-bold text-3xl">{s.n}</p><p className="text-white/70 text-sm mt-1">{s.l}</p></div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export function Contact() {
  return (
    <div className="container-custom py-12 max-w-4xl">
      <h1 className="font-display font-bold text-3xl text-brand mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">We're here to help. Reach out anytime.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-brand mb-4">Send a Message</h2>
          <div><label className="label">Name</label><input className="input-field" placeholder="Your name" /></div>
          <div><label className="label">Email</label><input type="email" className="input-field" placeholder="your@email.com" /></div>
          <div><label className="label">Message</label><textarea className="input-field resize-none" rows={4} placeholder="How can we help?" /></div>
          <button className="btn-primary w-full">Send Message</button>
        </div>
        <div className="space-y-4">
          {[
            { icon: FiMail, title: 'Email', value: 'support@lumina.shop' },
            { icon: FiPhone, title: 'Phone', value: '+91 1800-LUMINA' },
            { icon: FiMapPin, title: 'Office', value: 'Mumbai, Maharashtra, India' },
          ].map((c) => (
            <div key={c.title} className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><c.icon /></div>
              <div><p className="text-xs text-gray-400">{c.title}</p><p className="font-medium text-brand">{c.value}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  const faqs = [
    { q: 'How do I track my order?', a: 'Go to Dashboard → My Orders → click on your order to see real-time tracking.' },
    { q: 'What is the return policy?', a: 'We offer 30-day easy returns on most products. Simply initiate a return from your order page.' },
    { q: 'How can I become a seller?', a: 'Register with the "Seller" role and complete your seller profile. Our team will review and approve within 24 hours.' },
    { q: 'Are payments secure?', a: 'Yes. All payments are SSL-encrypted and processed through Razorpay/Stripe, which are PCI-DSS compliant.' },
    { q: 'When will I get my refund?', a: 'Refunds are processed within 5-7 business days after we receive the returned item.' },
  ]
  return (
    <div className="container-custom py-12 max-w-3xl">
      <h1 className="font-display font-bold text-3xl text-brand mb-8">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="card p-5">
            <h3 className="font-semibold text-brand mb-2">{faq.q}</h3>
            <p className="text-gray-500 text-sm">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HelpCenter() {
  const topics = [
    { emoji: '📦', title: 'Orders & Shipping', desc: 'Track orders, shipping info, delivery times' },
    { emoji: '↩️', title: 'Returns & Refunds', desc: 'Return process, refund timelines, policies' },
    { emoji: '💳', title: 'Payments', desc: 'Payment methods, failed payments, billing' },
    { emoji: '👤', title: 'Account', desc: 'Profile, security, notifications, preferences' },
    { emoji: '🏪', title: 'Selling on Lumina', desc: 'Seller registration, listing products, payouts' },
    { emoji: '💬', title: 'Contact Support', desc: 'Chat, email, or call our support team' },
  ]
  return (
    <div className="container-custom py-12">
      <div className="text-center mb-10">
        <h1 className="font-display font-bold text-3xl text-brand mb-2">Help Center</h1>
        <p className="text-gray-500">Find answers to common questions</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {topics.map((t) => (
          <div key={t.title} className="card-hover p-6 text-center cursor-pointer">
            <span className="text-4xl mb-3 block">{t.emoji}</span>
            <h3 className="font-semibold text-brand mb-1 text-sm">{t.title}</h3>
            <p className="text-xs text-gray-500">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default About
