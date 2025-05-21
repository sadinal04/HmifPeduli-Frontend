'use client';

import NavbarAdmin from '../../../components/NavbarAdmin';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  FaCamera,
  FaEdit,
  FaMoneyBillAlt,
  FaCalendarAlt,
  FaUniversity,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaTrash,
  FaSave
} from 'react-icons/fa';
import { ArrowLeft } from 'lucide-react';

export default function EditDonasiPage() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<any>({
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`https://hmif-peduli-backend.vercel.app/campaigns/${id}`);
        const data = await res.json();
        setFormData({
          ...data,
          startDate: data.startDate?.split('T')[0] || '',
          endDate: data.endDate?.split('T')[0] || '',
        });
      } catch (err) {
        setError('Terjadi kesalahan dalam mengambil data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [field, subField] = name.split('.');
    setFormData((prev: any) =>
      subField
        ? { ...prev, [field]: { ...prev[field], [subField]: value } }
        : { ...prev, [name]: value }
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://hmif-peduli-backend.vercel.app/campaigns/editCampaign/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok) {
        alert('Kampanye berhasil diperbarui');
        router.push('/admin/kelola-donasi');
      } else {
        setError(result.message || 'Gagal memperbarui kampanye');
      }
    } catch {
      setError('Terjadi kesalahan saat memperbarui kampanye.');
    }
  };

  const handleDelete = async () => {
    if (confirm('Yakin ingin menghapus kampanye ini?')) {
      try {
        const res = await fetch(`https://hmif-peduli-backend.vercel.app/campaigns/deleteCampaign/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          alert('Kampanye berhasil dihapus');
          router.push('/admin/kelola-donasi');
        } else {
          setError('Gagal menghapus kampanye');
        }
      } catch {
        setError('Terjadi kesalahan saat menghapus kampanye.');
      }
    }
  };

  if (loading) return <p className="text-center mt-20">Memuat data...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">Error: {error}</p>;

    return (
    <div className="min-h-screen bg-[#F8F4E1]">
        <NavbarAdmin />
        <div className="min-h-screen flex bg-[#F8F4E1]">
        <div className="ml-64 flex-1 flex justify-center mt-20 px-4">
        <form onSubmit={handleSave} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl space-y-6">
          <button
            onClick={() => router.back()}
            type="button"
            className="flex items-center text-sm text-[#74512D] mb-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </button>

          <h2 className="text-3xl font-bold text-center text-[#74512D] mb-6">
            <FaEdit className="inline-block mr-2" />
            Edit Kampanye
          </h2>
            {error && <p className="text-red-600 font-medium text-center">{error}</p>}

            {/* Field Utama */}
            {[
                { name: 'campaignName', icon: <FaEdit />, label: 'Nama Kampanye' },
                { name: 'description', icon: <FaEdit />, label: 'Deskripsi' },
                { name: 'fundTarget', icon: <FaMoneyBillAlt />, label: 'Target Dana' },
                { name: 'fundCollected', icon: <FaMoneyBillAlt />, label: 'Dana Terkumpul' },
                { name: 'startDate', icon: <FaCalendarAlt />, label: 'Tanggal Mulai', type: 'date' },
                { name: 'endDate', icon: <FaCalendarAlt />, label: 'Tanggal Selesai', type: 'date' },
            ].map((field, idx) => (
                <div key={idx}>
                <label className="block mb-1 text-sm font-medium text-[#4E1F00]">
                    <span className="inline-flex items-center gap-2">
                    {field.icon} {field.label}
                    </span>
                </label>
                <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-3 border border-[#74512D] rounded"
                    placeholder={field.label}
                />
                </div>
            ))}

            {/* Informasi Bank */}
            <div>
                <h3 className="text-xl font-semibold text-[#4E1F00] mb-2">
                <FaUniversity className="inline-block mr-2" />
                Informasi Bank
                </h3>
                {Object.keys(formData.bankInfo).map(subField => (
                <input
                    key={subField}
                    type="text"
                    name={`bankInfo.${subField}`}
                    value={formData.bankInfo[subField]}
                    onChange={handleChange}
                    placeholder={subField.replace(/([A-Z])/g, ' $1')}
                    className="w-full p-3 mb-2 border border-[#74512D] rounded"
                />
                ))}
            </div>

            {/* Kontak Person */}
            <div>
                <h3 className="text-xl font-semibold text-[#4E1F00] mb-2">
                <FaUser className="inline-block mr-2" />
                Kontak Person
                </h3>
                {Object.keys(formData.contactPerson).map((subField, index) => {
                const icon = subField === 'phone' ? <FaPhone /> : subField === 'email' ? <FaEnvelope /> : <FaUser />;
                return (
                    <div key={index}>
                    <label className="text-sm text-[#4E1F00] font-medium flex items-center gap-2 mb-1">
                        {icon} {subField.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                        type="text"
                        name={`contactPerson.${subField}`}
                        value={formData.contactPerson[subField]}
                        onChange={handleChange}
                        className="w-full p-3 mb-2 border border-[#74512D] rounded"
                    />
                    </div>
                );
                })}
            </div>

            {/* Status */}
            <div>
                <label className="block mb-1 text-sm font-medium text-[#4E1F00]">
                <FaEdit className="inline-block mr-2" /> Status Kampanye
                </label>
                <select
                name="campaignStatus"
                value={formData.campaignStatus}
                onChange={handleChange}
                className="w-full p-3 border border-[#74512D] rounded"
                >
                <option value="Active">Aktif</option>
                <option value="Completed">Selesai</option>
                <option value="Abort">Ditutup</option>
                </select>
            </div>

            {/* Tombol */}
            <div className="flex justify-between gap-4">
                <button type="submit" className="w-1/2 bg-[#FEBA17] hover:bg-yellow-500 text-white py-3 rounded font-semibold flex items-center justify-center gap-2">
                <FaSave /> Simpan
                </button>
                <button
                type="button"
                onClick={handleDelete}
                className="w-1/2 bg-red-500 hover:bg-red-600 text-white py-3 rounded font-semibold flex items-center justify-center gap-2"
                >
                <FaTrash /> Hapus
                </button>
            </div>
            </form>
            </div>
        </div>
    </div>
  );
}
