export default function ProductList({
  products,
  setEditingProduct,
  setShowProductForm,
  setProducts,
  setStats,
  setRecentActivity
}) {
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const response = await fetch(`/api/produtos/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));

        // Atualiza estatísticas (se houver endpoint)
        try {
          const statsRes = await fetch("/api/produtos/stats");
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData);
          }
        } catch (statsError) {
          console.error("Erro ao buscar estatísticas:", statsError);
        }

        // Atualiza atividades recentes (se houver endpoint)
        try {
          const activityRes = await fetch("/api/produtos/activity");
          if (activityRes.ok) {
            const activityData = await activityRes.json();
            setRecentActivity(activityData);
          }
        } catch (activityError) {
          console.error("Erro ao buscar atividades:", activityError);
        }
      } else {
        const error = await response.json();
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto: " + (error.error || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Erro ao excluir produto. Verifique o console para mais detalhes.");
    }
  };

  // Função para obter a primeira imagem da galeria ou imagem padrão
  const getProductImage = (product) => {
    if (product.gallery && product.gallery.length > 0) {
      return product.gallery[0];
    }
    return "/placeholder-image.jpg"; // Imagem padrão
  };

  // Função para formatar a categoria
  const formatCategory = (category) => {
    if (!category) return "N/A";
    
    const categoryMap = {
      'painel_fotovoltaico': 'Painéis Fotovoltaicos',
      'painel_termico': 'Painéis Térmicos',
      'inversores': 'Inversores',
      'microinversores': 'Microinversores',
      'controladores': 'Controladores',
      'kits_solares': 'Kits Solares',
      'baterias_litio': 'Baterias Lítio',
      'baterias_gel': 'Baterias Gel',
      'banco_baterias': 'Banco de Baterias',
      'ups': 'UPS/No-Break',
      'geradores_hibridos': 'Geradores Híbridos',
      'bomba_submersivel': 'Bombas Submersíveis',
      'bomba_superficie': 'Bombas de Superfície',
      'bomba_centrifuga': 'Bombas Centrífugas',
      'bomba_diafragma': 'Bombas de Diafragma',
      'controladores_bomba': 'Controladores de Bombas',
      'kits_bombeamento': 'Kits de Bombeamento',
      'irrigacao_gotejamento': 'Irrigação por Gotejamento',
      'irrigacao_aspersao': 'Irrigação por Aspersão',
      'reservatorios': 'Reservatórios',
      'filtros': 'Filtros',
      'estruturas_montagem': 'Estruturas',
      'trackers': 'Trackers Solares',
      'cabos_solares': 'Cabos Solares',
      'conectores_mc4': 'Conectores MC4',
      'disjuntores': 'Disjuntores',
      'string_box': 'String Box',
      'caixa_controle': 'Caixas de Controle',
      'protecao_surtos': 'Proteção contra Surtos',
      'monitoramento_iot': 'Monitoramento IoT',
      'softwares': 'Softwares',
      'sensores': 'Sensores',
      'medidores': 'Medidores',
      'controladores_remotos': 'Controladores Remotos',
      'iluminacao_solar': 'Iluminação Solar',
      'carregadores_solares': 'Carregadores Solares',
      'kits_emergencia': 'Kits de Emergência',
      'geladeiras_solares': 'Geladeiras Solares',
      'bombas_calor': 'Bombas de Calor',
      'aquecedores_solares': 'Aquecedores Solares'
    };

    return categoryMap[category] || category;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagem
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoria
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estoque
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Galeria
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="h-10 w-10 object-cover rounded"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {product.name}
                </div>
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {product.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatCategory(product.category)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {product.price?.toLocaleString("pt-MZ", {
                    style: "currency",
                    currency: "MZN",
                  }) || "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock || 0}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">
                  {product.gallery ? product.gallery.length : 0} imagens
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum produto encontrado.
        </div>
      )}
    </div>
  );
}