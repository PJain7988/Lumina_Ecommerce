import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi'

const footerLinks = {
  Company: [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
    { name: 'Contact', path: '/contact' },
  ],
  Support: [
    { name: 'Help Center', path: '/help' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Returns', path: '/returns' },
    { name: 'Track Order', path: '/dashboard/orders' },
  ],
  Legal: [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
  ],
  Sell: [
    { name: 'Sell on Lumina', path: '/seller' },
    { name: 'Seller Center', path: '/seller' },
    { name: 'Seller Policies', path: '/seller/policies' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-secondary text-gray-400 mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display font-bold text-2xl text-white">
                Lumi<span className="text-accent">na</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Premium marketplace for curated products. Shop with confidence.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><FiFacebook /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><FiTwitter /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><FiInstagram /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><FiYoutube /></a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold mb-1">Subscribe to our newsletter</h4>
              <p className="text-sm">Get the latest offers and product launches.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
              />
              <button type="submit" className="btn-primary shrink-0">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
          <p>© {new Date().getFullYear()} Lumina. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>🔒 Secure Payments</span>
            <span>🚚 Fast Delivery</span>
            <span>↩️ Easy Returns</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
