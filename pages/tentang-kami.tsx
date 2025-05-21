'use client';

import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function TentangKami() {
  return (
    <div className="pt-20 bg-[#FFF9E6] min-h-screen text-[#4E1F00]">
      <Navbar />
      <div className="px-6 md:px-20 py-24 space-y-24">

        {/* Judul */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Tentang Kami
          </h1>
          <p className="text-center text-xl max-w-3xl mx-auto">
            Kami adalah platform donasi sosial berbasis teknologi, diprakarsai oleh Himpunan Mahasiswa Informatika Universitas Syiah Kuala. 
            Misi kami adalah menghubungkan para dermawan dengan mereka yang membutuhkan, secara transparan dan efisien.
          </p>
        </motion.section>

        {/* Visi Misi */}
        <motion.section
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-4">Visi</h2>
              <p>
                Menjadi platform donasi digital terpercaya yang mampu mendorong semangat gotong royong dan kepedulian sosial di era teknologi.
              </p>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-4">Misi</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Memfasilitasi donasi yang mudah dan cepat secara online.</li>
                <li>Meningkatkan transparansi dalam penyaluran dana.</li>
                <li>Memberdayakan komunitas melalui aksi sosial dan kemanusiaan.</li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* Tim Kami */}
        <motion.section
          className="max-w-6xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-12">Tim Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              { name: 'Sadinal Mufti', role: 'Project Manager', image: '/team/sadinal.jpg' },
              { name: 'Indriani Miza Alfiyanti', role: 'UI/UX Designer', image: '/team/sadinal.jpg' },
              { name: 'Muhammad Faruqi', role: 'Full Stack Developer', image: '/team/sadinal.jpg' },
              { name: 'Maulizar', role: 'Full Stack Developer', image: '/team/sadinal.jpg' },
            ].map((person, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <Image
                  src={person.image}
                  alt={person.name}
                  width={200}
                  height={200}
                  className="rounded-full object-cover mb-4 border-4 border-[#FEBA17]"
                />
                <h3 className="font-semibold text-xl">{person.name}</h3>
                <p className="text-[#74512D]">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Kontak */}
        <motion.section
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6">Hubungi Kami</h2>
          <p className="mb-4">📧 Email: <a href="mailto:hmifpeduli@gmail.com" className="underline text-[#74512D]">info@peduli.com</a></p>
          <p className="mb-4">📱 WhatsApp: <a href="https://wa.me/6281234567890" className="underline text-[#74512D]">+62 812-3456-7890</a></p>
          <p className="mb-4">📍 Alamat: Jl. Teuku Nyak Arief No.441, Banda Aceh, Indonesia</p>
        </motion.section>

      </div>
      <Footer />
    </div>
  );
}
