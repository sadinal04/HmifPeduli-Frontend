'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Ikon untuk input email dan password

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("https://hmif-peduli-backend.vercel.app/admins/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text(); // Get the raw response as text
    console.log(text); // Log the raw response to inspect it

    try {
      const data = JSON.parse(text); // Attempt to parse the response as JSON
      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/admin/'); // Redirect to admin dashboard after successful login
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      setError("Failed to parse response. The response might not be JSON.");
    }
  };

  return (
    <div className="h-[100vh] w-full flex flex-col justify-center items-center">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-96 space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#74512D]">Login Admin</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Input Email */}
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 pl-10 border border-[#74512D] rounded focus:outline-none focus:ring-2 focus:ring-[#FEBA17] transition"
            required
          />
          <FaEnvelope className="absolute left-3 top-3 text-[#74512D] text-xl" />
        </div>

        {/* Input Password */}
        <div className="relative">
          <input
            type="password"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-10 border border-[#74512D] rounded focus:outline-none focus:ring-2 focus:ring-[#FEBA17] transition"
            required
          />
          <FaLock className="absolute left-3 top-3 text-[#74512D] text-xl" />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-[#FEBA17] text-[#4E1F00] py-3 rounded hover:bg-[#74512D] transition duration-300 ease-in-out">
          Masuk
        </button>
      </form>
    </div>
  );
}
