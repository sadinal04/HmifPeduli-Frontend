'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import NavbarAdmin from "../../components/NavbarAdmin";

// Format warna berdasarkan kategori (sesuaikan dengan status kampanye)
const getCategoryColor = (status: string) => {
  switch (status) {
    case "Active":
      return "#4CAF50";
    case "Completed":
      return "#2196F3";
    case "Abort":
      return "#FF5722";
    default:
      return "#FEBA17";
  }
};

interface Donation {
  _id: string;
  donaturName: string;
  amount: number;
  donationStatus: string;
  campaignId: {
    _id: string;
    campaignName: string;
    status: string;
  };
}

export default function VerifikasiPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState("all");

  // Ambil data donasi saat halaman dimuat
  useEffect(() => {
    const fetchDonations = async () => {
      const res = await fetch("http://localhost:3000/donations");
      const data = await res.json();
      const pending = data.filter((donation: Donation) => donation.donationStatus === "Pending");
      setDonations(pending);
      setFilteredDonations(pending);
    };
    fetchDonations();
  }, []);

  // Ambil daftar nama kampanye unik
  const uniqueCampaigns = Array.from(
    new Set(donations.map((d) => d.campaignId?.campaignName))
  );

  // Filter data saat pilihan kampanye berubah
  useEffect(() => {
    if (selectedCampaign === "all") {
      setFilteredDonations(donations);
    } else {
      setFilteredDonations(
        donations.filter((d) => d.campaignId?.campaignName === selectedCampaign)
      );
    }
  }, [selectedCampaign, donations]);

  return (
    <div className="min-h-screen bg-[#F8F4E1] flex">
      <NavbarAdmin />
      <section className="flex-1 bg-[#FFF9E6] min-h-screen py-20 px-6 md:px-16 lg:px-24 ml-64">
        <div className="text-center mb-10">
          <button className="bg-[#FEBA17] text-white px-4 py-1 rounded-full text-sm font-semibold mb-3">
            DONASI MENUNGGU VERIFIKASI
          </button>
          <h1 className="text-4xl font-bold text-[#4E1F00] flex items-center justify-center gap-2">
            <FaEdit /> Verifikasi Donasi
          </h1>
        </div>

        {/* Filter Kampanye */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <label htmlFor="filter" className="text-sm text-[#4E1F00] mr-2">Filter Kampanye:</label>
          <select
            id="filter"
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="px-4 py-2 rounded-md border border-[#74512D] bg-white text-[#4E1F00]"
          >
            <option value="all">Semua Kampanye</option>
            {uniqueCampaigns.map((campaign) => (
              <option key={campaign} value={campaign}>
                {campaign}
              </option>
            ))}
          </select>
        </div>

        {/* Daftar Donasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDonations.map((donation, index) => {
            const categoryColor = getCategoryColor(donation.campaignId.status);

            return (
              <motion.div
                key={donation._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition duration-300 max-w-sm mx-auto p-4 border border-[#FEBA17]">
                  <div>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full text-white inline-block mb-2"
                      style={{ backgroundColor: categoryColor }}
                    >
                      {donation.campaignId.status}
                    </span>
                    <h2 className="text-sm font-bold text-[#4E1F00] mb-2">
                      {donation.campaignId?.campaignName || "-"}
                    </h2>

                    {/* Donatur dan Jumlah sebaris */}
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-[#74512D]">Donatur:</p>
                      <p className="text-base font-medium text-[#4E1F00]">
                        {donation.donaturName}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-sm text-[#74512D]">Jumlah:</p>
                      <p className="text-base font-medium text-[#4E1F00]">
                        Rp{donation.amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <Link href={`/admin/verifikasi/${donation._id}`} passHref>
                    <button className="w-full bg-[#FEBA17] hover:bg-yellow-500 text-white py-2 rounded-full font-semibold text-sm mt-4">
                      Verifikasi
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
