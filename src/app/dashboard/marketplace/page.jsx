import Head from 'next/head';
import Marketplace from '../../components/dashboard/Marketplace';

export default function MarketplacePage() {
  return (
    <>
      <Head>
        <title>Marketplace | Portal Solar</title>
      </Head>
      <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <Marketplace />
      </main>
    </>
  );
}
