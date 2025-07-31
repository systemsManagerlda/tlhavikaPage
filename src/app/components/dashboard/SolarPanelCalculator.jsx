'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateSolarPanels } from '../../lib/calculations';
import CalculationResultModal from '../../components/ui/CalculationResultModal';

export default function SolarPanelCalculator() {
  const [formData, setFormData] = useState({
    clientName: '',
    phoneNumber: '',
    email: '',
    city: '',
    voltage: '',
    pumpPower: '',
    flowRate: '',
    isHybrid: false,
    panelPower: '',
    vmp: '',
    voc: '',
    brand: ''
  });
  
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const calculationResult = calculateSolarPanels(formData);
      setResult(calculationResult);
      setIsModalOpen(true);
      
      // Salvar no banco de dados
      const response = await fetch('/api/calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'solar_panel',
          data: formData,
          result: calculationResult
        }),
      });
      
      if (!response.ok) throw new Error('Failed to save calculation');
      
    } catch (error) {
      console.error('Erro no cálculo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Dimensionamento de Painéis Solares</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Cliente</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Número de Telefone</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tensão (V)</label>
            <input
              type="number"
              name="voltage"
              value={formData.voltage}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Potência Nominal da Bomba (W)</label>
            <input
              type="number"
              name="pumpPower"
              value={formData.pumpPower}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Fluxo em TDH</label>
            <input
              type="number"
              name="flowRate"
              value={formData.flowRate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isHybrid"
              checked={formData.isHybrid}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Sistema Híbrido</label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Potência do Painel Solar (W)</label>
            <input
              type="number"
              name="panelPower"
              value={formData.panelPower}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">VMP (V)</label>
            <input
              type="number"
              name="vmp"
              value={formData.vmp}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">VOC (V)</label>
            <input
              type="number"
              name="voc"
              value={formData.voc}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Marca</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {isLoading ? 'Calculando...' : 'Calcular Painéis Recomendados'}
          </button>
        </div>
      </form>

      <CalculationResultModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={result}
        type="solar_panel"
        onSaveToHistory={() => router.push('/dashboard/history')}
        onNewCalculation={() => {
          setResult(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}