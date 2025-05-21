import { MdCheckCircle } from 'react-icons/md';
import { motion } from 'framer-motion';

export default function PopupSelesai({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        className="bg-[#F8F4E1] p-8 rounded-lg shadow-md w-full max-w-md text-center space-y-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <MdCheckCircle className="w-12 h-12 mx-auto text-green-500" />
        <p>Donasi anda telah dikirimkan dan pembayaran selesai,<br />Terima Kasih atas Partisipasinya</p>
        <button onClick={onClose} className="bg-[#4E1F00] text-white px-6 py-2 rounded-full">
          SELESAI
        </button>
      </motion.div>
    </div>
  );
}
