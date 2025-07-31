"use client"
import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const priceData = [
  {
    category: 'Painel Solar',
    code: 'PS-100',
    title: 'Painel Solar 100W',
    price: 3000,
  },
  {
    category: 'Bomba Solar',
    code: 'BS-2000',
    title: 'Bomba Solar XT-2000',
    price: 15000,
  },
  {
    category: 'Inversor',
    code: 'INV-3K',
    title: 'Inversor Solar 3000W',
    price: 12000,
  },
  // ... outros produtos
];

export default function PriceList() {
  const [data] = useState(priceData);

  const exportToExcel = () => {
    const worksheetData = data.map(item => ({
      Categoria: item.category,
      Código: item.code,
      Título: item.title,
      'Preço (sem IVA)': item.price.toFixed(2) + ' MZN',
      'Preço (com IVA 16%)': (item.price * 1.16).toFixed(2) + ' MZN',
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabela de Preços');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'lista-de-precos.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Tabela de Preços', 14, 15);
    const tableColumn = ['Categoria', 'Código', 'Título', 'Preço (sem IVA)', 'Preço (com IVA 16%)'];
    const tableRows = [];

    data.forEach(item => {
      const rowData = [
        item.category,
        item.code,
        item.title,
        item.price.toFixed(2) + ' MZN',
        (item.price * 1.16).toFixed(2) + ' MZN',
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10 },
    });

    doc.save('lista-de-precos.pdf');
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Lista de Preços</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-green-300 text-sm text-gray-950">
          <thead className="bg-green-100">
            <tr>
              <th className="border px-4 py-2 text-left">Categoria</th>
              <th className="border px-4 py-2 text-left">Código</th>
              <th className="border px-4 py-2 text-left">Título</th>
              <th className="border px-4 py-2 text-left">Preço (sem IVA)</th>
              <th className="border px-4 py-2 text-left">Preço (com IVA 16%)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-green-50">
                <td className="border px-4 py-2">{item.category}</td>
                <td className="border px-4 py-2">{item.code}</td>
                <td className="border px-4 py-2">{item.title}</td>
                <td className="border px-4 py-2">{item.price.toFixed(2)} MZN</td>
                <td className="border px-4 py-2">{(item.price * 1.16).toFixed(2)} MZN</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Baixar em Excel
        </button>
        <button
          onClick={exportToPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Baixar em PDF
        </button>
      </div>
    </div>
  );
}
