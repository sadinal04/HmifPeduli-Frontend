'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Fungsi untuk format Rupiah
const formatRupiah = (num: number) => {
  if (num == null) return 'Rp 0'; // Default if num is undefined or null
  return `Rp ${num.toLocaleString('id-ID')}`;
};

// Fungsi untuk menentukan warna berdasarkan kategori
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Kesehatan':
      return '#4CAF50'; // Hijau untuk Kesehatan
    case 'Edukasi':
      return '#2196F3'; // Biru untuk Edukasi
    case 'Kemanusiaan':
      return '#FF5722'; // Merah untuk Kemanusiaan
    case 'Lainnya':
      return '#9E9E9E'; // Abu-abu untuk Lainnya
    default:
      return '#FEBA17'; // Warna default jika kategori tidak dikenal
  }
};

export default function InformasiDonasi() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ambil data kampanye dari API
  useEffect(() => {
    // Mengambil data setiap 5 detik
    const intervalId = setInterval(() => {
      const fetchCampaigns = async () => {
        try {
          const response = await fetch('https://hmif-peduli-backend.vercel.app/campaigns/');
          const data = await response.json();
          setCampaigns(data); // Update state campaigns dengan data terbaru
        } catch (error) {
          console.error('Error fetching campaigns:', error);
        }
      };
      fetchCampaigns();
    }, 5000);

    // Membersihkan interval saat komponen dibersihkan
    return () => clearInterval(intervalId);
  }, []); // Hanya dijalankan sekali saat komponen pertama kali dirender


  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="informasi-kampanye" className="bg-[#FFF9E6] min-h-screen py-20 px-6 md:px-20 relative">
      {/* Garis */}
      <div className="h-[1px] w-full max-w-7xl mx-auto mb-10 bg-gradient-to-r from-transparent via-[#FEBA17] to-transparent rounded-full"></div>

      {/* Heading */}
      <div className="text-center mb-8">
        <button className="bg-[#FEBA17] text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
          INFORMASI KAMPANYE
        </button>
        <h2 className="text-[#4E1F00] text-4xl font-bold">Bantuanmu Dibutuhkan</h2>
      </div>

      {/* Cards */}
      <div ref={scrollRef} className="flex overflow-x-auto space-x-6 px-2 hide-scrollbar scroll-smooth">
        {campaigns.map((item, index) => {
          const sisa = item.campaign.target - item.campaign.collected;
          const rawProgress = (item.campaign.collected / item.campaign.target) * 100;
          const progress = Math.min(rawProgress, 100);

          const categoryColor = getCategoryColor(item.campaign.category); // Dapatkan warna berdasarkan kategori

          return (
            <motion.div
              key={item.campaignId}
              initial={{ opacity: 0, x: -40 }} // Mulai dari opacity 0 dan bergerak dari kiri
              whileInView={{ opacity: 1, x: 0 }} // Masuk ke opacity 1 dan posisi semula
              transition={{ duration: 0.6, delay: index * 0.2 }} // Durasi animasi dan delay per elemen
              viewport={{ once: true }} // Animasi hanya terjadi sekali
            >
              <div className="min-w-[300px] max-w-[300px] bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
                <img
                  src={item.campaign.image || "default-image.jpg"} // Ganti dengan gambar kampanye yang sesuai jika ada
                  alt={item.campaign.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block text-white"
                    style={{ backgroundColor: categoryColor }} // Gunakan warna kategori
                  >
                    {item.campaign.category}
                  </span>
                  <h3 className="text-sm font-semibold text-[#4E1F00] mb-2">{item.campaign.name}</h3>
                  <div className="w-full h-1 bg-gray-200 rounded-full mb-2">
                    <div
                      className="h-1 rounded-full bg-[#FEBA17]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="text-sm text-[#4E1F00] font-medium mb-2">
                    <p>Target: {formatRupiah(item.campaign.target)}</p>
                    <p>Terkumpul: {formatRupiah(item.campaign.collected)}</p>
                    <p>Sisa: {formatRupiah(sisa)}</p>
                  </div>
                  <Link href={`/informasi-donasi/${item.campaignId}`}>
                    <button className="w-full bg-[#4E1F00] hover:bg-[#74512D] text-white font-semibold rounded-full mt-2 py-2 text-sm">
                      MULAI DONASI 💚
                    </button>
                  </Link>

                  <Link href={`/informasi-donasi/${item.campaignId}`}>
                    <button className="w-full mt-2 text-[#FEBA17] font-semibold hover:underline text-sm">
                      Lihat Selengkapnya →
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tombol panah bawah */}
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
