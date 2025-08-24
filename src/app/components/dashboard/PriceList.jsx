"use client"
import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function PriceList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/produtos');
        
        if (!response.ok) {
          throw new Error('Erro ao carregar produtos');
        }
        
        const products = await response.json();
        setData(products);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Função para gerar código do produto baseado no nome e categoria
  const generateProductCode = (product) => {
    if (product.code) return product.code;
    
    const categoryPrefix = product.category 
      ? product.category.substring(0, 3).toUpperCase() 
      : 'PRO';
    
    const namePrefix = product.name 
      ? product.name.substring(0, 3).toUpperCase().replace(/\s/g, '')
      : '000';
    
    return `${categoryPrefix}-${namePrefix}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  };

  // Função para formatar a categoria para exibição
  const formatCategory = (category) => {
    const categoryMap = {
      'painel_fotovoltaico': 'Painel Fotovoltaico',
      'painel_termico': 'Painel Térmico',
      'inversores': 'Inversor',
      'microinversores': 'Microinversor',
      'controladores': 'Controlador',
      'kits_solares': 'Kit Solar',
      'baterias_litio': 'Bateria Lítio',
      'baterias_gel': 'Bateria Gel',
      'banco_baterias': 'Banco de Baterias',
      'ups': 'UPS/No-Break',
      'geradores_hibridos': 'Gerador Híbrido',
      'bomba_submersivel': 'Bomba Submersível',
      'bomba_superficie': 'Bomba de Superfície',
      'bomba_centrifuga': 'Bomba Centrífuga',
      'bomba_diafragma': 'Bomba de Diafragma',
      'controladores_bomba': 'Controlador de Bomba',
      'kits_bombeamento': 'Kit de Bombeamento',
      'irrigacao_gotejamento': 'Irrigação por Gotejamento',
      'irrigacao_aspersao': 'Irrigação por Aspersão',
      'reservatorios': 'Reservatório',
      'filtros': 'Filtro',
      'estruturas_montagem': 'Estrutura de Montagem',
      'trackers': 'Tracker Solar',
      'cabos_solares': 'Cabo Solar',
      'conectores_mc4': 'Conector MC4',
      'disjuntores': 'Disjuntor',
      'string_box': 'String Box',
      'caixa_controle': 'Caixa de Controle',
      'protecao_surtos': 'Proteção contra Surtos',
      'monitoramento_iot': 'Monitoramento IoT',
      'softwares': 'Software',
      'sensores': 'Sensor',
      'medidores': 'Medidor',
      'controladores_remotos': 'Controlador Remoto',
      'iluminacao_solar': 'Iluminação Solar',
      'carregadores_solares': 'Carregador Solar',
      'kits_emergencia': 'Kit de Emergência',
      'geladeiras_solares': 'Geladeira Solar',
      'bombas_calor': 'Bomba de Calor',
      'aquecedores_solares': 'Aquecedor Solar'
    };

    return categoryMap[category] || category || 'Geral';
  };

  const exportToExcel = () => {
    const worksheetData = data.map(item => ({
      Categoria: formatCategory(item.category),
      Código: generateProductCode(item),
      Título: item.name,
      Descrição: item.description || '',
      'Preço Unitário (MZN)': item.price ? Number(item.price).toFixed(2) : '0.00',
      'Preço com IVA 16% (MZN)': item.price ? (Number(item.price) * 1.16).toFixed(2) : '0.00',
      Estoque: item.stock || 0,
      'Ficha Técnica': item.technicalSpecs ? JSON.stringify(item.technicalSpecs) : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabela de Preços');
    
    // Ajustar largura das colunas
    const colWidths = [
      { wch: 20 }, // Categoria
      { wch: 15 }, // Código
      { wch: 30 }, // Título
      { wch: 40 }, // Descrição
      { wch: 20 }, // Preço Unitário
      { wch: 20 }, // Preço com IVA
      { wch: 10 }, // Estoque
      { wch: 50 }  // Ficha Técnica
    ];
    worksheet['!cols'] = colWidths;

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'lista-de-precos-produtos.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('TABELA DE PREÇOS - PRODUTOS', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Data de emissão: ${new Date().toLocaleDateString('pt-MZ')}`, 105, 22, { align: 'center' });
    
    const tableColumn = [
      'Categoria', 
      'Código', 
      'Título', 
      'Preço (MZN)', 
      'Preço c/ IVA (MZN)',
      'Estoque'
    ];
    
    const tableRows = [];

    data.forEach(item => {
      const rowData = [
        formatCategory(item.category),
        generateProductCode(item),
        item.name.substring(0, 30) + (item.name.length > 30 ? '...' : ''),
        item.price ? Number(item.price).toFixed(2) : '0.00',
        item.price ? (Number(item.price) * 1.16).toFixed(2) : '0.00',
        item.stock || 0
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      styles: { 
        fontSize: 8,
        cellPadding: 1
      },
      headStyles: {
        fillColor: [34, 139, 34], // Verde
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 255, 240] // Verde claro
      },
      margin: { top: 30 }
    });

    // Adicionar número de páginas
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save('lista-de-precos-produtos.pdf');
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Lista de Preços</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Lista de Preços</h1>
        <div className="text-red-500 p-4 bg-red-50 rounded">
          Erro: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Preços</h1>
        <div className="text-sm text-gray-500">
          {data.length} produtos encontrados
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Nenhum produto cadastrado
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full border border-green-300 text-sm text-gray-950">
                <thead className="bg-green-100 sticky top-0">
                  <tr>
                    <th className="border px-4 py-2 text-left">Categoria</th>
                    <th className="border px-4 py-2 text-left">Código</th>
                    <th className="border px-4 py-2 text-left">Título</th>
                    <th className="border px-4 py-2 text-left">Preço (sem IVA)</th>
                    <th className="border px-4 py-2 text-left">Preço (com IVA 16%)</th>
                    <th className="border px-4 py-2 text-left">Estoque</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item._id || index} className="hover:bg-green-50">
                      <td className="border px-4 py-2">{formatCategory(item.category)}</td>
                      <td className="border px-4 py-2 font-mono">{generateProductCode(item)}</td>
                      <td className="border px-4 py-2">{item.name}</td>
                      <td className="border px-4 py-2 text-right">
                        {item.price ? Number(item.price).toFixed(2) : '0.00'} MZN
                      </td>
                      <td className="border px-4 py-2 text-right">
                        {item.price ? (Number(item.price) * 1.16).toFixed(2) : '0.00'} MZN
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          (item.stock || 0) > 5 
                            ? 'bg-green-100 text-green-800' 
                            : (item.stock || 0) > 0 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {item.stock || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Baixar Excel
            </button>
            {/* <button
              onClick={exportToPDF}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Baixar PDF
            </button> */}
          </div>
        </>
      )}
    </div>
  );
}