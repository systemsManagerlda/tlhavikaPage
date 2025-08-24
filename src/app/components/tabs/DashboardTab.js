import StatCard from "../dashboard/StatCard";
import SalesChart from "../charts/SalesChart";
import CategoriesChart from "../charts/CategoriesChart";
import RecentActivity from "../dashboard/RecentActivity";

export default function DashboardTab({ stats, recentActivity, products = [] }) {
  // Calcular estatísticas baseadas nos produtos se stats não tiver os dados
  const calculatedStats = {
    totalProducts: stats.totalProducts || products.length,
    totalStock: stats.totalStock || products.reduce((sum, p) => sum + (p.stock || 0), 0),
    totalValue: stats.totalValue || products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0),
    inStockProducts: stats.inStockProducts || products.filter(p => (p.stock || 0) > 0).length,
    outOfStockProducts: stats.outOfStockProducts || products.filter(p => (p.stock || 0) === 0).length,
    monthlyRevenue: stats.monthlyRevenue || 0,
    categories: stats.categories || calculateCategories(products)
  };

  // Função para calcular distribuição de categorias com fallback
  function calculateCategories(products = []) {
    const categoryCount = {};
    (products || []).forEach(product => {
      if (product && product.category) {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      }
    });
    return categoryCount;
  }

  const statCards = [
    // ... (o mesmo código dos statCards)
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Cards de Estatísticas */}
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}

      {/* Gráfico de Vendas */}
      <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-2">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Valor por Categoria</h3>
          <div className="mt-4 h-64">
            <SalesChart stats={calculatedStats} products={products} />
          </div>
        </div>
      </div>

      {/* Gráfico de Categorias */}
      <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-2">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Produtos por Categoria</h3>
          <div className="mt-4 h-64">
            <CategoriesChart stats={calculatedStats} products={products} />
          </div>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-4">
        <RecentActivity recentActivity={recentActivity} />
      </div>
    </div>
  );
}