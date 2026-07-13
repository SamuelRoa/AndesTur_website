import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer({ onOpenReservation }) {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#071a0e] via-[#0f2e1e] to-[#1a402a] text-stone-300 pt-20 pb-10 px-6 sm:px-8 lg:px-12">
      {/* Gold top border glow */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-andes-gold/40 to-transparent" />
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-transparent via-andes-gold/[0.04] to-transparent blur-xl pointer-events-none" />
      
      {/* Atmospheric glows */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-gradient-to-bl from-andes-gold/[0.03] via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[35rem] h-[35rem] bg-gradient-to-tr from-white/[0.015] via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 relative z-10">
        {/* Brand column */}
        <div className="md:col-span-5 flex flex-col items-start text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/[0.07] flex items-center justify-center overflow-hidden border border-white/10 backdrop-blur-sm">
              <img 
                src="/logo.png" 
                alt="AndesTur Logo" 
                className="w-full h-full object-cover scale-110" 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <span className="text-xl font-serif font-semibold tracking-wide text-white">
              Andes<span className="text-andes-gold">Tur</span>
            </span>
          </div>
          <p className="text-sm font-light text-stone-400 max-w-sm leading-relaxed mb-6">
            Diseñamos travesías memorables que conectan tu espíritu con la majestuosidad y la esencia cultural de los Andes venezolanos.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-stone-400 hover:text-white hover:bg-andes-gold hover:border-andes-gold hover:shadow-lg hover:shadow-andes-gold/20 transition-all duration-300"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-stone-400 hover:text-white hover:bg-andes-gold hover:border-andes-gold hover:shadow-lg hover:shadow-andes-gold/20 transition-all duration-300"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="md:col-span-3 flex flex-col items-start text-left">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-andes-gold/90 mb-6">Navegación</h4>
          <ul className="space-y-3.5 text-sm font-light text-stone-400">
            <li><a href="#destinos" className="hover:text-white hover:translate-x-0.5 transition-all duration-200 inline-block">Destinos</a></li>
            <li><a href="#paquetes" className="hover:text-white hover:translate-x-0.5 transition-all duration-200 inline-block">Paquetes Turísticos</a></li>
            <li><a href="#nosotros" className="hover:text-white hover:translate-x-0.5 transition-all duration-200 inline-block">Nosotros</a></li>
            <li>
              <button 
                onClick={() => onOpenReservation()}
                className="hover:text-white hover:translate-x-0.5 transition-all duration-200 text-left"
              >
                Reservar Cupo
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="md:col-span-4 flex flex-col items-start text-left">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-andes-gold/90 mb-6">Contacto</h4>
          <ul className="space-y-4 text-sm font-light text-stone-400">
            <li className="flex items-start gap-3 group">
              <span className="w-5 h-5 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-andes-gold/10 group-hover:border-andes-gold/20 transition-all duration-300">
                <MapPin className="w-3 h-3 text-andes-gold/80" />
              </span>
              <span className="group-hover:text-stone-300 transition-colors duration-300">Av. Principal de Pueblo Nuevo.</span>
            </li>
            <li className="flex items-center gap-3 group">
              <span className="w-5 h-5 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-andes-gold/10 group-hover:border-andes-gold/20 transition-all duration-300">
                <Phone className="w-3 h-3 text-andes-gold/80" />
              </span>
              <span className="group-hover:text-stone-300 transition-colors duration-300">+58 (412) 219-2793 / +58 (424) 769-9792</span>
            </li>
            <li className="flex items-center gap-3 group">
              <span className="w-5 h-5 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-andes-gold/10 group-hover:border-andes-gold/20 transition-all duration-300">
                <Mail className="w-3 h-3 text-andes-gold/80" />
              </span>
              <span className="group-hover:text-stone-300 transition-colors duration-300">andes.tur21@gmail.com</span>
            </li>
            <li className="flex items-center gap-3">
              <a
                href="https://wa.me/584247699792?text=%C2%A1Hola!%20%F0%9F%91%8B%20Quiero%20informaci%C3%B3n%20sobre%20sus%20paquetes%20tur%C3%ADsticos%20%F0%9F%8F%94%EF%B8%8F"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 group"
              >
                <span className="w-5 h-5 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-andes-gold/10 group-hover:border-andes-gold/20 transition-all duration-300">
                  <svg className="w-3 h-3 text-andes-gold/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </span>
                <span className="group-hover:text-white transition-colors duration-200">+58 (424) 769-9792</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 relative z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-light gap-4">
          <p>&copy; {new Date().getFullYear()} AndesTur. Todos los derechos reservados. Turismo consciente y sustentable.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-stone-300 transition-colors duration-200">Términos de Servicio</a>
            <a href="#" className="hover:text-stone-300 transition-colors duration-200">Políticas de Cancelación</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
