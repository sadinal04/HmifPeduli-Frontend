'use client';

import Link from 'next/link';
import { FaHandHoldingHeart, FaFileAlt, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Informasi Kampanye',
    icon: <FaHandHoldingHeart className="text-4xl text-[#D2691E]" />,
    link: '#informasi-kampanye',
  },
  {
    title: 'Laporan Kampanye',
    icon: <FaFileAlt className="text-4xl text-[#F4C430]" />,
    link: '#laporan-kampanye',
  },
  {
    title: 'Notifikasi Donasi',
    icon: <FaBell className="text-4xl text-[#8B4513]" />,
    link: '/notifikasi',
  },
];

export default function LayananKami() {
  return (
    <section id="layanan" className="bg-[#FFF9E6] py-40 px-6 md:px-20">
      <div className="h-[1px] w-full max-w-7xl mx-auto mb-10 bg-gradient-to-r from-transparent via-[#FEBA17] to-transparent rounded-full"></div>
      <div className="text-center mb-16">
        <span className="text-sm text-white bg-[#FEBA17] px-4 py-1 rounded-full tracking-wide shadow">
          LAYANAN KAMI
        </span>
        <h2 className="text-4xl md:text-4xl font-bold text-[#4E1F00] mt-6">
          Layanan yang Tersedia
        </h2>
      </div>

      <div className="py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-3xl shadow-md p-8 text-center border hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out">
              <div className="flex justify-center items-center mb-6">
                <div className="bg-[#FFF5D1] w-20 h-20 rounded-full flex items-center justify-center shadow-inner">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#4E1F00] mb-6 tracking-wide">
                {service.title}
              </h3>
              <Link href={service.link}>
                <span className="text-[#FEBA17] font-medium flex items-center justify-center gap-2 hover:underline transition">
                  Pergi <span className="text-2xl">→</span>
                </span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
