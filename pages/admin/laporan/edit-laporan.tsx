import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import NavbarAdmin from "../../../components/NavbarAdmin"; // pastikan path-nya benar

interface Allocation {
  purpose: string;
  amount: number;
}

interface Report {
  _id: string;
  campaignName: string;
  totalIncomingDonations: number;
  totalAllocatedFunds: number;
  balance: number;
  allocations: Allocation[];
  campaignImages?: string[];
}

export default function EditLaporanPage() {
  const router = useRouter();
  const { id } = router.query;

  const [report, setReport] = useState<Report | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [maxSaldo, setMaxSaldo] = useState<number>(0);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/reports/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setAllocations(data.allocations);
        setMaxSaldo(
          data.totalIncomingDonations -
            (data.totalAllocatedFunds -
              data.allocations.reduce((s: number, a: Allocation) => s + a.amount, 0))
        );
      });
  }, [id]);

  const handleChange = (index: number, field: keyof Allocation, value: string) => {
    const newAlloc = [...allocations];
    if (field === "amount") {
      newAlloc[index].amount = Number(value);
    } else if (field === "purpose") {
      newAlloc[index].purpose = value;
    }
    setAllocations(newAlloc);
  };

  const handleAddAllocation = () => {
    setAllocations([...allocations, { purpose: "", amount: 0 }]);
  };

  const handleSubmit = async () => {
    if (!report) return;

    const totalNew = allocations.reduce((sum, a) => sum + a.amount, 0);
    if (totalNew > maxSaldo) {
      alert(`Total alokasi melebihi saldo: Maksimum Rp${maxSaldo.toLocaleString()}`);
      return;
    }

    const res = await fetch(`http://localhost:3000/reports/${report._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allocations }),
    });

    if (res.ok) {
      alert("Laporan berhasil diperbarui.");
      router.push("/admin/laporan");
    } else {
      const data = await res.json();
      alert(data.message || "Gagal memperbarui laporan.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4E1] flex">
      <NavbarAdmin />
      <div className="flex-1 bg-[#FFF9E6] py-20 px-6 md:px-16 lg:px-24 ml-64 text-[#4E1F00]">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-[#74512D] mb-4 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali
        </button>

        <h1 className="text-2xl font-bold mb-4">Edit Laporan Donasi</h1>

        {report && (
          <>
            <h2 className="text-xl font-semibold mb-2">{report.campaignName}</h2>

            {Array.isArray(report.campaignImages) && report.campaignImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto mb-3">
                {report.campaignImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="gambar kampanye"
                    className="h-32 object-cover rounded"
                  />
                ))}
              </div>
            )}

            <p>Total Donasi Masuk: Rp{report.totalIncomingDonations.toLocaleString()}</p>
            <p>Total Alokasi Saat Ini: Rp{report.totalAllocatedFunds.toLocaleString()}</p>
            <p>Sisa Maksimum yang bisa dialokasikan kembali: Rp{maxSaldo.toLocaleString()}</p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Ubah Alokasi</h3>
              {allocations.map((a, idx) => (
                <div key={idx} className="flex gap-4 mb-2">
                  <input
                    type="text"
                    value={a.purpose}
                    onChange={(e) => handleChange(idx, "purpose", e.target.value)}
                    placeholder="Keperluan"
                    className="flex-1 px-3 py-2 rounded border border-[#74512D]"
                  />
                  <input
                    type="number"
                    value={a.amount}
                    onChange={(e) => handleChange(idx, "amount", e.target.value)}
                    placeholder="Jumlah"
                    className="w-40 px-3 py-2 rounded border border-[#74512D]"
                  />
                </div>
              ))}

              <button
                onClick={handleAddAllocation}
                className="mt-2 px-4 py-2 bg-[#FEBA17] text-white rounded-full font-semibold text-sm"
              >
                Tambah Alokasi
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 px-6 py-3 bg-[#4E1F00] hover:bg-[#3b1800] text-[#F8F4E1] px-8 py-3 rounded font-semibold transition"
            >
              Simpan Perubahan
            </button>
          </>
        )}
      </div>
    </div>
  );
}
