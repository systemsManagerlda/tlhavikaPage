import PumpCalculator from '../../components/dashboard/PumpCalculator';

export const metadata = {
  title: 'Dimensionamento de Bombas',
};

export default function PumpsPage() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dimensionamento de Bombas Solares</h1>
        <PumpCalculator />
      </div>
    </div>
  );
}