import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Info } from 'lucide-react';

export default function Packages({ onSelectPackage }) {
  const packages = [
    {
      id: "esencial",
      name: "Esencial Andino",
      price: "180",
      description: "Ideal para escapadas de fin de semana y exploradores que prefieren viajar a su propio ritmo.",
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
      id: "premium",
      name: "Aventura Premium",
      price: "350",
      description: "La combinación perfecta entre confort y senderismo. Diseñado para vivir los Andes sin preocupaciones.",
      features: [
        "Estancia en hoteles boutique y posadas premium",
        "Pensión completa (gastronomía gourmet regional)",
        "Vehículo privado 4x4 todo el trayecto",
        "Guía certificado exclusivo para tu grupo",
        "Seguro de viaje andino y kit de bienvenida",
        "Entradas garantizadas a parques y atracciones"
      ],
      isPopular: true,
      recommendedFor: "Familias y Parejas"
    },
    {
      id: "extrema",
      name: "Expedición Extrema",
      price: "490",
      description: "Para los montañistas experimentados que buscan desafiar las cumbres más altas de Venezuela.",
      features: [
        "Refugios de montaña y campamentos base",
        "Alimentación adaptada a alta montaña (liofilizada/fresca)",
        "Guía de la Asociación de Guías de Montaña (AGMV)",
        "Equipo técnico: crampones, cuerdas, arnés",
        "Porteadores para equipo logístico común",
        "Monitoreo satelital y kit de rescate de emergencia"
      ],
      isPopular: false,
      recommendedFor: "Montañistas experimentados"
    }
  ];

  return (
    <section id="paquetes" className="py-24 bg-stone-100/50 dark:bg-transparent px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-andes-gold uppercase">Planes de Viaje</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-andes-forest dark:text-white mt-2">Paquetes Turísticos</h2>
          <p className="text-sm sm:text-base text-andes-slate dark:text-gray-400 mt-4 leading-relaxed font-light">
            Elige el nivel de aventura y comodidad que mejor se adapte a tu estilo. Todos nuestros paquetes son personalizables.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`relative flex flex-col bg-white dark:bg-[#262626] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg border transition-all duration-300 ${
                pkg.isPopular ? 'border-andes-gold/70 ring-1 ring-andes-gold/30' : 'border-andes-forest/5 dark:border-white/5'
              }`}
            >
              {/* Popular Badge */}
              {pkg.isPopular && (
                <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2 bg-andes-gold text-white text-[10px] font-semibold tracking-widest uppercase px-4 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" /> Recomendado
                </div>
              )}

              {/* Title & Info */}
              <div className="mb-6">
                <span className="text-[10px] font-semibold text-andes-slate dark:text-gray-300 uppercase tracking-wider bg-stone-100 dark:bg-white/5 px-2 py-0.5 rounded">
                  {pkg.recommendedFor}
                </span>
                <h3 className="text-2xl font-serif font-bold text-andes-forest dark:text-white mt-3">{pkg.name}</h3>
                <p className="text-xs sm:text-sm text-andes-slate dark:text-gray-400 font-light mt-2 leading-relaxed h-12 overflow-hidden">
                  {pkg.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline mb-6 border-b border-andes-forest/5 dark:border-white/5 pb-6">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-andes-forest dark:text-white">${pkg.price}</span>
                <span className="text-xs text-andes-slate dark:text-gray-400 ml-2 font-medium">/ por persona</span>
              </div>

              {/* Features List */}
              <ul className="space-y-3.5 flex-1 mb-8">
                {pkg.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-start gap-2.5 text-xs sm:text-sm text-andes-slate dark:text-gray-300 font-light">
                    <Check className="w-4 h-4 text-andes-gold shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Action button */}
              <button
                onClick={() => onSelectPackage(pkg.name)}
                className={`w-full py-3.5 text-xs font-semibold rounded-xl tracking-wider uppercase transition-all duration-300 ${
                  pkg.isPopular
                    ? 'bg-andes-gold hover:bg-andes-goldHover text-white shadow-md hover:shadow-lg'
                    : 'bg-andes-forest/5 dark:bg-white/5 text-andes-forest dark:text-white hover:bg-andes-forest dark:hover:bg-andes-gold hover:text-white'
                }`}
              >
                Elegir Plan {pkg.name.split(' ')[1]}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Custom Info Box */}
        <div className="mt-12 bg-white dark:bg-[#262626] rounded-2xl p-6 border border-andes-forest/5 dark:border-white/5 shadow-sm max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-andes-gold/10 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-andes-gold" />
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold text-andes-forest dark:text-white">¿Viajas en grupo o buscas algo a medida?</h4>
            <p className="text-xs text-andes-slate dark:text-gray-400 mt-0.5 leading-relaxed">
              Podemos ajustar cualquiera de las rutas, agregar noches adicionales, coordinar vuelos nacionales desde Caracas u organizar expediciones científicas privadas. Contáctanos directamente.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
