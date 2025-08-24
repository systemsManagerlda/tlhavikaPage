import { useState } from "react";
import ProductManagement from "../dashboard/ProductManagement";
import ProductList from "../dashboard/ProductList";

export default function ProductsTab({
  products,
  setProducts,
  stats,
  setStats,
  recentActivity,
  setRecentActivity,
  fetchProducts // ← Nova prop
}) {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
   const handleProductSaved = () => {
    fetchProducts(); // Recarrega a lista de produtos
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Gestão de Produtos
        </h3>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowProductForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Adicionar Produto
        </button>
      </div>

      {/* Formulário de Produto */}
      {showProductForm && (
        <ProductManagement
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          setShowProductForm={setShowProductForm}
          products={products}
          setProducts={setProducts}
          setStats={setStats}
          setRecentActivity={setRecentActivity}
        />
      )}

      {/* Lista de Produtos */}
      <ProductList
        products={products}
        setEditingProduct={setEditingProduct}
        setShowProductForm={setShowProductForm}
        setProducts={setProducts}
        setStats={setStats}
        setRecentActivity={setRecentActivity}
      />
    </div>
  );
}