import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavbarAdmin from "../../components/NavbarAdmin";

interface Allocation {
  purpose: string;
  amount: number;
}

interface Report {
  _id: string;
  campaignId: string;
  campaignName: string;
  totalIncomingDonations: number;
  totalAllocatedFunds: number;
  balance: number;
  allocations: Allocation[];
  reportDate: string;
  campaignImages?: string[];
}

export default function LaporanListPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("https://hmif-peduli-backend.vercel.app/reports")
      .then((res) => res.json())
      .then((data) => setReports(data));
  }, []);

  const goToEdit = (reportId: string) => {
    router.push(`/admin/laporan/edit-laporan?id=${reportId}`);
  };

  const goToAdd = () => {
    router.push(`/admin/laporan/tambah-laporan`);
  };

  // Filter berdasarkan judul dan status
  const filteredReports = reports.filter((report) => {
    const matchesTitle = report.campaignName
      .toLowerCase()
      .includes(searchTitle.toLowerCase());
    const status =
      report.balance === 0 ? "Completed" : "On Progress";
    const matchesStatus = searchStatus ? status === searchStatus : true;
    return matchesTitle && matchesStatus;
  });

  return (
    <>
      <NavbarAdmin />
      <div className="flex-1 bg-[#F8F4E1] min-h-screen py-20 px-6 md:px-16 lg:px-24 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#4E1F00]">
            Daftar Laporan Donasi
          </h1>
          <button
            onClick={goToAdd}
            className="bg-[#FEBA17] hover:bg-yellow-500 text-white px-4 py-2 rounded-md transition font-semibold"
          >
            + Tambah Laporan
          </button>
        </div>

        {/* Form Pencarian */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-[#4E1F00] mb-1">
              Cari berdasarkan judul kampanye
            </label>
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-md border text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Masukkan nama kampanye"
            />
          </div>
          <div className="w-full md:w-64">
            <label className="block text-sm font-semibold text-[#4E1F00] mb-1">
              Filter status laporan
            </label>
            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-md border text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Semua Status</option>
              <option value="Completed">Completed</option>
              <option value="On Progress">On Progress</option>
            </select>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <p className="text-[#74512D]">Tidak ditemukan laporan yang sesuai.</p>
        ) : (
          <div className="space-y-6">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="border border-gray-200 rounded-lg shadow-sm p-5 bg-white"
              >
                {/* Gambar Kampanye */}
                {Array.isArray(report.campaignImages) &&
                  report.campaignImages.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto mb-4">
                      {report.campaignImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="gambar kampanye"
                          className="h-32 w-48 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}

                {/* Info Laporan */}
                <p className="text-xl font-bold text-[#4E1F00] mb-1">
                  {report.campaignName}
                </p>
                <p className="text-sm text-[#74512D] mb-3">
                  Tanggal laporan:{" "}
                  {new Date(report.reportDate).toLocaleDateString()}
                </p>

                {/* Baris Info Finansial */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm text-[#4E1F00]">
                  <div>
                    <span className="font-semibold">Total Donasi Masuk:</span><br />
                    Rp{report.totalIncomingDonations.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Total Alokasi:</span><br />
                    Rp{report.totalAllocatedFunds.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Sisa Saldo:</span><br />
                    Rp{report.balance.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span><br />
                    <span
                      className={`font-semibold ${
                        report.balance === 0
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {report.balance === 0 ? "Completed" : "On Progress"}
                    </span>
                  </div>
                </div>

                {/* Alokasi Dana */}
                <div className="mt-2">
                  <p className="font-semibold text-[#4E1F00] mb-1">
                    Detail Alokasi:
                  </p>
                  <ul className="list-disc ml-5 text-sm text-[#74512D] space-y-1">
                    {report.allocations.map((alloc, i) => (
                      <li key={i}>
                        {alloc.purpose}: Rp{alloc.amount.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tombol Edit */}
                <div className="mt-4">
                  <button
                    onClick={() => goToEdit(report._id)}
                    className="bg-[#FEBA17] hover:bg-yellow-500 text-white px-4 py-2 rounded-md transition font-semibold"
                  >
                    Edit Laporan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
