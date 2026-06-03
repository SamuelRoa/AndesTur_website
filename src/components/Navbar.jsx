import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, ArrowRight, Moon, Sun, Bell, CheckCircle2, Info, Hourglass, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getReservation } from '../services/api';

const STORAGE_KEY = 'andestur_reservations';

function loadReservations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

const STATUS_CONFIG = {
  pending: {
    icon: Hourglass,
    bg: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-200/10 dark:text-yellow-300',
    label: 'Pendiente',
  },
  partial: {
    icon: Info,
    bg: 'bg-blue-100 text-blue-600 dark:bg-blue-200/10 dark:text-blue-300',
    label: 'Pago parcial',
  },
  paid: {
    icon: CheckCircle2,
    bg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-200/10 dark:text-emerald-300',
    label: 'Aprobada',
  },
  cancelled: {
    icon: XCircle,
    bg: 'bg-red-100 text-red-600 dark:bg-red-200/10 dark:text-red-300',
    label: 'Cancelada',
  },
  expired: {
    icon: AlertTriangle,
    bg: 'bg-orange-100 text-orange-600 dark:bg-orange-200/10 dark:text-orange-300',
    label: 'Expirada',
  },
};

export default function Navbar({ onOpenReservation, isDarkMode, onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [reservations, setReservations] = useState(() => loadReservations());
  const [newStatusCount, setNewStatusCount] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const pollRef = useRef(null);

  const syncReservations = useCallback(async () => {
    const stored = loadReservations();
    if (stored.length === 0) return;

    const updated = await Promise.all(
      stored.map(async (r) => {
        try {
          const result = await getReservation(r.id);
          const newState = result.data.pay_state;
          if (newState !== r.pay_state) {
            return { ...r, pay_state: newState, justChanged: true };
          }
          return { ...r, justChanged: false };
        } catch {
          return r;
        }
      })
    );

    const changed = updated.filter((r) => r.justChanged).length;
    if (changed > 0) setNewStatusCount((prev) => prev + changed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setReservations(updated);
  }, []);

  useEffect(() => {
    const initTimer = setTimeout(() => syncReservations(), 100);
    pollRef.current = setInterval(syncReservations, 30000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(pollRef.current);
    };
  }, [syncReservations]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const seenNotifications = () => {
    setNewStatusCount(0);
    const list = reservations.map((r) => ({ ...r, justChanged: false }));
    setReservations(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const hasActiveReservations = reservations.length > 0;
  const badgeCount = newStatusCount > 0 ? newStatusCount : (hasActiveReservations ? reservations.length : 0);

  const navLinks = [
    { name: 'Destinos', href: '#destinos' },
    { name: 'Paquetes', href: '#paquetes' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Opiniones', href: '#opiniones' },
  ];

  const timeAgo = (iso) => {
    const diff = now - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Ahora';
    if (mins < 60) return `Hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Hace ${hrs} h`;
    const days = Math.floor(hrs / 24);
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  };

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

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((open) => !open)}
                aria-label="Abrir notificaciones"
                aria-expanded={notificationsOpen}
                className="p-2 rounded-full text-andes-slate hover:bg-andes-forest/5 dark:text-andes-bone/80 dark:hover:bg-white/10 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-andes-gold text-[10px] font-semibold text-andes-forest">
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 z-50 mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-3xl border border-andes-forest/10 bg-white/95 text-andes-slate shadow-2xl shadow-andes-forest/10 backdrop-blur-xl dark:border-white/10 dark:bg-andes-forest/95 dark:text-andes-bone"
                >
                  <div className="px-4 py-4 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">Notificaciones</h3>
                    {hasActiveReservations && (
                      <button
                        type="button"
                        onClick={seenNotifications}
                        className="text-xs font-medium text-andes-forest/80 hover:text-andes-forest dark:text-andes-bone/80 dark:hover:text-andes-gold transition-colors"
                      >
                        Marcar como leídas
                      </button>
                    )}
                  </div>

                  <div className="px-4 pb-4 space-y-3 divide-y divide-andes-forest/10 dark:divide-white/10">
                    {reservations.length === 0 ? (
                      <p className="pt-3 text-xs text-andes-slate/60 dark:text-andes-bone/60 text-center py-6">
                        No tienes reservas registradas. ¡Empieza tu aventura!
                      </p>
                    ) : (
                      reservations.map((res) => {
                        const cfg = STATUS_CONFIG[res.pay_state] || STATUS_CONFIG.pending;
                        const Icon = cfg.icon;
                        return (
                          <article
                            key={res.id}
                            className={`pt-3 flex items-start gap-3 ${res.justChanged ? 'opacity-100' : 'opacity-90'}`}
                          >
                            <span className={`mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl ${cfg.bg}`}>
                              <Icon className="w-4 h-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm text-andes-slate dark:text-andes-bone">
                                {res.pay_state === 'paid' ? (
                                  <>¡Tu reserva <strong>#{res.id}</strong> ha sido <strong className="text-emerald-600 dark:text-emerald-400">aprobada</strong>!</>
                                ) : res.pay_state === 'cancelled' ? (
                                  <>Tu reserva <strong>#{res.id}</strong> ha sido <strong className="text-red-600 dark:text-red-400">cancelada</strong>.</>
                                ) : res.pay_state === 'expired' ? (
                                  <>Tu reserva <strong>#{res.id}</strong> ha <strong className="text-orange-600 dark:text-orange-400">expirado</strong>.</>
                                ) : (
                                  <>Reserva <strong>#{res.id}</strong> — {res.packageName}: {cfg.label}</>
                                )}
                              </p>
                              <p className="text-xs text-andes-slate/60 dark:text-andes-bone/60 mt-1">{timeAgo(res.createdAt)}</p>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </div>

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
