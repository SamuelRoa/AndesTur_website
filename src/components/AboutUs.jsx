import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mountain, Route, Users } from 'lucide-react';

export default function AboutUs({ onContactClick }) {
  return (
    <section id="nosotros" className="py-24 sm:py-28 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Images (Asymmetric Layout) */}
        <div className="lg:col-span-6 relative flex flex-col sm:flex-row gap-6">
          {/* Main larger image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
            className="w-full sm:w-2/3 h-[450px] rounded-2xl overflow-hidden shadow-premium-lg border border-andes-forest/5 relative z-10 bg-stone-100"
          >
            <img
              src="/1.png"
              alt="Hiker in Venezuelan Andes"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </motion.div>

          {/* Secondary overlapping image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="hidden sm:block absolute right-0 bottom-[-30px] w-1/2 h-[280px] rounded-2xl overflow-hidden shadow-premium-lg border border-white dark:border-[#1a1f2e] z-20 bg-stone-100"
          >
            <img
              src="/potosi.jpeg"
              alt="Mountain landscapes and flora"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </motion.div>
        </div>

        {/* Right Side: Text & Stats */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          className="lg:col-span-6 flex flex-col text-left"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-andes-gold/10 text-andes-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 w-fit">
            <Mountain className="w-3 h-3" />
            Gente de Montaña
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-andes-forest mt-2 leading-tight">
            Nuestra pasión por la Cordillera
          </h2>
          
          <p className="text-sm sm:text-base text-andes-slate mt-6 leading-relaxed font-light">
            Nacimos en el corazón de los Andes venezolanos. Para nosotros, la montaña no es solo un destino turístico, es un santuario biológico y cultural que merece ser recorrido con profundo respeto y admiración.
          </p>

          <p className="text-sm sm:text-base text-andes-slate mt-4 leading-relaxed font-light">
            En <strong className="text-andes-forest dark:text-white">AndesTur</strong> diseñamos expediciones que entrelazan el senderismo deportivo con las leyendas orales, el café recién colado en los páramos nublados y el cobijo de las posadas de piedra. Nuestro compromiso es brindarte un viaje seguro, refinado y en armonía con las comunidades locales.
          </p>

          {/* Mini-Stats Grid */}
          <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-andes-forest/5 dark:border-white/5">
            {[
              { value: '12+', label: 'Años Guiando', icon: Mountain },
              { value: '50+', label: 'Rutas Trazadas', icon: Route },
              { value: '100%', label: 'Guías Locales', icon: Users },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="group">
                  <div className="w-10 h-10 rounded-xl bg-andes-gold/10 flex items-center justify-center mb-3 group-hover:bg-andes-gold/20 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-andes-gold" />
                  </div>
                  <span className="block text-2xl sm:text-3xl font-serif font-bold text-andes-gold">{stat.value}</span>
                  <span className="text-[10px] sm:text-xs text-andes-slate/60 uppercase tracking-wider font-medium mt-1 block">{stat.label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-10">
            <button
              onClick={onContactClick}
              className="inline-flex items-center gap-2.5 text-xs font-semibold text-andes-gold hover:text-andes-goldHover uppercase tracking-[0.2em] transition-all duration-300 group px-5 py-3 rounded-xl border border-andes-gold/20 hover:border-andes-gold/40 hover:bg-andes-gold/5"
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
