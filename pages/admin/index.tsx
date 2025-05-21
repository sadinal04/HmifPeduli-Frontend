'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarAdmin from '../../components/NavbarAdmin'; // Import NavbarAdmin
import Link from 'next/link';
import { FaPlusCircle, FaRegCreditCard, FaClipboardList, FaChartLine } from 'react-icons/fa'; // Ikon yang digunakan

// Daftar layanan dengan ikon dan deskripsi singkat
const services = [
  {
    title: 'Tambah Donasi',
    icon: <FaPlusCircle className="text-4xl text-[#D2691E]" />,
    link: '/admin/tambah-donasi',
    description: 'Tambah donasi untuk membantu lebih banyak orang.'
  },
  {
    title: 'Verifikasi Pembayaran',
    icon: <FaRegCreditCard className="text-4xl text-[#F4C430]" />,
    link: '/admin/verifikasi',
    description: 'Verifikasi pembayaran yang diterima.'
  },
  {
    title: 'Kelola Donasi',
    icon: <FaClipboardList className="text-4xl text-[#8B4513]" />,
    link: '/admin/kelola-donasi',
    description: 'Kelola dan update informasi donasi.'
  },
  {
    title: 'Laporan Donasi',
    icon: <FaChartLine className="text-4xl text-[#8B4513]" />,
    link: '/admin/laporan',
    description: 'Lihat dan analisis laporan donasi.'
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Menambahkan state loading
  const [error, setError] = useState<string | null>(null); // Menambahkan state error
  const [pendingDonationsCount, setPendingDonationsCount] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/loginAdmin'); // Arahkan ke halaman login jika token tidak ada
      return;
    }

    // Verifikasi token dan ambil data admin
    fetch('https://hmif-peduli-backend.vercel.app/admins/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unauthorized atau token tidak valid');
        }
        return response.json();
      })
      .then((data) => {
        if (data.admin) {
          setAdminData(data.admin); // Jika token valid, tampilkan data admin
        } else {
          setError('Gagal memuat data admin');
          router.push('/admin/loginAdmin');
        }
      })
      .catch((error) => {
        console.error('Error saat mengambil data admin:', error);
        setError(error.message);
        router.push('/admin/loginAdmin');
      })
      .finally(() => {
        setLoading(false); // Set loading menjadi false setelah fetch selesai
      });

    // Ambil jumlah donasi yang masih pending
    const fetchPendingDonations = async () => {
      const res = await fetch('https://hmif-peduli-backend.vercel.app/donations');
      const data = await res.json();
      const pending = data.filter((donation: any) => donation.donationStatus === "Pending");
      setPendingDonationsCount(pending.length);
    };

    fetchPendingDonations();
  }, [router]);

  return (
    <div className="flex">
      {/* Navbar Admin di samping */}
      <NavbarAdmin />

      <main className="ml-64 p-6 w-full">
        <div className="min-h-screen bg-[#F8F4E1]">
          <h1 className="text-2xl font-semibold text-[#74512D]">Selamat Datang, Admin</h1>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p> // Menampilkan pesan error jika ada
          ) : adminData ? (
            <div className="mt-4">
              {/* Informasi Profil Admin */}
              <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-xl font-semibold text-[#74512D] mb-2">Profil Admin</h2>
                <p className="text-[#4E1F00] mb-2"><strong>Nama:</strong> {adminData.name}</p>
                <p className="text-[#4E1F00] mb-2"><strong>Email:</strong> {adminData.email}</p>
              </div>

              {/* Layanan */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {services.map((service, index) => (
                  <Link key={index} href={service.link}>
                    <div
                      className="bg-white rounded-3xl shadow-md p-8 text-center border hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out h-80 relative"
                    >
                      {/* Badge untuk jumlah donasi pending */}
                      {service.title === "Verifikasi Pembayaran" && pendingDonationsCount > 0 && (
                        <div className="absolute top-2 right-2 bg-[#F4C430] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                          {pendingDonationsCount}
                        </div>
                      )}
                      <div className="flex justify-center items-center mb-6">
                        <div className="bg-[#FFF5D1] w-20 h-20 rounded-full flex items-center justify-center shadow-inner">
                          {service.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-[#4E1F00] mb-4 tracking-wide">
                        {service.title}
                      </h3>
                      <p className="text-sm text-[#74512D] mb-4">{service.description}</p>
                      <span className="text-[#FEBA17] font-medium flex items-center justify-center gap-2 hover:underline transition">
                        Pergi <span className="text-2xl">→</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p>Data admin tidak ditemukan</p> // Menangani kasus jika data admin tidak ditemukan
          )}
        </div>
      </main>
    </div>
  );
}
