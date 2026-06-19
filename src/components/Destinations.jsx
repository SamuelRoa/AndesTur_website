import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
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

  if (loading) {
    return (
      <section id="destinos" className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center py-20 text-andes-forest dark:text-white">Cargando destinos...</div>
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
            key={dest.id_destination || dest.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            whileHover={{ y: -8 }}
            className="flex flex-col bg-white dark:bg-[#262626] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-andes-forest/5 dark:border-white/5 transition-shadow duration-300 group"
          >
            <div className="relative h-64 w-full overflow-hidden bg-stone-100">
              {dest.image_url ? (
                <img
                  src={dest.image_url}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100 text-andes-slate dark:text-gray-400 text-sm">
                  Sin imagen de fondo
                </div>
              )}
            </div>

            <div className="p-6 sm:p-7 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-andes-gold font-semibold">Destino</p>
                  <h3 className="text-xl font-serif font-semibold text-andes-forest dark:text-white mt-2">
                    {dest.name}
                  </h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${dest.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                  {dest.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <p className="text-sm text-andes-slate dark:text-gray-400 leading-relaxed font-light flex-1 mb-6">
                {dest.description}
              </p>

              <button
                onClick={() => onSelectDestination(dest.name)}
                className="w-full py-3 border border-andes-forest/10 dark:border-white/10 hover:border-andes-forest dark:hover:border-andes-gold text-andes-forest dark:text-white hover:bg-andes-forest dark:hover:bg-andes-gold hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300"
              >
                Reservar Ruta
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
