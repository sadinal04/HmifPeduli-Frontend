import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import LayananKami from '../components/Layanan';
import Footer from '../components/Footer';
import InformasiDonasi from '../components/Informasi-donasi';
import Laporan from '../components/LaporanDonasi';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="pt-20 bg-[#F8F4E1] min-h-screen scroll-smooth">
      <Navbar />
      <HeroSection />
      <LayananKami />
      <InformasiDonasi/>
      <Laporan/>

      {/* Section tambahan untuk scroll */}
      <section className="py-20 px-6 text-center bg-[#FFF9E6]">
        <h2 className="text-4xl font-bold text-[#4E1F00] mb-6">Bergabung Sekarang</h2>
        <p className="text-lg text-[#4E1F00] mb-6">
          Jadilah bagian dari perubahan. Ayo bergabung bersama kami dalam misi kebaikan!
        </p>
        <Link href="/register" passHref>
          <button className="bg-[#FEBA17] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition cursor-pointer">
            Daftar Sekarang
          </button>
        </Link>
      </section>

      {/* Footer dipanggil dari komponen */}
      <Footer />
    </div>
  );
}
