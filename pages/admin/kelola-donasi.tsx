'use client';

import NavbarAdmin from '../../components/NavbarAdmin';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEdit } from 'react-icons/fa';

// Format warna berdasarkan kategori
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

interface Campaign {
  campaignId: string;
  campaign: {
    name: string;
    image: string;
    category: string;
    status: string;
    target?: number;
    collected?: number;
  };
}

export default function KelolaDonasiPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch('http://localhost:3000/campaigns');
        const data = await res.json();
        setCampaigns(data);
      } catch (err) {
        console.error('Gagal memuat data kampanye:', err);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((item) => {
    const nameMatch = item.campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory === '' || item.campaign.category === selectedCategory;
    return nameMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-[#F8F4E1] flex">
      <NavbarAdmin />
      <section className="flex-1 bg-[#FFF9E6] min-h-screen py-20 px-6 md:px-16 lg:px-24 ml-64">
        <div className="text-center mb-10">
          <button className="bg-[#FEBA17] text-white px-4 py-1 rounded-full text-sm font-semibold mb-3">
            KAMPANYE TERDAFTAR
          </button>
          <h1 className="text-4xl font-bold text-[#4E1F00] flex items-center justify-center gap-2">
            <FaEdit /> Kelola Donasi
          </h1>
        </div>

        {/* Filter dan Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Cari berdasarkan nama kampanye..."
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Edukasi">Edukasi</option>
            <option value="Kemanusiaan">Kemanusiaan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* Daftar Kampanye */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCampaigns.map((item, index) => {
            const categoryColor = getCategoryColor(item.campaign.category);
            const collected = item.campaign.collected ?? 0;
            const target = item.campaign.target ?? 1;
            const rawProgress = (collected / target) * 100;
            const progress = Math.min(rawProgress, 100);

            return (
              <motion.div
                key={item.campaignId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition duration-300 max-w-sm mx-auto">
                  <img
                    src={item.campaign.image || '/default-image.jpg'}
                    alt={item.campaign.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full text-white inline-block mb-2"
                      style={{ backgroundColor: categoryColor }}
                    >
                      {item.campaign.category}
                    </span>
                    <h2 className="text-sm font-bold text-[#4E1F00] mb-2">
                      {item.campaign.name}
                    </h2>

                    <div className="w-full h-1 bg-gray-200 rounded-full mb-2">
                      <div
                        className="h-1 rounded-full bg-[#FEBA17]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>


                    <p className="text-xs text-gray-600 mb-1">
                    Status:{' '}
                    <span className="font-semibold">
                        {{
                        Active: 'Aktif',
                        Completed: 'Selesai',
                        Abort: 'Ditutup'
                        }[item.campaign.status] || item.campaign.status}
                    </span>
                    </p>

                    <Link href={`/admin/kelola-donasi/${item.campaignId}`}>
                      <button className="w-full bg-[#FEBA17] hover:bg-yellow-500 text-white py-2 rounded-full font-semibold text-sm mt-2">
                        Edit / Hapus
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
