import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.25, 1, 0.5, 1] },
  });

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-andes-forest text-white overflow-hidden py-20 px-6 sm:px-8 lg:px-12">
      {/* Background Image with premium overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop"
          alt="Andes Venezolanos"
          className="w-full h-full object-cover object-center"
          style={{ animation: 'heroZoom 25s ease-in-out infinite alternate' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1118]/70 via-[#0a1118]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1118]/20 via-transparent to-[#0a1118]/20" />
      </div>

      {/* Subtle gold accent top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-andes-gold/30 to-transparent" />

      <div className="relative z-10 max-w-5xl w-full mx-auto text-center flex flex-col items-center">
        
        {/* Premium tag */}
        <motion.div {...fadeUp(0)} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/10 text-[11px] font-semibold tracking-[0.25em] text-andes-gold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-andes-gold/80 animate-pulse" />
            Ecoturismo & Aventura Andina
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          {...fadeUp(0.15)}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight leading-[1.05] max-w-5xl"
          style={{ textShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
        >
          Travesías memorables{' '}
          <span className="text-andes-gold">por el corazón</span>{' '}
          de los Andes
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.3)}
          className="mt-8 text-base sm:text-lg md:text-xl text-stone-200/80 font-light max-w-2xl leading-relaxed font-sans"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
        >
          Rutas de montaña exclusivas y el encanto natural de los pueblos de Mérida, Táchira y Trujillo. Una experiencia única e inolvidable.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="scroll-indicator"
        >
          <span className="text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase">Descubre</span>
          <div className="scroll-indicator-dot" />
        </motion.div>
      </div>

      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1.08); }
          to { transform: scale(1.0); }
        }
      `}</style>
    </section>
  );
}
