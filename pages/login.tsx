import { useState } from "react";
import { useRouter } from "next/router";
import { FaHandHoldingHeart } from "react-icons/fa"; // Make sure to import the icon
import { FaArrowLeft } from "react-icons/fa"; // Import the back arrow icon

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter(); // Untuk melakukan redirect setelah login berhasil

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://hmif-peduli-backend.vercel.app/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login berhasil!");
        localStorage.setItem("token", data.token); // Simpan token di localStorage
        router.push("/"); // Redirect ke halaman beranda/dashboard setelah login berhasil
      } else {
        setMessage(data.message || "Login gagal");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan");
    }
  };

  return (
    <div className="h-[100vh] w-full flex flex-col justify-center items-center">
      <div className="w-full flex justify-center">
        <div className="h-[6.5vh] w-[335px] flex items-end py-2 px-2">
          <a href="/">
            <button className="flex flex-row justify-center items-center gap-1 p-1">
              <FaArrowLeft className="h-[19px] w-[19px]" />
              <h1 className="text-[12px]">Kembali</h1>
            </button>
          </a>
        </div>
      </div>
      <div className="border-[#cfcfcf] shadow-md border-1 h-[550px] w-[335px] rounded-[20px] bg-[#fff] px-7 py-14 flex flex-col">
        <div className="items-center flex gap-2 justify-center h-[5vh]">
          <FaHandHoldingHeart className="text-[#4E1F00] w-10 h-10" />
          <span className="tracking-wide text-[20px] font-semibold">HMIFPeduli</span> {/* Adjusted font size */}
        </div>
        <h1 className="text-center m-[1.3rem]">Yuk lanjutkan niat muliamu.</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="h-[14vh] gap-2 flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="text-[13px] border-1 rounded-[7px] h-9.5 p-2.5 w-full border-[#A7A7A7] focus:outline-1 focus:outline-[#74512D]"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="text-[13px] border-1 rounded-[7px] h-9.5 p-2.5 w-full focus:outline-1 focus:outline-[#74512D] border-[#A7A7A7]"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="border-1 text-[13px] text-[#FFFFFF] bg-[#74512D] hover:bg-[#5f4b37] focus:outline-2 focus:outline-offset-1 focus:outline-[#74512D] border-[#a7a7a7] shadow-md rounded-[7px] h-9.5"
          >
            Masuk
          </button>
        </form>
        {message && <p className="text-center text-red-500 text-[12px] mt-2">{message}</p>}
        <h1 className="pt-3 pb-2 text-center text-[12px] mt-1">Atau masuk dengan</h1>
        <a
          href="/register"
          className="text-center flex justify-center items-center mt-1 hover:underline text-sky-600"
        >
          <h1 className="text-[12px] mt-1">Belum punya akun? Daftar disini</h1>
        </a>
      </div>
    </div>
  );
}
