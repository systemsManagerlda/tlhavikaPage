"use client";
import { useState, useEffect } from "react";
import SalesChart from "../charts/SalesChart";
import CategoriesChart from "../charts/CategoriesChart";

export default function ReportsTab({ stats = {}, products = [] }) {
  // Calcular estatísticas baseadas nos produtos
  const calculatedStats = {
    totalProducts: stats.totalProducts || products.length,
    totalStock: stats.totalStock || products.reduce((sum, p) => sum + (p.stock || 0), 0),
    totalValue: stats.totalValue || products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0),
    inStockProducts: stats.inStockProducts || products.filter(p => (p.stock || 0) > 0).length,
    outOfStockProducts: stats.outOfStockProducts || products.filter(p => (p.stock || 0) === 0).length,
    lowStockProducts: stats.lowStockProducts || products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length,
    categories: stats.categories || calculateCategories(products)
  };

  // Função para calcular distribuição de categorias
  function calculateCategories(products = []) {
    const categoryCount = {};
    products.forEach(product => {
      if (product && product.category) {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      }
    });
    return categoryCount;
  }

  return (
    <div className="space-y-6">
      {/* Resumo Estatístico */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Resumo Estatístico
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Visão geral do inventário e valor em estoque.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-blue-800">
                Total de Produtos
              </h4>
              <p className="text-sm font-bold text-blue-600 mt-2">
                {calculatedStats.totalProducts}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-green-800">
                Valor Total em Estoque
              </h4>
              <p className="text-sm font-bold text-green-600 mt-2">
                {calculatedStats.totalValue.toLocaleString("pt-MZ", {
                  style: "currency",
                  currency: "MZN"
                })}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-purple-800">
                Unidades em Estoque
              </h4>
              <p className="text-sm font-bold text-purple-600 mt-2">
                {calculatedStats.totalStock}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-800">
                Categorias
              </h4>
              <p className="text-sm font-bold text-gray-600 mt-2">
                {Object.keys(calculatedStats.categories).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Valor por Categoria */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Valor por Categoria
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Distribuição do valor total em estoque por categoria.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="h-96">
            <SalesChart stats={calculatedStats} products={products} />
          </div>
        </div>
      </div>

      {/* Gráfico de Distribuição por Categoria */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Distribuição por Categoria
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Proporção de produtos por categoria.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="h-96">
            <CategoriesChart stats={calculatedStats} products={products} />
          </div>
        </div>
      </div>

      {/* Relatório de Estoque */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Relatório de Estoque
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Status atual do estoque de produtos.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-green-800">
                Produtos em Estoque
              </h4>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {calculatedStats.inStockProducts}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {calculatedStats.totalProducts > 0 
                  ? `${Math.round((calculatedStats.inStockProducts / calculatedStats.totalProducts) * 100)}% do total`
                  : '0%'
                }
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-yellow-800">
                Estoque Baixo (≤ 5 unidades)
              </h4>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {calculatedStats.lowStockProducts}
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                {calculatedStats.inStockProducts > 0 
                  ? `${Math.round((calculatedStats.lowStockProducts / calculatedStats.inStockProducts) * 100)}% do estoque`
                  : '0%'
                }
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-red-800">
                Produtos Esgotados
              </h4>
              <p className="text-2xl font-bold text-red-600 mt-2">
                {calculatedStats.outOfStockProducts}
              </p>
              <p className="text-sm text-red-600 mt-1">
                {calculatedStats.totalProducts > 0 
                  ? `${Math.round((calculatedStats.outOfStockProducts / calculatedStats.totalProducts) * 100)}% do total`
                  : '0%'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Produtos com Estoque Baixo */}
      {calculatedStats.lowStockProducts > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Produtos com Estoque Baixo
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Produtos que necessitam de reposição urgente.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque Atual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Unitário
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products
                    .filter(product => (product.stock || 0) > 0 && (product.stock || 0) <= 5)
                    .map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">
                            {product.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.price?.toLocaleString("pt-MZ", {
                              style: "currency",
                              currency: "MZN"
                            }) || "N/A"}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}