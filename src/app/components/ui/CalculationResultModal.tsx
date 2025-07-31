'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface CalculationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
  type: 'pump' | 'solar' | string;
  onSaveToHistory: () => void;
  onNewCalculation: () => void;
}

export default function CalculationResultModal({
  isOpen,
  onClose,
  result,
  type,
  onSaveToHistory,
  onNewCalculation
}: CalculationResultModalProps) {
  if (!result) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        
        {/* Substituir Dialog.Overlay por uma div comum */}
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />

        <Dialog.Panel className="relative bg-white rounded-lg max-w-xl w-full mx-auto shadow-lg p-6 z-50">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold text-green-700">
              Resultado do Cálculo {type === 'pump' ? 'da Bomba' : ''}
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2 mb-6">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b py-1">
                <span className="capitalize text-gray-600">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-semibold text-gray-800">{String(value)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onNewCalculation}
              className="px-4 py-2 text-sm rounded-md bg-gray-950 hover:bg-gray-950"
            >
              Novo Cálculo
            </button>
            <button
              onClick={onSaveToHistory}
              className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              Ver Histórico
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
