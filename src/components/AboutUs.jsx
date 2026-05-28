import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AboutUs({ onContactClick }) {
  return (
    <section id="nosotros" className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Images (Asymmetric Layout) */}
        <div className="lg:col-span-6 relative flex flex-col sm:flex-row gap-6">
          {/* Main larger image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full sm:w-2/3 h-[450px] rounded-2xl overflow-hidden shadow-md border border-andes-forest/5 relative z-10 bg-stone-100"
          >
            <img
              src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=800&auto=format&fit=crop"
              alt="Hiker in Venezuelan Andes"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Secondary overlapping image (hidden on small mobile, visible on sm+) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden sm:block absolute right-0 bottom-[-30px] w-1/2 h-[280px] rounded-2xl overflow-hidden shadow-lg border border-andes-bone z-20 bg-stone-100"
          >
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop"
              alt="Mountain landscapes and flora"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Right Side: Text & Stats */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 flex flex-col text-left"
        >
          <span className="text-xs font-semibold tracking-widest text-andes-gold uppercase">Gente de Montaña</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-andes-forest mt-2">
            Nuestra pasión por la Cordillera
          </h2>
          
          <p className="text-sm sm:text-base text-andes-slate mt-6 leading-relaxed font-light">
            Nacimos en el corazón de los Andes venezolanos. Para nosotros, la montaña no es solo un destino turistico, es un santuario biológico y cultural que merece ser recorrido con profundo respeto y admiración.
          </p>

          <p className="text-sm sm:text-base text-andes-slate mt-4 leading-relaxed font-light">
            En <strong>AndesTur</strong> diseñamos expediciones que entrelazan el senderismo deportivo con las leyendas orales, el café recién colado en los páramos nublados y el cobijo de las posadas de piedra. Nuestro compromiso es brindarte un viaje seguro, refinado y en armonía con las comunidades locales.
          </p>

          {/* Mini-Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-andes-forest/5">
            <div>
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-andes-gold">12+</span>
              <span className="text-[10px] sm:text-xs text-andes-slate uppercase tracking-wider font-medium">Años Guiando</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-andes-gold">50+</span>
              <span className="text-[10px] sm:text-xs text-andes-slate uppercase tracking-wider font-medium">Rutas Trazadas</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-andes-gold">100%</span>
              <span className="text-[10px] sm:text-xs text-andes-slate uppercase tracking-wider font-medium">Guías Locales</span>
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={onContactClick}
              className="inline-flex items-center gap-2 text-xs font-semibold text-andes-gold hover:text-andes-goldHover uppercase tracking-widest transition-all duration-300 group"
            >
              Hablemos de tu próximo viaje
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
