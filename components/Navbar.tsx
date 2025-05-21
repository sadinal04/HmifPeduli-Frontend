'use client';

import { useState } from 'react';
import router, { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, X, Bell } from 'lucide-react';
import { FaHandHoldingHeart, FaUserCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const handleLogout = () => {
  const confirmed = window.confirm('Apakah Anda yakin ingin keluar?');
  if (confirmed) {
    localStorage.removeItem('token');
    router.push('/login');
  }
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Tentang Kami', href: '/tentang-kami' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F4E1] shadow-sm px-6 md:px-20 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-[#4E1F00] font-bold text-2xl md:text-5xl flex items-center gap-2">
          <FaHandHoldingHeart className="text-[#4E1F00] w-10 h-10" />
          <span className="tracking-wide">HMIFPeduli</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10 text-[#4E1F00] font-medium">
          {navLinks.map(({ label, href }, index) => (
            <Link
              key={index}
              href={href}
              className="relative group transition duration-200"
            >
              <span>{label}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#FEBA17] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          {/* Dropdown Layanan Kami */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="relative group flex items-center space-x-2 transition duration-200"
            >
              <span>Layanan Kami</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg w-48 text-[#4E1F00] font-medium">
                <Link href="/#informasi-kampanye" className="block px-4 py-2 hover:bg-[#FEBA17] hover:text-white" onClick={() => setDropdownOpen(false)}>
                  Informasi Kampanye
                </Link>
                <Link href="/#laporan-kampanye" className="block px-4 py-2 hover:bg-[#FEBA17] hover:text-white" onClick={() => setDropdownOpen(false)}>
                  Laporan Kampanye
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex space-x-5 items-center">
          <button
            className="relative text-[#4E1F00] hover:text-[#74512D] transition transform hover:scale-105 active:scale-100"
            onClick={() => router.push('/notifikasi')}
          >
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              3
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2"
            >
              <FaUserCircle className="w-8 h-8 text-[#4E1F00]" />
              <span className="text-[#4E1F00]">Profil</span>
            </button>
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 text-[#4E1F00] font-medium">
                <Link href="/profil" className="block px-4 py-2 hover:bg-[#FEBA17] hover:text-white" onClick={() => setProfileDropdownOpen(false)}>
                  <FaUserCircle className="inline-block mr-2" /> Lihat Profil
                </Link>
                <Link href="/login" className="block px-4 py-2 hover:bg-[#FEBA17] hover:text-white" onClick={() => setProfileDropdownOpen(false)}>
                  <FaSignInAlt className="inline-block mr-2" /> Masuk
                </Link>
                <button onClick={handleLogout} className="w-full text-left block px-4 py-2 hover:bg-[#FEBA17] hover:text-white">
                  <FaSignOutAlt className="inline-block mr-2" /> Keluar
                </button>
              </div>
            )}
          </div>

          {/* Donasi Button */}
          <Link
            href="/#informasi-kampanye"
            className="bg-transparent text-[#FEBA17] px-4 py-2 rounded-full font-semibold hover:bg-[#FEBA17] hover:text-white active:bg-[#E59D0A] transition-all"
          >
            Donasi
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-[#4E1F00]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mt-4 flex flex-col gap-4 md:hidden text-[#4E1F00] font-medium animate-slide-down">
          {navLinks.map(({ label, href }, index) => (
            <Link key={index} href={href} onClick={() => setMenuOpen(false)} className="hover:text-[#74512D]">
              {label}
            </Link>
          ))}

          {/* Mobile Dropdown Layanan Kami */}
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-[#4E1F00] font-medium">
              Layanan Kami
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg w-48 text-[#4E1F00] font-medium">
                <Link href="#informasi-kampanye" className="block px-4 py-2 hover:bg-[#FEBA17] hover:text-white" onClick={() => setDropdownOpen(false)}>
                  Informasi Kampanye
                </Link>
                <Link href="#laporan-donasi" className="block px-4 py-2 hover:bg-[#FEBA17] hover:text-white" onClick={() => setDropdownOpen(false)}>
                  Laporan Donasi
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Profile Dropdown */}
          <div className="relative mt-4">
            <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="text-[#4E1F00] font-medium">
              Profil
            </button>
            {profileDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg w-48 text-[#4E1F00] font-medium">
                <Link href="/profil" className="block px-4 py-2 hover:bg-[#FEBA17] hover:text-white" onClick={() => setProfileDropdownOpen(false)}>
                  <FaUserCircle className="inline-block mr-2" /> Lihat Profil
                </Link>
                <Link href="/login" className="block px-4 py-2 hover:bg-[#FEBA17] hover:text-white" onClick={() => setProfileDropdownOpen(false)}>
                  <FaSignInAlt className="inline-block mr-2" /> Masuk
                </Link>
                <button onClick={handleLogout} className="w-full text-left block px-4 py-2 hover:bg-[#FEBA17] hover:text-white">
                  <FaSignOutAlt className="inline-block mr-2" /> Keluar
                </button>
              </div>
            )}
          </div>

          {/* Donasi Button */}
          <Link
            href="/#informasi-kampanye"
            className="bg-[#FEBA17] text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition text-center"
            onClick={() => setMenuOpen(false)}
          >
            Donasi
          </Link>
        </div>
      )}
    </nav>
  );
}
