import dynamic from 'next/dynamic';
import Head from 'next/head';
import SolarPanelCalculator from "../../components/dashboard/SolarPanelCalculator";


export default function SolarPanelsPage() {
  return (
    <>
      <Head>
        <title>Dimensionamento de Painéis Solares | Portal Solar</title>
      </Head>
      <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <SolarPanelCalculator />
      </main>
    </>
  );
}
