'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../../components/ui/ProductCard';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/produtos');
        if (response.ok) {
          const productsData = await response.json();
          setProducts(productsData);
          
          // Extrair categorias únicas dos produtos
          const uniqueCategories = [...new Set(productsData
            .filter(product => product.category)
            .map(product => product.category)
          )];
          
          setCategories(uniqueCategories);
        } else {
          console.error('Erro ao carregar produtos');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Função para obter a primeira imagem da galeria
  const getProductImage = (product) => {
    if (product.gallery && product.gallery.length > 0) {
      return product.gallery[0];
    }
    return '/placeholder-image.jpg'; // Imagem padrão
  };

  // Função para formatar a categoria para exibição
  const formatCategoryName = (categorySlug) => {
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

    return categoryMap[categorySlug] || categorySlug;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-700">Marketplace</h2>
        
        <div className="mt-4 md:mt-0">
          <label htmlFor="category" className="sr-only">Categoria</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {formatCategoryName(category)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={{
                  ...product,
                  image: getProductImage(product),
                  category: formatCategoryName(product.category)
                }}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
          
          {/* Carrinho de Compras */}
          <div className="mt-12 border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Seu Carrinho ({cart.reduce((total, item) => total + item.quantity, 0)} itens)
            </h3>
            
            {cart.length === 0 ? (
              <p className="text-gray-500">Seu carrinho está vazio</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item._id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center">
                      <img 
                        src={getProductImage(item)} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div className="ml-4">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-green-600 font-medium">
                          {item.price?.toLocaleString('pt-MZ', { 
                            style: 'currency', 
                            currency: 'MZN' 
                          }) || 'N/A'}
                        </p>
                        {item.stock < item.quantity && (
                          <p className="text-red-500 text-sm">
                            Estoque insuficiente
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="text-gray-500 hover:text-green-600 p-1"
                        disabled={item.quantity <= 1}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="text-gray-500 hover:text-green-600 p-1"
                        disabled={item.quantity >= item.stock}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center pt-4">
                  <p className="text-lg font-medium">Total:</p>
                  <p className="text-xl font-bold text-green-600">
                    {cart
                      .reduce((total, item) => total + ((item.price || 0) * item.quantity), 0)
                      .toLocaleString('pt-MZ', { 
                        style: 'currency', 
                        currency: 'MZN' 
                      })
                    }
                  </p>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cart.some(item => item.quantity > item.stock)}
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}