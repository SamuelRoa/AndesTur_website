import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "María Gómez",
    location: "Buenos Aires",
    rating: 5,
    text: "Nuestra experiencia en Mendoza fue increíble. La organización de los tours a las bodegas fue impecable. Totalmente recomendado.",
    image: "https://i.pravatar.cc/150?img=47"
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    location: "Córdoba",
    rating: 5,
    text: "El viaje a la Patagonia superó nuestras expectativas. AndesTur cuidó cada detalle, desde el hotel hasta las excursiones en el glaciar.",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    name: "Ana Martínez",
    location: "Santiago",
    rating: 4,
    text: "Muy buen servicio al cliente. Hubo un pequeño retraso en un traslado, pero lo solucionaron rápidamente. Los paisajes de Salta son mágicos.",
    image: "https://i.pravatar.cc/150?img=32"
  }
];

export default function Reviews() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="opiniones" className="py-24 bg-white/50 dark:bg-transparent relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-andes-gold/10 text-andes-gold text-xs font-bold tracking-widest uppercase mb-4"
          >
            <Star className="w-3.5 h-3.5 fill-andes-gold" />
            Testimonios
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-andes-forest dark:text-andes-bone mb-6"
          >
            Lo que dicen nuestros <span className="text-andes-gold italic">viajeros</span>
          </motion.h2>
        </div>

        {/* Reviews Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reviews.map((review) => (
            <motion.div 
              key={review.id}
              variants={itemVariants}
              className="bg-andes-bone dark:bg-[#262626] p-8 rounded-2xl border border-andes-forest/5 dark:border-white/5 shadow-sm relative group hover:-translate-y-2 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-andes-gold/20 rotate-180" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-andes-gold text-andes-gold" />
                ))}
              </div>

              <p className="text-andes-slate dark:text-white/80 mb-8 italic text-sm leading-relaxed">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={review.image} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-andes-gold/20"
                />
                <div>
                  <h4 className="font-semibold text-andes-forest dark:text-andes-bone text-sm">{review.name}</h4>
                  <p className="text-xs text-andes-slate/70 dark:text-white/50">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
