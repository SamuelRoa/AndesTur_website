import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Destinations({ onSelectDestination }) {
  const destinations = [
    {
      id: 1,
      title: "Teleférico Mukumbarí & Páramos",
      slug: "Mérida - Teleférico Mukumbarí",
      description: "Sube al teleférico más alto y largo del mundo y explora lagunas glaciares rodeadas de frailejones centenarios.",
      image: "/teleferico.jpg",
      difficulty: "Los mejores climas",
      altitude: "4,765 m.s.n.m"
    },
    {
      id: 2,
      title: "Paramo la Culata",
      slug: "Mucubají - Excursión Paisajística",
      description: "Un paseo inolvidable por uno de los escenarios naturales más emblemáticos del Parque Nacional Sierra Nevada, rodeado de frailejones y alta montaña.",
      image: "/laguna.jpeg",
      difficulty: "Turismo de Naturaleza",
      altitude: "3,650 m.s.n.m"
    },
    {
      id: 3,
      title: "Pueblos del Sur",
      slug: "Experiencia Cultural de los Pueblos del Sur",
      description: "Viaja en el tiempo visitando pueblos pintorescos de arquitectura colonial, conociendo tradiciones agrícolas y gastronomía andina.",
      image: "/pueblos.jpg",
      difficulty: "Pueblos turisticos recomendados",
      altitude: "2,200 m.s.n.m"
    },
    {
      id: 4,
      title: "Monumento a la Virgen de la Paz",
      slug: "Trujillo - Monumento y Cultura",
      description: "Visita el monumento habitable más alto de América, rodeado de una vista panorámica impresionante y senderos de reflexión espiritual.",
      image: "/virgen.jpeg",
      difficulty: "Turismo Cultural",
      altitude: "1,700 m.s.n.m"
    },
    {
      id: 5,
      title: "Parque Nacional Chorro El Indio",
      slug: "Táchira - Aventura y Naturaleza",
      description: "Conecta con la naturaleza en esta impresionante caída de agua, ideal para caminatas al aire libre y observación de la flora andina.",
      image: "/chorro.jpeg",
      difficulty: "Turismo de Naturaleza",
      altitude: "1,200 m.s.n.m"
    },
    {
      id: 6,
      title: "Minas de Lobatera",
      slug: "Táchira - Historia y Geología",
      description: "Explora la riqueza histórica de este sitio emblemático, descubriendo las antiguas estructuras mineras en un recorrido lleno de tradición.",
      image: "/minas.jpeg",
      difficulty: "Turismo Histórico",
      altitude: "850 m.s.n.m"
    }
  ];

  return (
    <section id="destinos" className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold tracking-widest text-andes-gold uppercase">Selección Exclusiva</span>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-andes-forest dark:text-white mt-2">Destinos Destacados</h2>
        <p className="text-sm sm:text-base text-andes-slate dark:text-gray-400 mt-4 leading-relaxed font-light">
          Rutas diseñadas minuciosamente para conectar con la naturaleza virgen y el patrimonio histórico de la cordillera.
        </p>
      </div>

      {/* Grid of Destinations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {destinations.map((dest, idx) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            whileHover={{ y: -8 }}
            className="flex flex-col bg-white dark:bg-[#262626] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-andes-forest/5 dark:border-white/5 transition-shadow duration-300 group"
          >
            {/* Image Container with Zoom effect */}
            <div className="relative h-64 w-full overflow-hidden bg-stone-100">
              <img
                src={dest.image}
                alt={dest.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Badge for difficulty */}
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-andes-forest/5 dark:border-white/10 shadow-sm text-[10px] font-semibold text-andes-forest dark:text-white uppercase tracking-wider">
                {dest.difficulty}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-7 flex flex-col flex-1">
              <div className="flex items-center justify-between text-xs text-andes-slate dark:text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-andes-gold" /> {dest.duration}
                </span>
                <span className="flex items-center gap-1 font-medium text-andes-forest dark:text-gray-300">
                  <Compass className="w-3.5 h-3.5 text-andes-gold" /> {dest.altitude}
                </span>
              </div>

              <h3 className="text-xl font-serif font-semibold text-andes-forest dark:text-white mb-3 group-hover:text-andes-gold transition-colors duration-300">
                {dest.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-andes-slate dark:text-gray-400 leading-relaxed font-light mb-6 flex-1">
                {dest.description}
              </p>

              {/* Action Button */}
              <button
                onClick={() => onSelectDestination(dest.slug)}
                className="w-full py-3 border border-andes-forest/10 dark:border-white/10 hover:border-andes-forest dark:hover:border-andes-gold text-andes-forest dark:text-white hover:bg-andes-forest dark:hover:bg-andes-gold hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 group/btn"
              >
                Reservar Ruta
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="mt-16 pt-10 border-t border-andes-forest/5 dark:border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-8 h-8 text-andes-gold mb-2" />
          <h4 className="text-sm font-semibold text-andes-forest dark:text-white">Seguridad Primero</h4>
          <p className="text-xs text-andes-slate dark:text-gray-400 mt-1">Guías certificados de alta montaña y soporte 24/7.</p>
        </div>
        <div className="flex flex-col items-center">
          <Compass className="w-8 h-8 text-andes-gold mb-2" />
          <h4 className="text-sm font-semibold text-andes-forest dark:text-white">Turismo Responsable</h4>
          <p className="text-xs text-andes-slate dark:text-gray-400 mt-1">Apoyamos a las economías de los pueblos locales.</p>
        </div>
        <div className="flex flex-col items-center">
          <Calendar className="w-8 h-8 text-andes-gold mb-2" />
          <h4 className="text-sm font-semibold text-andes-forest dark:text-white">Flexibilidad de Fechas</h4>
          <p className="text-xs text-andes-slate dark:text-gray-400 mt-1">Cambia tu reserva hasta 7 días antes de la salida.</p>
        </div>
      </div>

    </section>
  );
}
