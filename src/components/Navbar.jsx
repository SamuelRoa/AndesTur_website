import React, { useState } from 'react';
import { Menu, X, ArrowRight, Moon, Sun } from 'lucide-react';

export default function Navbar({ onOpenReservation, isDarkMode, onToggleTheme }) {
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

          <div className="hidden md:flex items-center gap-4">
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
