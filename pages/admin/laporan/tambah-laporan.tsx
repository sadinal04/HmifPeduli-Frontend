// pages/admin/laporan/tambah-laporan.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavbarAdmin from "../../../components/NavbarAdmin"; // pastikan path benar
import { ArrowLeft } from "lucide-react";

interface Campaign {
  _id: string;
  campaignName: string;
  description: string;
  category: string;
  fundCollected: number;
  fundTarget: number;
  startDate: string;
  endDate: string;
  pictures: string[];
  campaignStatus: string;
}

interface Allocation {
  purpose: string;
  amount: number;
}

export default function TambahLaporanPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState<string>("");
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [saldo, setSaldo] = useState<number>(0);

  useEffect(() => {
    fetch("https://hmif-peduli-backend.vercel.app/campaigns")
      .then((res) => res.json())
      .then((data) => {
        const active = data
          .filter((item: any) => item.campaign.status === "Active")
          .map((item: any) => ({
            _id: item.campaignId,
            campaignName: item.campaign.name,
            description: "", // opsional, atau bisa fetch detail jika perlu
            category: item.campaign.category,
            fundCollected: item.campaign.collected,
            fundTarget: item.campaign.target,
            startDate: item.campaign.startDate,
            endDate: item.campaign.endDate,
            pictures: [item.campaign.image], // hanya 1 gambar
            campaignStatus: item.campaign.status,
          }));

        setCampaigns(active);
      });
  }, []);

  useEffect(() => {
    if (!campaignId) {
      setCampaign(null);
      setSaldo(0);
      setAllocations([]);
      return;
    }

    const fetchDetail = async () => {
      const res = await fetch(`https://hmif-peduli-backend.vercel.app/campaigns/${campaignId}`);
      const data = await res.json();
      setCampaign(data);

      const reportRes = await fetch(`https://hmif-peduli-backend.vercel.app/reports/campaign/${campaignId}`);
      const reports = await reportRes.json();
      const totalUsed = reports.reduce((sum: number, r: any) => sum + r.totalAllocatedFunds, 0);
      setSaldo(data.fundCollected - totalUsed);
      setAllocations([]); // reset alokasi saat ganti campaign
    };

    fetchDetail();
  }, [campaignId]);

  const handleAddAllocation = () => {
    setAllocations([...allocations, { purpose: "", amount: 0 }]);
  };

  const handleChangeAllocation = (index: number, field: keyof Allocation, value: string) => {
    const newAlloc = [...allocations];
    if (field === "amount") {
      newAlloc[index].amount = Number(value);
    } else {
      newAlloc[index].purpose = value;
    }
    setAllocations(newAlloc);
  };

  const handleSubmit = async () => {
    if (!campaignId || allocations.length === 0) {
      alert("Pilih kampanye dan isi alokasi terlebih dahulu.");
      return;
    }

    const totalNew = allocations.reduce((sum, a) => sum + a.amount, 0);
    if (totalNew > saldo) {
      alert(`Total alokasi melebihi saldo yang tersedia: Rp${saldo.toLocaleString()}`);
      return;
    }

    const response = await fetch("https://hmif-peduli-backend.vercel.app/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, allocations }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Laporan berhasil dirilis!");
      router.push("/admin/laporan");
    } else {
      alert(data.message || "Gagal membuat laporan.");
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="flex-1 bg-[#F8F4E1] min-h-screen py-20 px-6 md:px-16 lg:px-24 ml-64">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-[#74512D] mb-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </button>
          <h1 className="text-3xl font-bold mb-6 text-[#4E1F00]">Tambah Laporan</h1>

          {/* Pilih Kampanye */}
          <label className="block mb-2 font-semibold text-[#74512D]">Pilih Kampanye:</label>
          <select
            className="border border-[#74512D] p-3 w-full mb-6 rounded focus:outline-none focus:ring-2 focus:ring-[#FEBA17]"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
          >
            <option value="">-- Pilih Kampanye --</option>
            {campaigns.map((c) => (
              <option key={c._id} value={c._id}>
                {c.campaignName}
              </option>
            ))}
          </select>

          {/* Detail Kampanye */}
          {campaign && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-[#4E1F00]">{campaign.campaignName}</h2>
                {campaign.pictures?.length > 0 && (
                  <img
                    src={campaign.pictures[0]}
                    alt="Gambar Kampanye"
                    className="w-full max-h-64 object-cover mb-4 rounded border border-[#74512D]"
                  />
                )}
                <p className="mb-1 text-[#74512D]">{campaign.description || "-"}</p>
                <p className="mb-1 text-[#74512D]">
                  <span className="font-semibold">Kategori:</span> {campaign.category}
                </p>
                <p className="mb-1 text-[#74512D]">
                  <span className="font-semibold">Donasi Masuk:</span> Rp{campaign.fundCollected.toLocaleString()} / Rp
                  {campaign.fundTarget.toLocaleString()}
                </p>
                <p className="mb-1 text-[#74512D]">
                  <span className="font-semibold">Durasi:</span>{" "}
                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </p>
                <p className="font-semibold mt-3 text-[#4E1F00]">
                  Saldo Tersisa: Rp{saldo.toLocaleString()}
                </p>
              </div>

              {/* Alokasi Dana */}
              <h2 className="text-xl font-semibold mb-4 text-[#4E1F00]">Rincian Alokasi Dana</h2>
              {allocations.map((alloc, index) => (
                <div key={index} className="flex gap-4 mb-3">
                  <input
                    type="text"
                    placeholder="Tujuan"
                    className="border border-[#74512D] p-3 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-[#FEBA17]"
                    value={alloc.purpose}
                    onChange={(e) => handleChangeAllocation(index, "purpose", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Jumlah"
                    className="border border-[#74512D] p-3 w-44 rounded focus:outline-none focus:ring-2 focus:ring-[#FEBA17]"
                    value={alloc.amount}
                    onChange={(e) => handleChangeAllocation(index, "amount", e.target.value)}
                    min={0}
                  />
                </div>
              ))}

              <button
                onClick={handleAddAllocation}
                className="bg-[#FEBA17] hover:bg-yellow-400 text-[#4E1F00] px-5 py-2 rounded font-semibold transition"
              >
                + Tambah Alokasi
              </button>

              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  className="bg-[#4E1F00] hover:bg-[#3b1800] text-[#F8F4E1] px-8 py-3 rounded font-semibold transition"
                >
                  Rilis Laporan
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
