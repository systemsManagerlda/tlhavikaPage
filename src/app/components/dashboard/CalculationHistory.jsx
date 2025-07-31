"use client"
import React, { useEffect, useState } from 'react';

export default function CalculationHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Carregar histórico do localStorage (ou poderia vir do banco de dados)
    const stored = localStorage.getItem('calcHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const handleDelete = (index) => {
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
    localStorage.setItem('calcHistory', JSON.stringify(updated));
  };

  const handleEdit = (index) => {
    alert(`Função de edição para item #${index} ainda não implementada.`);
    // Aqui você poderia redirecionar para o formulário com os dados preenchidos.
  };

  if (history.length === 0) {
    return (
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Histórico de Cálculos</h2>
        <p>Nenhum cálculo encontrado.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow-md overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Histórico de Cálculos</h2>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Data</th>
            <th className="border px-3 py-2">Tipo</th>
            <th className="border px-3 py-2">Nome</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Água Necessária</th>
            <th className="border px-3 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{item.date}</td>
              <td className="border px-3 py-2">{item.type}</td>
              <td className="border px-3 py-2">{item.name}</td>
              <td className="border px-3 py-2">{item.email}</td>
              <td className="border px-3 py-2">{item.waterNeeded} L</td>
              <td className="border px-3 py-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:underline"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
