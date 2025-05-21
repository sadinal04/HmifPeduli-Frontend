import { useRouter } from 'next/router';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useEffect, useState } from 'react';

export default function LaporanDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch('http://localhost:3000/reports')
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch reports:', err);
        setLoading(false);
      });
  }, [id]);

  if (!id || loading) return <p className="text-center mt-10">Memuat laporan...</p>;

  const data = reports.find((item) => item._id === id);

  if (!data) return <p className="text-center mt-10 text-red-500">Laporan tidak ditemukan.</p>;

  const progress = (data.totalAllocatedFunds / data.totalIncomingDonations) * 100;

  return (
    <>
      <Navbar />
      <div className="bg-[#F8F4E1] min-h-screen text-[#4E1F00] py-30 px-4 md:px-20">
        <button onClick={() => router.back()} className="mb-6 text-sm font-semibold hover:underline">
          &larr; Kembali
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">{data.campaignName}</h2>
              <p className="text-sm text-gray-600">{data.description}</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 border-b border-[#FEBA17] w-fit">Dokumentasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.campaignImages?.map((src: string, idx: number) => (
                  <Image
                    key={idx}
                    src={src}
                    alt={`Foto dokumentasi ${idx + 1}`}
                    width={350}
                    height={250}
                    className="rounded-xl object-cover w-full h-48"
                  />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 border-b border-[#FEBA17] w-fit">Penggunaan Dana</h3>
              <div className="space-y-2 text-sm">
                {data.allocations.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.purpose}</span>
                    <span>Rp{item.amount.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#FFF3CD] p-6 rounded-xl shadow-md space-y-4">
              <h3 className="text-xl font-semibold mb-4 border-b border-[#FEBA17] w-fit">Metode Donasi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="w-40 font-medium">Transfer Bank</span>
                  <span>: <strong>{data.bankInfo?.bankName}</strong></span>
                </div>
                <div className="flex">
                  <span className="w-40 font-medium">Nomor Rekening</span>
                  <span>: <strong>{data.bankInfo?.accountNumber}</strong></span>
                </div>
                <div className="flex">
                  <span className="w-40 font-medium">Atas Nama</span>
                  <span>: <strong>{data.bankInfo?.accountName}</strong></span>
                </div>
                <div className="flex">
                  <span className="w-40 font-medium">Kode Bank</span>
                  <span>: {data.bankInfo?.bankCode}</span>
                </div>
              </div>
            </section>

            <section className="bg-[#FFF3CD] p-6 rounded-xl shadow-md space-y-4">
              <h3 className="text-xl font-semibold mb-4 border-b border-[#FEBA17] w-fit">Kontak Admin</h3>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="w-40 font-medium">Nama</span>
                  <span>: {data.contactPerson?.name}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-medium">No. Handphone</span>
                  <span>: {data.contactPerson?.phone}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-medium">Email</span>
                  <span>: {data.contactPerson?.email}</span>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
              <div className="text-xl font-semibold">Total Donasi Masuk</div>
              <h2 className="text-3xl font-bold text-[#4E1F00] mb-2">Rp{data.totalIncomingDonations.toLocaleString('id-ID')}</h2>
              <div className="text-sm text-gray-600">Alokasi Dana: Rp{data.totalAllocatedFunds.toLocaleString('id-ID')}</div>
              <div className="text-sm text-gray-600">Saldo: Rp{data.balance.toLocaleString('id-ID')}</div>
              <div className="text-sm text-gray-600">📅 Tanggal Laporan: {new Date(data.reportDate).toLocaleDateString()}</div>
              <div className="text-sm text-gray-600">📊 Persentase Dialokasikan: {progress.toFixed(2)}%</div>

              <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                <div
                  className="h-2 bg-[#FEBA17] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="font-semibold text-lg mb-4">Donatur Terbaru</h4>
              <p className="text-sm text-gray-500">Belum tersedia dari backend</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
