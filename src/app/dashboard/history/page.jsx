import Head from 'next/head';
import CalculationHistory from "../../components/dashboard/CalculationHistory";

export default function HistoryPage() {
  return (
    <>
      <Head>
        <title>Histórico de Cálculos | Portal Solar</title>
      </Head>
      <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <CalculationHistory />
      </main>
    </>
  );
}
