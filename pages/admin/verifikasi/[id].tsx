'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import NavbarAdmin from "../../../components/NavbarAdmin";

interface Donation {
  _id: string;
  donaturName: string;
  amount: number;
  donationStatus: string;
  paymentMethod: string;
  proof: string;
}

export default function VerifikasiDetailPage() {
  const [donation, setDonation] = useState<Donation | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    const fetchDonation = async () => {
      const res = await fetch(`https://hmif-peduli-backend.vercel.app/donations`);
      const data = await res.json();
      const found = data.find((d: Donation) => d._id === id);
      setDonation(found);
    };
    fetchDonation();
  }, [id]);

  const handleVerify = async (status: "Successful" | "Abort") => {
    const res = await fetch(`https://hmif-peduli-backend.vercel.app/donations/verify/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      alert(`Donasi diverifikasi sebagai ${status}`);
      router.push("/admin/verifikasi");
    } else {
      const err = await res.json();
      alert(`Gagal: ${err.message}`);
    }
  };

  if (!donation) return <p className="p-4">Memuat data...</p>;

  return (
    <div className="min-h-screen bg-[#F8F4E1] flex">
      <NavbarAdmin />
      <section className="flex-1 bg-[#FFF9E6] py-16 px-6 md:px-16 lg:px-24 ml-64">
        {/* Tombol kembali gaya teks dengan ikon */}
        <div
          onClick={() => router.push("/admin/verifikasi")}
          className="flex items-center text-[#74512D] font-semibold text-sm cursor-pointer mb-6 hover:underline w-fit"
        >
          <ArrowLeft size={16} className="mr-1" />
          Kembali
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#4E1F00]">Detail Donasi</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 max-w-xl mx-auto">
          <div className="space-y-4 text-base text-[#4E1F00]">
            <div className="flex">
              <span className="w-50 font-semibold">Donatur</span>
              <span>: {donation.donaturName}</span>
            </div>
            <div className="flex">
              <span className="w-50 font-semibold">Jumlah</span>
              <span>: Rp{donation.amount.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex">
              <span className="w-50 font-semibold">Metode Pembayaran</span>
              <span>: {donation.paymentMethod}</span>
            </div>
            <div className="flex">
              <span className="w-50 font-semibold">Status</span>
              <span>: {donation.donationStatus}</span>
            </div>
          </div>

          <div className="mt-6">
            <p className="font-semibold text-[#4E1F00] mb-2">Bukti Pembayaran</p>
            <img
              src={donation.proof}
              alt="Bukti pembayaran"
              className="w-full h-auto max-w-sm rounded-lg shadow border border-[#74512D]"
            />
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => handleVerify("Successful")}
              className="bg-[#4CAF50] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#45a049]"
            >
              Verifikasi Berhasil
            </button>
            <button
              onClick={() => handleVerify("Abort")}
              className="bg-[#FF5722] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#f44336]"
            >
              Tolak Donasi
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
