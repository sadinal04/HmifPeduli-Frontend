'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSection() {
  const images = [
    "/kids-smile.jpeg",
    "/kids2.jpeg",
    "/kids3.jpg"
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setTextIndex((prev) => prev + 1);
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  const typedText = "Platform donasi yang dikelola oleh Himpunan Mahasiswa Informatika Universitas Syiah Kuala.";

  return (
    <main className="bg-[#FFF9E6] flex flex-col-reverse md:flex-row items-center justify-between px-20 py-10 gap-12">
      <motion.div
        className="max-w-xl"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-bold text-[#4E1F00] mb-15">
          Bersama Kita Peduli, <br />
          Bersama Kita Berbagi
        </h1>

        <motion.p
          className="text-[#4E1F00] text-3xl mb-15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {typedText.slice(0, textIndex)}
        </motion.p>

        <div className="flex gap-4">
          <Link href="/">
            <button className="border-2 border-[#74512D] bg-[#74512D] text-white px-6 py-3 rounded-full font-medium text-lg">
              Bergabung
            </button>
          </Link>
          <Link href="/tentang-kami">
            <button className="border-2 border-[#74512D] text-[#4E1F00] px-6 py-3 rounded-full font-semibold text-lg bg-[#F8F4E1] hover:bg-[#e5d3a1] active:bg-[#c1a075] transition-all">
              Info Selengkapnya
            </button>
          </Link>
        </div>
      </motion.div>

      <div className="relative w-full md:w-[1000px] max-w-6xl h-[600px] md:h-[700px] ml-[120px] translate-y-30">
        {/* Custom frame menggunakan mask dari frame.png */}
        <div
          className="w-full h-full"
          style={{
            WebkitMaskImage: "url('/frame.png')",
            WebkitMaskSize: 'cover',
            WebkitMaskRepeat: 'no-repeat',
            maskImage: "url('/frame1.png')",
            maskSize: 'cover',
            maskRepeat: 'no-repeat',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={images[currentImage]}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              <Image
                src={images[currentImage]}
                alt={`Slide ${currentImage + 1}`}
                width={800}
                height={800}
                className="object-cover w-full h-full"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
