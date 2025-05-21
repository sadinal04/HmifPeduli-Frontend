import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type BankInfo = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode: string;
};

export default function PopupDonasi({
  onClose,
  onSubmit,
  bankInfo,
  campaignId, // tambah ini
}: {
  onClose: () => void;
  onSubmit: (amount: string, paymentMethod: string, file: File | null) => void;
  bankInfo: BankInfo | null;
  campaignId: string; // tambah ini
}) {

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch("http://localhost:3000/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.name);
        }
      } catch (error) {
        console.error("Gagal mengambil profil pengguna:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async () => {
    if (!amount || !paymentMethod || !file) {
      alert("Semua field wajib diisi.");
      return;
    }

    const toBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      const base64Proof = await toBase64(file);
      const token = localStorage.getItem('token'); // Boleh null

      const payload: Record<string, any> = {
        amount: Number(amount),
        paymentMethod,
        campaignId,
        proof: base64Proof,
      };

      // Tambahkan nama donatur hanya jika tersedia
      if (userName) {
        payload.donaturName = userName;
      }

      const response = await fetch("http://localhost:3000/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Donasi berhasil dikirim!");
        onClose();
      } else {
        alert("Gagal mengirim donasi: " + data.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim donasi.");
      console.error(error);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("popup-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className="popup-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <motion.div
        className="bg-[#F8F4E1] p-8 rounded-lg shadow-md max-w-4xl w-full flex gap-8"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Form Donasi */}
        <div className="flex-1 space-y-4">
          <h2 className="text-lg font-semibold text-[#4E1F00]">Masukkan Data Donasi</h2>
          <input
            className="w-full p-2 border rounded"
            placeholder="Jumlah Donasi"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          
          {/* Dropdown untuk Metode Pembayaran */}
          <select
            className="w-full p-2 border rounded"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Pilih Metode Pembayaran</option>
            <option value="BCA">BCA</option>
            <option value="BSI">BSI</option>
            <option value="Mandiri">Mandiri</option>
            <option value="Dana">Dana</option>
            <option value="Ovo">Ovo</option>
            <option value="Gopay">Gopay</option>
          </select>
          
          <input
            className="w-full p-2 border rounded"
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
          
          <button
            onClick={handleSubmit}
            className="bg-[#4E1F00] text-white px-6 py-2 rounded-full w-fit mx-auto block"
          >
            KIRIM
          </button>
        </div>

        {/* Metode Donasi */}
        <div className="flex-1 space-y-2 bg-[#FFF3CD] p-4 rounded-xl text-[#4E1F00]">
          <h3 className="text-xl font-semibold border-b border-[#FEBA17] w-fit mb-2">Metode Donasi</h3>
          <p><span className="font-semibold">Transfer Bank {bankInfo?.bankName || '-'}</span></p>
          <p>Nomor Rekening: <strong>{bankInfo?.accountNumber || '-'}</strong></p>
          <p>Atas Nama: <strong>{bankInfo?.accountName || '-'}</strong></p>
          <p>Kode Bank: <strong>{bankInfo?.bankCode || '-'}</strong></p>
        </div>
      </motion.div>
    </div>
  );
}
