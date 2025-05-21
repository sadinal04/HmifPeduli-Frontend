'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Kesehatan':
      return '#4CAF50';
    case 'Edukasi':
      return '#2196F3';
    case 'Kemanusiaan':
      return '#FF5722';
    case 'Lainnya':
      return '#9E9E9E';
    default:
      return '#FEBA17';
  }
};

export default function LaporanDonasi() {
  const [search, setSearch] = useState('');
  const [laporan, setLaporan] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const res = await fetch('http://localhost:3000/reports');
        const data = await res.json();

        const completedReports = data.filter((report: any) => report.reportStatus === 'Completed');

        setLaporan(completedReports);
      } catch (error) {
        console.error('Gagal mengambil data laporan:', error);
      }
    };

    fetchLaporan();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const filtered = laporan.filter(item =>
    item.campaignName.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="laporan-kampanye" className="bg-[#FFF9E6] min-h-screen py-20 px-6 md:px-20">
      <div className="h-[1px] w-full max-w-7xl mx-auto mb-10 bg-gradient-to-r from-transparent via-[#FEBA17] to-transparent rounded-full"></div>

      <div className="text-center mb-10">
        <button className="bg-[#FEBA17] text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
          LAPORAN DONASI
        </button>
        <h2 className="text-[#4E1F00] text-4xl font-bold mb-4">Donasi yang Telah Disalurkan</h2>
        <input
          type="text"
          placeholder="Cari berdasarkan judul atau kategori..."
          className="w-full md:w-1/2 p-2 border border-[#FEBA17] rounded-full text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4"
      >
        {filtered.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="min-w-[300px] max-w-[300px] bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
              <img
                src={item.campaignImages?.[0] || '/images/default.jpg'}
                alt={item.campaignName}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block text-white"
                  style={{ backgroundColor: getCategoryColor(item.category) }}
                >
                  {item.category || 'Lainnya'}
                </span>
                <h3 className="text-sm font-semibold text-[#4E1F00] mb-1">{item.campaignName}</h3>
                <p className="text-sm text-gray-600 mb-2">Terkumpul: {formatRupiah(item.totalIncomingDonations)}</p>
                <p className="text-xs text-gray-500 mb-3">
                  Diterbitkan: {new Date(item.reportDate).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                <Link href={`/laporan-donasi/${item._id}`}>
                  <button className="w-full bg-[#4E1F00] hover:bg-[#74512D] text-white font-semibold rounded-full py-2 text-sm">
                    Lihat Laporan 📄
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => scroll('left')}
          className="p-2 rounded-full bg-[#FEBA17] hover:bg-[#e0a800] text-white shadow"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="p-2 rounded-full bg-[#FEBA17] hover:bg-[#e0a800] text-white shadow"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
