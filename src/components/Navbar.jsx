import { useState } from 'react';
import { Menu, X, ArrowRight, Moon, Sun, Search } from 'lucide-react';

export default function Navbar({ onOpenReservation, isDarkMode, onToggleTheme, onOpenQuery }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = [
    { name: 'Destinos', href: '#destinos' },
    { name: 'Paquetes', href: '#paquetes' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Opiniones', href: '#opiniones' },
  ];


  return (
    <nav className="sticky top-0 z-40 w-full glass dark:bg-andes-forest/80 dark:border-b-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-andes-forest flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-sm border border-white/10">
              <img
                src="/logo.png"
                alt="AndesTur Logo"
                className="w-full h-full object-cover scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <span className="text-xl font-serif font-semibold tracking-wide text-andes-forest dark:text-andes-bone">
              Andes<span className="text-andes-gold dark:text-andes-gold">Tur</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-andes-slate dark:text-andes-bone/80 hover:text-andes-forest dark:hover:text-andes-gold transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle Dark Mode"
              aria-pressed={isDarkMode}
              className="p-2 rounded-full text-andes-slate hover:bg-andes-forest/5 dark:text-andes-bone/80 dark:hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <a
              href="https://wa.me/584247699792?text=%C2%A1Hola!%20%F0%9F%91%8B%20Quiero%20informaci%C3%B3n%20sobre%20sus%20paquetes%20tur%C3%ADsticos%20%F0%9F%8F%94%EF%B8%8F"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Quiero saber más
            </a>

            <button
              type="button"
              onClick={onOpenQuery}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-andes-forest/20 text-andes-forest hover:bg-andes-forest/5 dark:text-andes-bone dark:border-white/20 dark:hover:bg-white/10 transition-all flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Consultar Reserva
            </button>

            <button
              onClick={() => onOpenReservation()}
              className="px-5 py-2.5 bg-andes-forest hover:bg-andes-forest/90 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow transition-all duration-300 group"
            >
              Reservar
              <ArrowRight className="w-3.5 h-3.5 text-andes-gold transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle Dark Mode"
              aria-pressed={isDarkMode}
              className="p-2 rounded-full text-andes-slate hover:bg-andes-forest/5 dark:text-andes-bone/80 dark:hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-andes-forest dark:text-andes-bone hover:bg-andes-forest/5 dark:hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Menú principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-andes-bone dark:bg-andes-forest border-b border-andes-forest/5 dark:border-white/10 px-6 pt-2 pb-6 space-y-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-andes-slate dark:text-andes-bone/90 hover:text-andes-forest dark:hover:text-andes-gold transition-colors py-2"
              >
                {link.name}
              </a>
            ))}

            <a
              href="https://wa.me/584247699792?text=%C2%A1Hola!%20%F0%9F%91%8B%20Quiero%20informaci%C3%B3n%20sobre%20sus%20paquetes%20tur%C3%ADsticos%20%F0%9F%8F%94%EF%B8%8F"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Quiero saber más
            </a>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenQuery(); }}
              className="w-full py-3 border border-andes-forest/20 dark:border-white/20 text-andes-forest dark:text-andes-bone text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Search className="w-4 h-4" />
              Consultar Reserva
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="w-full py-3 bg-andes-gold hover:bg-andes-goldHover text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              Reservar Viaje
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
