import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Calendar, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { getDestinations } from '../services/api';

export default function Destinations({ onSelectDestination }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const response = await getDestinations();
        setDestinations(response.data || []);
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los destinos.');
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] }
    }
  };

  if (loading) {
    return (
      <section id="destinos" className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="skeleton w-32 h-4 mx-auto mb-4" />
          <div className="skeleton w-64 h-8 mx-auto mb-4" />
          <div className="skeleton w-96 h-4 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {[1,2,3].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <div className="skeleton h-64 w-full" />
              <div className="p-6 space-y-3">
                <div className="skeleton w-20 h-3" />
                <div className="skeleton w-40 h-6" />
                <div className="skeleton w-full h-12" />
                <div className="skeleton w-full h-10 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="destinos" className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center py-20 text-red-600 dark:text-red-400">{error}</div>
      </section>
    );
  }

  return (
    <section id="destinos" className="py-24 sm:py-28 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-andes-gold/10 text-andes-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4"
        >
          <Compass className="w-3 h-3" />
          Selección Exclusiva
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-andes-forest dark:text-white mt-2"
        >
          Destinos Destacados
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-andes-slate dark:text-gray-400 mt-4 leading-relaxed font-light max-w-xl mx-auto"
        >
          Rutas diseñadas minuciosamente para conectar con la naturaleza virgen y el patrimonio histórico de la cordillera.
        </motion.p>
      </div>

      {/* Grid of Destinations */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
      >
        {destinations.map((dest) => (
          <motion.div
            key={dest.id_destination || dest.id}
            variants={cardVariants}
            whileHover={{ y: -8 }}
            className="flex flex-col bg-white dark:bg-[#1a1f2e] rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-lg border border-andes-forest/5 dark:border-white/5 transition-all duration-500 group"
          >
            <div className="relative h-64 w-full overflow-hidden bg-stone-100">
              {dest.image_url ? (
                <>
                  <img
                    src={dest.image_url}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100 text-andes-slate dark:text-gray-400 text-sm">
                  Sin imagen disponible
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-[#1a1f2e]/90 backdrop-blur-sm text-[10px] font-semibold text-andes-forest dark:text-white shadow-sm">
                  <MapPin className="w-3 h-3 text-andes-gold" />
                  {dest.activo ? 'Disponible' : 'Próximamente'}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7 flex flex-col flex-1">
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-andes-gold font-semibold">Destino</p>
                <h3 className="text-xl font-serif font-semibold text-andes-forest dark:text-white mt-2">
                  {dest.name}
                </h3>
              </div>

              <p className="text-sm text-andes-slate dark:text-gray-400 leading-relaxed font-light flex-1 mb-6 line-clamp-3">
                {dest.description}
              </p>

              <button
                onClick={() => onSelectDestination(dest.name)}
                className="w-full py-3 border border-andes-forest/10 dark:border-white/10 hover:border-andes-gold dark:hover:border-andes-gold text-andes-forest dark:text-white hover:bg-andes-gold hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 group/btn"
              >
                Explorar Destino
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 pt-12 border-t border-andes-forest/5 dark:border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center max-w-4xl mx-auto"
      >
        <div className="flex flex-col items-center group">
          <div className="w-12 h-12 rounded-2xl bg-andes-gold/10 flex items-center justify-center mb-3 group-hover:bg-andes-gold/20 transition-colors duration-300">
            <ShieldCheck className="w-6 h-6 text-andes-gold" />
          </div>
          <h4 className="text-sm font-semibold text-andes-forest dark:text-white">Seguridad Primero</h4>
          <p className="text-xs text-andes-slate dark:text-gray-400 mt-1 leading-relaxed max-w-[200px]">Guías certificados de alta montaña y soporte 24/7.</p>
        </div>
        <div className="flex flex-col items-center group">
          <div className="w-12 h-12 rounded-2xl bg-andes-gold/10 flex items-center justify-center mb-3 group-hover:bg-andes-gold/20 transition-colors duration-300">
            <Compass className="w-6 h-6 text-andes-gold" />
          </div>
          <h4 className="text-sm font-semibold text-andes-forest dark:text-white">Turismo Responsable</h4>
          <p className="text-xs text-andes-slate dark:text-gray-400 mt-1 leading-relaxed max-w-[200px]">Apoyamos a las economías de los pueblos locales.</p>
        </div>
        <div className="flex flex-col items-center group">
          <div className="w-12 h-12 rounded-2xl bg-andes-gold/10 flex items-center justify-center mb-3 group-hover:bg-andes-gold/20 transition-colors duration-300">
            <Calendar className="w-6 h-6 text-andes-gold" />
          </div>
          <h4 className="text-sm font-semibold text-andes-forest dark:text-white">Flexibilidad de Fechas</h4>
          <p className="text-xs text-andes-slate dark:text-gray-400 mt-1 leading-relaxed max-w-[200px]">Cambia tu reserva hasta 7 días antes de la salida.</p>
        </div>
      </motion.div>

    </section>
  );
}
