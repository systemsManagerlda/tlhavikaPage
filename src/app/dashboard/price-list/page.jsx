import Head from 'next/head';
import PriceList from '../../components/Dashboard/PriceList';

export default function PriceListPage() {
  return (
    <>
      <Head>
        <title>Lista de Preços | Portal Solar</title>
      </Head>
      <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <PriceList />
      </main>
    </>
  );
}
