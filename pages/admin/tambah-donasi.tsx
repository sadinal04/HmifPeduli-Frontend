'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCamera, FaEdit, FaMoneyBillAlt, FaCalendarAlt } from 'react-icons/fa';
import NavbarAdmin from '../../components/NavbarAdmin';
import { ArrowLeft } from 'lucide-react';

export default function TambahDonasi() {
  const router = useRouter();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    campaignName: '',
    description: '',
    fundTarget: 0,
    fundCollected: 0,
    campaignStatus: 'Active',
    startDate: '',
    endDate: '',
    category: 'Lainnya',
    bankInfo: {
      bankName: '',
      accountNumber: '',
      accountName: '',
      bankCode: '',
    },
    contactPerson: {
      name: '',
      phone: '',
      email: '',
    },
  });

  const [error, setError] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.includes('bankInfo.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        bankInfo: { ...prev.bankInfo, [field]: value },
      }));
    } else if (name.includes('contactPerson.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contactPerson: { ...prev.contactPerson, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(files);
  };

  const validateForm = () => {
    if (!formData.campaignName || !formData.description || formData.fundTarget <= 0 || formData.startDate === '' || formData.endDate === '') {
      setError('Semua kolom wajib diisi dengan benar.');
      return false;
    }
    if (selectedFiles.length === 0) {
      setError('Minimal satu gambar harus diunggah.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const base64Images = await Promise.all(selectedFiles.map(convertToBase64));
      const campaignData = { ...formData, pictures: base64Images };

      const res = await fetch('http://localhost:3000/campaigns/createCampaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/admin/');
        }, 2000);
      } else {
        const err = await res.json();
        setError(err.message || 'Gagal membuat campaign');
      }
    } catch (error) {
      console.error(error);
      setError('Terjadi kesalahan saat submit.');
    } finally {
      setShowConfirm(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="min-h-screen flex bg-[#F8F4E1]">
      <NavbarAdmin />
      <div className="ml-64 flex-1 flex justify-center mt-20 px-4">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl space-y-6">
          <button
            onClick={() => router.back()}
            type="button"
            className="flex items-center text-sm text-[#74512D] mb-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </button>
          <h2 className="text-3xl font-bold text-center text-[#74512D] mb-6">Tambah Donasi</h2>
          {error && <p className="text-red-600 font-medium text-center">{error}</p>}
          {showSuccess && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
              <div className="bg-white p-6 rounded-xl shadow-2xl text-center w-80">
                <h3 className="text-lg font-semibold text-green-700 mb-4">Kampanye berhasil ditambahkan!</h3>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="mt-4 bg-[#FEBA17] text-white px-4 py-2 rounded hover:bg-[#74512D]"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          {/* Campaign Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#4E1F00]">Nama Kampanye</label>
            <div className="relative">
              <FaEdit className="absolute left-3 top-3 text-[#74512D] text-xl" />
              <input
                type="text"
                name="campaignName"
                placeholder="Contoh: Bantu Pendidikan Anak Desa"
                value={formData.campaignName}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-[#74512D] rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#4E1F00]">Deskripsi Kampanye</label>
            <textarea
              name="description"
              placeholder="Tuliskan detail kampanye"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-[#74512D] rounded resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
              rows={4}
            />
          </div>

          {/* Dana & Tanggal */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-[#4E1F00]">Target Dana</label>
              <div className="relative">
                <FaMoneyBillAlt className="absolute left-3 top-3 text-[#74512D] text-xl" />
                <input
                  type="number"
                  name="fundTarget"
                  placeholder="Contoh: 5000000"
                  value={formData.fundTarget}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-[#74512D] rounded"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#4E1F00]">Dana Terkumpul (opsional)</label>
              <div className="relative">
                <FaMoneyBillAlt className="absolute left-3 top-3 text-[#74512D] text-xl" />
                <input
                  type="number"
                  name="fundCollected"
                  placeholder="Jika ada"
                  value={formData.fundCollected}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-[#74512D] rounded"
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-[#4E1F00]">Tanggal Mulai</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-[#74512D] text-xl" />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-[#74512D] rounded"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#4E1F00]">Tanggal Berakhir</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-[#74512D] text-xl" />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-[#74512D] rounded"
                  required
                />
              </div>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#4E1F00]">Kategori Kampanye</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-[#74512D] rounded"
            >
              <option value="Kesehatan">Kesehatan</option>
              <option value="Edukasi">Edukasi</option>
              <option value="Kemanusiaan">Kemanusiaan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Informasi Bank */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-[#4E1F00]">Nama Bank</label>
              <input
                type="text"
                name="bankInfo.bankName"
                value={formData.bankInfo.bankName}
                onChange={handleChange}
                className="w-full p-3 border border-[#74512D] rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#4E1F00]">Kode Bank</label>
              <input
                type="text"
                name="bankInfo.bankCode"
                value={formData.bankInfo.bankCode}
                onChange={handleChange}
                className="w-full p-3 border border-[#74512D] rounded"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-[#4E1F00]">No Rekening</label>
              <input
                type="text"
                name="bankInfo.accountNumber"
                value={formData.bankInfo.accountNumber}
                onChange={handleChange}
                className="w-full p-3 border border-[#74512D] rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#4E1F00]">Nama Pemilik Rekening</label>
              <input
                type="text"
                name="bankInfo.accountName"
                value={formData.bankInfo.accountName}
                onChange={handleChange}
                className="w-full p-3 border border-[#74512D] rounded"
                required
              />
            </div>
          </div>

          {/* Contact Person */}
          <div className="mt-6">
            <label className="block mb-1 text-sm font-medium text-[#4E1F00]">Nama Penanggung Jawab</label>
            <input
              type="text"
              name="contactPerson.name"
              value={formData.contactPerson.name}
              onChange={handleChange}
              className="w-full p-3 border border-[#74512D] rounded"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-[#4E1F00]">No Telepon Kontak</label>
              <input
                type="text"
                name="contactPerson.phone"
                value={formData.contactPerson.phone}
                onChange={handleChange}
                className="w-full p-3 border border-[#74512D] rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#4E1F00]">Email Kontak</label>
              <input
                type="email"
                name="contactPerson.email"
                value={formData.contactPerson.email}
                onChange={handleChange}
                className="w-full p-3 border border-[#74512D] rounded"
                required
              />
            </div>
          </div>


          {/* Upload gambar */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#4E1F00]">Upload Gambar Kampanye</label>
            <input
              type="file"
              name="pictures"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full p-3 border border-[#74512D] rounded"
              required
            />
            {selectedFiles.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="w-24 h-24 overflow-hidden rounded shadow border">
                    <img src={URL.createObjectURL(file)} alt="preview" className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#FEBA17] text-[#4E1F00] font-semibold py-3 rounded hover:bg-[#74512D] hover:text-white transition"
          >
            Tambah Kampanye
          </button>
        </form>
      </div>

      {/* Modal Konfirmasi */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-xl shadow-2xl text-center w-80">
            <h3 className="text-lg font-semibold text-[#4E1F00] mb-4">Yakin ingin menambahkan kampanye ini?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Ya
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
