import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';

function FormatDate({ date }: { date: string }) {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    const d = new Date(date);
    setFormatted(d.toLocaleString());
  }, [date]);

  return <p className="text-xs text-gray-500 mt-2">{formatted}</p>;
}

const notifications = [
  {
    id: 1,
    type: 'new-campaign',
    title: 'Kampanye Baru Dimulai',
    message: 'Kampanye donasi "Bantuan Pendidikan Anak Yatim" telah dimulai. Yuk berdonasi!',
    date: '2025-04-24 08:00',
  },
  {
    id: 2,
    type: 'report-published',
    title: 'Laporan Telah Diterbitkan',
    message: 'Laporan untuk kampanye "Bantuan Korban Banjir Aceh" telah tersedia.',
    date: '2025-04-22 14:30',
  },
];

export default function Notifikasi() {
  const router = useRouter();

  const handleRedirect = (type: string) => {
    if (type === 'new-campaign') {
      router.push('/#informasi-donasi');
    } else if (type === 'report-published') {
      router.push('/#laporan-donasi');
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#F8F4E1] min-h-screen px-4 py-30 md:px-20 text-[#4E1F00]">
        <h1 className="text-3xl font-bold mb-6">Notifikasi</h1>
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl shadow-md border-l-4 transform transition-all duration-500 ease-in-out ${
                notif.type === 'new-campaign' ? 'bg-white border-[#FEBA17]' : 'bg-[#FFF3CD] border-[#74512D]'
              } hover:scale-105 hover:shadow-xl`}
            >
              <h3 className="font-semibold text-lg">{notif.title}</h3>
              <p className="text-sm mt-1">{notif.message}</p>
              <FormatDate date={notif.date} />
              <button
                onClick={() => handleRedirect(notif.type)}
                className="mt-4 px-4 py-1 text-sm bg-[#FEBA17] text-white rounded hover:bg-[#e2a600] transition-all duration-200"
              >
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
