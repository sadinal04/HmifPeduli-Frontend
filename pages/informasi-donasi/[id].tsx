import { useRouter } from 'next/router';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PopupDonasi from '../../components/PopupDonasi';
import PopupSelesai from '../../components/PopupSelesai';
import { useState, useEffect } from 'react';

export default function DonasiDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`https://hmif-peduli-backend.vercel.app/campaigns/${id}`);
        if (!res.ok) throw new Error('Campaign not found');
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitDonasi = async (amount: string, paymentMethod: string, file: File | null) => {
    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("paymentMethod", paymentMethod);
      if (file) formData.append("proof", file);
      formData.append("campaignId", id as string);

      const res = await fetch("https://hmif-peduli-backend.vercel.app/donations", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal mengirim donasi");

      setShowPopup(false);
      setShowSuccess(true);
    } catch (err) {
      alert("Gagal mengirim donasi. Coba lagi.");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Memuat data...</p>;
  if (!data) return <p className="text-center mt-10 text-red-500">Donasi tidak ditemukan.</p>;

  const rawProgress = (data.fundCollected / data.fundTarget) * 100;
  const progress = Math.min(rawProgress, 100);

  return (
    <>
      <Navbar />
      <div className="bg-[#F8F4E1] min-h-screen text-[#4E1F00] py-30 px-4 md:px-20">
        <button onClick={() => router.back()} className="mb-6 text-sm font-semibold hover:underline">
          &larr; Kembali
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Konten Kiri */}
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold">{data.campaignName}</h1>
            <p className="text-sm">{data.description}</p>

            {/* Dokumentasi */}
            <section>
              <h3 className="text-xl font-semibold mb-2 border-b border-[#FEBA17] w-fit">Dokumentasi</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {data.pictures?.map((src: string, idx: number) => (
                  <Image
                    key={idx}
                    src={src}
                    alt={`Dokumentasi ${idx + 1}`}
                    width={300}
                    height={200}
                    className="rounded-xl object-cover w-full h-32 md:h-40"
                  />
                ))}
              </div>
            </section>

            {/* Metode Donasi */}
            <section className="bg-[#FFF3CD] p-4 rounded-xl space-y-1">
              <h3 className="text-xl font-semibold mb-2 border-b border-[#FEBA17] w-fit">Metode Donasi</h3>
              <div className="space-y-1 text-sm">
                <div className="flex">
                  <span className="w-40">Transfer Bank</span>
                  <span>: <strong>{data.bankInfo?.bankName || '-'}</strong></span>
                </div>
                <div className="flex">
                  <span className="w-40">Nomor Rekening</span>
                  <span>: <strong>{data.bankInfo?.accountNumber || '-'}</strong></span>
                </div>
                <div className="flex">
                  <span className="w-40">Atas Nama</span>
                  <span>: <strong>{data.bankInfo?.accountName || '-'}</strong></span>
                </div>
                <div className="flex">
                  <span className="w-40">Kode Bank</span>
                  <span>: {data.bankInfo?.bankCode || '-'}</span>
                </div>
              </div>
            </section>

            {/* Kontak Admin */}
            <section className="bg-[#FFF3CD] p-4 rounded-xl space-y-1">
              <h3 className="text-xl font-semibold mb-2 border-b border-[#FEBA17] w-fit">Kontak Admin</h3>
              <div className="space-y-1 text-sm">
                <div className="flex">
                  <span className="w-40">Nama</span>
                  <span>: {data.contactPerson?.name || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-40">No. Handphone</span>
                  <span>: {data.contactPerson?.phone || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-40">Email</span>
                  <span>: {data.contactPerson?.email || '-'}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Sisi Kanan: Info & Donatur */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-2">
                Rp{data.fundCollected.toLocaleString('id-ID')}
              </h2>
              <div className="text-sm mb-1">Target: Rp{data.fundTarget.toLocaleString('id-ID')}</div>
              <div className="text-sm mb-1">📅 Berakhir: {new Date(data.endDate).toLocaleDateString('id-ID')}</div>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
              <div
                  className="h-2 bg-[#FEBA17] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {rawProgress > 100 && (
                <p className="text-xs text-green-600 font-semibold mt-1">
                  🎉 Donasi telah melebihi target!
                </p>
              )}
              <button
                onClick={() => setShowPopup(true)}
                className="w-full bg-[#4E1F00] hover:bg-[#74512D] text-white py-2 rounded-full text-sm font-semibold"
              >
                DONASI
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {showPopup && (
        <PopupDonasi
          onClose={() => setShowPopup(false)}
          onSubmit={handleSubmitDonasi}
          bankInfo={data.bankInfo}
          campaignId={id as string} // tambahkan ini
        />
      )}

      {showSuccess && <PopupSelesai onClose={() => setShowSuccess(false)} />}
    </>
  );
}
