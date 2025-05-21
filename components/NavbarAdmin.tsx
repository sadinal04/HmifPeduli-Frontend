'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  HandCoins,
  FileText,
  LogOut,
  CheckCircle,
  PlusCircle,
} from 'lucide-react';

export default function NavbarAdmin() {
  const [admin, setAdmin] = useState<{ name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin/loginAdmin');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/admins/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.admin) {
          setAdmin(data.admin);
        } else {
          router.push('/admin/loginAdmin');
        }
      } catch (err) {
        console.error(err);
        router.push('/admin/loginAdmin');
      }
    };

    fetchAdmin();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/loginAdmin');
  };

  return (
    <aside className="h-screen w-64 bg-[#74512D] text-white fixed top-0 left-0 flex flex-col justify-between shadow-lg">
      <div>
        <div className="p-4 text-xl font-bold border-b border-[#F8F4E1]">
          Admin Panel
        </div>
        <div className="p-4 text-sm border-b border-[#F8F4E1]">
          {admin ? `Halo, ${admin.name}` : 'Memuat...'}
        </div>
        <nav className="flex flex-col gap-2 p-4 text-base">
          {/* Menempatkan Dashboard di paling atas */}
          <Link href="/admin" className="flex items-center gap-2 hover:bg-[#FEBA17] hover:text-[#4E1F00] p-2 rounded">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link href="/admin/tambah-donasi" className="flex items-center gap-2 hover:bg-[#FEBA17] hover:text-[#4E1F00] p-2 rounded">
            <PlusCircle className="w-5 h-5" />
            Tambah Donasi
          </Link>

          <Link href="/admin/verifikasi" className="flex items-center gap-2 hover:bg-[#FEBA17] hover:text-[#4E1F00] p-2 rounded">
            <CheckCircle className="w-5 h-5" />
            Verifikasi Pembayaran
          </Link>

          <Link href="/admin/kelola-donasi" className="flex items-center gap-2 hover:bg-[#FEBA17] hover:text-[#4E1F00] p-2 rounded">
            <HandCoins className="w-5 h-5" />
            Kelola Donasi
          </Link>

          <Link href="/admin/laporan" className="flex items-center gap-2 hover:bg-[#FEBA17] hover:text-[#4E1F00] p-2 rounded">
            <FileText className="w-5 h-5" />
            Laporan Donasi
          </Link>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="m-4 flex items-center gap-2 justify-center p-2 bg-[#FEBA17] text-[#4E1F00] rounded hover:bg-red-500 hover:text-white"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </aside>
  );
}
