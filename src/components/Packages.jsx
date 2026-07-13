import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Info, Sparkles } from 'lucide-react';

export default function Packages({ onSelectPackage }) {
  const packages = [
    {
      id: "esencial",
      name: "Aventura en Mérida",
      price: "100",
      description: "Recorrido por la Sierra Nevada y el Páramo la Culata",
      features: [
        "Alojamiento en posadas típicas seleccionadas",
        "Desayunos criollos andinos incluidos",
        "Traslados internos hacia puntos de inicio",
        "Guías locales en puntos de interés",
        "Soporte digital con mapas sin conexión"
      ],
      isPopular: false,
      recommendedFor: "Viajeros independientes"
    },
    {
      id: "montaña adentro",
      name: "Ruta del Táchira",
      price: "50",
      description: "Visita las minas de Lobatera y un recorrido de trekking por las montañas tachirenses.",
      features: [
        "Traslado a puntos estratégicos ida y vuelta",
        "Pensión completa (gastronomía gourmet regional)",
        "Guía certificado exclusivo para tu grupo",
      ],
      isPopular: true,
      recommendedFor: "Familias y Parejas"
    },
    {
      id: "cultural",
      name: "Trujillo Mágico",
      price: "100",
      description: "Viaje a la Virgen de la Paz y escapada a Boconó, un viaje cultural inolvidable.",
      features: [
        "Transporte certificado a puntos estratégicos",
        "Alimentación completa durante el recorrido",
        "Guía de la Asociación de Guías de Montaña (AGMV)",
        "Alojamiento en posadas típicas seleccionadas",
        "Actividades interactivas y explicaciones detalladas",
      ],
      isPopular: false,
      recommendedFor: "Viajeros culturales"
    }
  ];

  return (
    <section id="paquetes" className="py-24 sm:py-28 bg-stone-100/50 dark:bg-transparent px-6 sm:px-8 lg:px-12 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-andes-gold/10 text-andes-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4"
          >
            <Sparkles className="w-3 h-3" />
            Planes de Viaje
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-andes-forest dark:text-white mt-2"
          >
            Paquetes Turísticos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-andes-slate dark:text-gray-400 mt-4 leading-relaxed font-light"
          >
            Elige el nivel de aventura y comodidad que mejor se adapte a tu estilo. Todos nuestros paquetes son personalizables.
          </motion.p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.25, 1, 0.5, 1] }}
              whileHover={{ y: -6 }}
              className={`relative flex flex-col bg-white dark:bg-[#1a1f2e] rounded-2xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg border transition-all duration-500 ${
                pkg.isPopular ? 'border-andes-gold/50 ring-1 ring-andes-gold/20' : 'border-andes-forest/5 dark:border-white/5'
              }`}
            >
              {/* Popular Badge */}
              {pkg.isPopular && (
                <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-andes-gold to-[#D4AF6A] text-white text-[10px] font-semibold tracking-widest uppercase px-5 py-1.5 rounded-full shadow-lg shadow-andes-gold/20 flex items-center gap-1.5">
                  <Star className="w-3 h-3 fill-white" /> Recomendado
                </div>
              )}

              {/* Title & Info */}
              <div className="mb-6">
                <span className="text-[10px] font-semibold text-andes-slate/60 dark:text-gray-400 uppercase tracking-wider bg-andes-forest/5 dark:bg-white/5 px-2.5 py-1 rounded">
                  {pkg.recommendedFor}
                </span>
                <h3 className="text-2xl font-serif font-bold text-andes-forest dark:text-white mt-4">{pkg.name}</h3>
                <p className="text-xs sm:text-sm text-andes-slate dark:text-gray-400 font-light mt-3 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline mb-6 border-b border-andes-forest/5 dark:border-white/5 pb-6">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-andes-forest dark:text-white">${pkg.price}</span>
                <span className="text-xs text-andes-slate/60 dark:text-gray-500 ml-2 font-medium">/ por persona</span>
              </div>

              {/* Features List */}
              <ul className="space-y-3.5 flex-1 mb-8">
                {pkg.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-start gap-3 text-xs sm:text-sm text-andes-slate dark:text-gray-300 font-light">
                    <span className="w-5 h-5 rounded-full bg-andes-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-andes-gold" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Action button */}
              <button
                onClick={() => onSelectPackage(pkg.name)}
                className={`w-full py-3.5 text-xs font-semibold rounded-xl tracking-wider uppercase transition-all duration-300 ${
                  pkg.isPopular
                    ? 'btn-premium text-white shadow-md'
                    : 'bg-andes-forest/5 dark:bg-white/5 text-andes-forest dark:text-white hover:bg-andes-forest dark:hover:bg-andes-gold hover:text-white border border-andes-forest/5 dark:border-white/5'
                }`}
              >
                Elegir Plan
              </button>
            </motion.div>
          ))}
        </div>

        {/* Custom Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 bg-white dark:bg-[#1a1f2e] rounded-2xl p-6 sm:p-8 border border-andes-forest/5 dark:border-white/5 shadow-premium max-w-3xl mx-auto flex flex-col sm:flex-row gap-5 items-start sm:items-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-andes-gold/20 to-andes-gold/5 flex items-center justify-center shrink-0 border border-andes-gold/10">
            <Info className="w-5 h-5 text-andes-gold" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-andes-forest dark:text-white">¿Viajas en grupo o buscas algo a medida?</h4>
            <p className="text-xs text-andes-slate dark:text-gray-400 mt-1 leading-relaxed">
              Podemos ajustar cualquiera de las rutas, agregar noches adicionales, coordinar vuelos nacionales desde Caracas u organizar expediciones científicas privadas. Contáctanos directamente.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
