'use client';

import { useState, useEffect } from 'react';
import { FaUserCircle, FaEdit, FaArrowLeft, FaSave } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Profile() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // State untuk form edit
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Ambil data user dari server
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          setName(data.user.name);
          setEmail(data.user.email);
          setPhone(data.user.phoneNumber || ''); // phone bisa opsional
        } else {
          setMessage(data.message);
        }
      } catch (err) {
        setMessage('Gagal mengambil data profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Fungsi untuk menyimpan data edit
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setEditing(false);
        alert('Perubahan berhasil disimpan');
      } else {
        alert(data.message || 'Gagal menyimpan perubahan');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menyimpan');
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <>
      <div className="py-20 bg-[#F8F4E1] min-h-screen">
        <Navbar />

        <div className="max-w-4xl mx-auto bg-[#F8F4E1] shadow-lg rounded-lg p-6 mt-20 mb-10">
          <h1 className="text-3xl font-semibold text-[#4E1F00] text-center mb-8">
            Informasi Akun
          </h1>

          <div className="flex flex-col items-center space-y-4 mb-8">
            <FaUserCircle className="text-[#4E1F00] w-24 h-24" />
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-[#4E1F00]">{name}</h2>
              <p className="text-[#74512D]">{email}</p>
              <p className="text-[#74512D]">{phone}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setEditing(!editing)}
              className="text-[#FEBA17] hover:text-[#E59D0A] flex items-center space-x-2 mb-6"
            >
              <FaEdit />
              <span>{editing ? 'Batal Edit' : 'Edit Profil'}</span>
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-6">
                <label htmlFor="name" className="text-[#4E1F00] font-medium w-36">
                  Nama Lengkap:
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FEBA17] text-[#74512D]"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label htmlFor="email" className="text-[#4E1F00] font-medium w-36">
                  Email:
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FEBA17] text-[#74512D]"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label htmlFor="phone" className="text-[#4E1F00] font-medium w-36">
                  Nomor HP:
                </label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FEBA17] text-[#74512D]"
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-[#FEBA17] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#E59D0A] transition-all"
                >
                  <FaSave className="inline mr-2" />
                  Simpan
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-center space-x-6 mb-4">
                <label className="text-[#4E1F00] font-medium w-36">Nama</label>
                <p className="text-[#74512D]">{name}</p>
              </div>
              <div className="flex items-center space-x-6 mb-4">
                <label className="text-[#4E1F00] font-medium w-36">Email</label>
                <p className="text-[#74512D]">{email}</p>
              </div>
              <div className="flex items-center space-x-6 mb-4">
                <label className="text-[#4E1F00] font-medium w-36">Nomor HP</label>
                <p className="text-[#74512D]">{phone}</p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <Link href="/" className="flex items-center text-[#4E1F00] hover:text-[#74512D] space-x-2">
              <FaArrowLeft />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
