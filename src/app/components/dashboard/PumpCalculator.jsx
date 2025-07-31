'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculatePump } from '../../lib/calculations';
import CalculationResultModal from '../../components/ui/CalculationResultModal';

export default function PumpCalculator() {
  const [formData, setFormData] = useState({
    clientName: '',
    phoneNumber: '',
    email: '',
    wellDepth: '',
    tankHeight: '',
    pumpDistance: '',
    pipeDiameter: '',
    waterNeeded: '',
    installationLocation: '',
    totalWellDepth: ''
  });
  
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const calculationResult = calculatePump(formData);
      setResult(calculationResult);
      setIsModalOpen(true);
      
      // Salvar no banco de dados
      
    } catch (error) {
      console.error('Erro no cálculo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Dimensionamento de Bombas</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos do formulário (mesmo do anterior) */}
      </form>

      <CalculationResultModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={result}
        type="pump"
        onSaveToHistory={() => router.push('/dashboard/history')}
        onNewCalculation={() => {
          setResult(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}