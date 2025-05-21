import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body className="font-[Poppins] bg-[#F8F4E1] text-[#4E1F00]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
