import { Bar } from 'react-chartjs-2';

export default function SalesChart({ stats, products = [] }) {
  // Se não tiver dados de vendas, mostre o valor por categoria
  const categories = (products || []).reduce((acc, product) => {
    if (product && product.category && product.price && product.stock) {
      const category = product.category;
      acc[category] = (acc[category] || 0) + (product.price * product.stock);
    }
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Valor em Estoque por Categoria (MZN)',
        data: Object.values(categories),
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('pt-MZ', {
              style: 'currency',
              currency: 'MZN'
            });
          }
        }
      },
    },
  };

  // Se não houver dados, mostrar mensagem
  if (Object.keys(categories).length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Nenhum dado disponível
      </div>
    );
  }

  return <Bar data={data} options={options} />;
}