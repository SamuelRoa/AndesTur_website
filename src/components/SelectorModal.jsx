import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Map, MapPin } from 'lucide-react';

export default function SelectorModal({ isOpen, onClose, onSelectRoute, onSelectDestination }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-andes-forest/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-andes-forest/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col"
          >
            <div className="p-6 border-b border-andes-forest/5 dark:border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-serif text-andes-forest dark:text-andes-bone tracking-wide">¿Qué deseas reservar?</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-andes-forest/5 dark:hover:bg-white/10 text-andes-forest/60 dark:text-white/60 hover:text-andes-forest dark:hover:text-white transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <button
                onClick={() => {
                  onClose();
                  onSelectRoute();
                }}
                className="flex items-center gap-4 p-5 rounded-xl border border-andes-forest/10 dark:border-white/10 hover:border-andes-gold dark:hover:border-andes-gold hover:shadow-md transition-all text-left group bg-stone-50 dark:bg-white/5"
              >
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0 border border-andes-forest/5 dark:border-white/10 shadow-sm group-hover:bg-andes-gold/10 dark:group-hover:bg-andes-gold/20 group-hover:border-andes-gold/20 transition-all">
                  <Map className="w-6 h-6 text-andes-forest dark:text-andes-bone group-hover:text-andes-gold transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold text-andes-forest dark:text-andes-bone mb-1 text-sm">Paquete Turístico / Ruta</h4>
                  <p className="text-xs text-andes-slate dark:text-andes-bone/70 leading-relaxed">Selecciona uno de nuestros paquetes completos prearmados con alojamiento, guías y traslados.</p>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSelectDestination();
                }}
                className="flex items-center gap-4 p-5 rounded-xl border border-andes-forest/10 dark:border-white/10 hover:border-andes-gold dark:hover:border-andes-gold hover:shadow-md transition-all text-left group bg-stone-50 dark:bg-white/5"
              >
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0 border border-andes-forest/5 dark:border-white/10 shadow-sm group-hover:bg-andes-gold/10 dark:group-hover:bg-andes-gold/20 group-hover:border-andes-gold/20 transition-all">
                  <MapPin className="w-6 h-6 text-andes-forest dark:text-andes-bone group-hover:text-andes-gold transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold text-andes-forest dark:text-andes-bone mb-1 text-sm">Destino Específico</h4>
                  <p className="text-xs text-andes-slate dark:text-andes-bone/70 leading-relaxed">Elige un lugar particular para tu reserva y planifica un viaje a la medida a ese destino.</p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
