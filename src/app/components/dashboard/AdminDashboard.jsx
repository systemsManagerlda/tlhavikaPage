"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Registra componentes do ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [uploadingImages, setUploadingImages] = useState(false);

  // Estado para o formulário de produto
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: "",
    gallery: [],
    technicalSpecs: "",
  });

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/check-admin");
        const data = await response.json();
        if (!data.isAdmin) {
          router.push("/dashboard/gestao");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/dashboard/gestao");
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch products
        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();
        setProducts(productsData.products);

        // Fetch stats
        const statsRes = await fetch("/api/products/stats");
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch recent activity
        const activityRes = await fetch("/api/products/activity");
        const activityData = await activityRes.json();
        setRecentActivity(activityData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
    fetchData();
  }, [router]);

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGalleryImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("gallery", file);
      });

      const response = await fetch("/api/upload/gallery", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setProductForm((prev) => ({
          ...prev,
          gallery: [...prev.gallery, ...result.urls],
        }));
      }
    } catch (error) {
      console.error("Error uploading gallery images:", error);
      alert("Erro ao fazer upload das imagens");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeGalleryImage = (index) => {
    setProductForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });

      const result = await response.json();

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === result.id ? result : p))
        );
      } else {
        setProducts((prev) => [...prev, result]);
      }

      // Atualiza estatísticas
      const statsRes = await fetch("/api/products/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      // Atualiza atividades recentes
      const activityRes = await fetch("/api/products/activity");
      const activityData = await activityRes.json();
      setRecentActivity(activityData);

      // Reseta o formulário
      setProductForm({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
        stock: "",
        gallery: [],
        technicalSpecs: "",
      });
      setEditingProduct(null);
      setShowProductForm(false);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    setIsLoading(true);
    try {
      await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((p) => p.id !== productId));

      // Atualiza estatísticas
      const statsRes = await fetch("/api/products/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      // Atualiza atividades recentes
      const activityRes = await fetch("/api/products/activity");
      const activityData = await activityRes.json();
      setRecentActivity(activityData);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      stock: product.stock || "",
      gallery: product.gallery || [],
      technicalSpecs: product.technicalSpecs || "",
    });
    setShowProductForm(true);
  };

  // Dados para os gráficos
  const salesChartData = {
    labels: stats.monthlySales?.map((item) => item.month) || [],
    datasets: [
      {
        label: "Vendas (MZN)",
        data: stats.monthlySales?.map((item) => item.total) || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const categoriesChartData = {
    labels: stats.productsByCategory?.map((item) => item.category) || [],
    datasets: [
      {
        data: stats.productsByCategory?.map((item) => item.count) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Painel de Administração
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`${
                activeTab === "dashboard"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`${
                activeTab === "products"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Produtos
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`${
                activeTab === "reports"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Relatórios
            </button>
          </nav>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Cards de Estatísticas */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Produtos Cadastrados
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stats.totalProducts || 0}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Vendas Mensais
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {(stats.monthlyRevenue || 0).toLocaleString(
                              "pt-BR",
                              { style: "currency", currency: "BRL" }
                            )}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Produtos em Estoque
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stats.inStockProducts || 0}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 12H4"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Produtos Esgotados
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stats.outOfStockProducts || 0}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gráfico de Vendas */}
                <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-2">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Vendas Mensais
                    </h3>
                    <div className="mt-4 h-64">
                      <Bar
                        data={salesChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Gráfico de Categorias */}
                <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-2">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Produtos por Categoria
                    </h3>
                    <div className="mt-4 h-64">
                      <Pie
                        data={categoriesChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Atividades Recentes */}
                <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-4">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Atividades Recentes
                    </h3>
                    <div className="mt-4 flow-root">
                      <ul className="-mb-8">
                        {recentActivity.map((activity, activityIdx) => (
                          <li key={activity.id}>
                            <div className="relative pb-8">
                              {activityIdx !== recentActivity.length - 1 ? (
                                <span
                                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span
                                    className={`${
                                      activity.type === "created"
                                        ? "bg-green-500"
                                        : activity.type === "updated"
                                        ? "bg-blue-500"
                                        : "bg-red-500"
                                    } h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}
                                  >
                                    {activity.type === "created" ? (
                                      <svg
                                        className="h-5 w-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                      </svg>
                                    ) : activity.type === "updated" ? (
                                      <svg
                                        className="h-5 w-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="h-5 w-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    )}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      {activity.type === "created"
                                        ? "Produto criado"
                                        : activity.type === "updated"
                                        ? "Produto atualizado"
                                        : "Produto removido"}{" "}
                                      <span className="font-medium text-gray-900">
                                        {activity.productName}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    <time dateTime={activity.date}>
                                      {new Date(activity.date).toLocaleString()}
                                    </time>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Gestão de Produtos
                  </h3>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: "",
                        price: "",
                        description: "",
                        image: "",
                        category: "",
                        stock: "",
                        gallery: [],
                        technicalSpecs: "",
                      });
                      setShowProductForm(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Adicionar Produto
                  </button>
                </div>

                {/* Formulário de Produto */}
                {showProductForm && (
                  <div className="border-b border-gray-200 px-4 py-5 sm:p-6">
                    <h4 className="text-lg font-medium mb-4">
                      {editingProduct
                        ? "Editar Produto"
                        : "Adicionar Novo Produto"}
                    </h4>
                    <form onSubmit={handleSubmitProduct}>
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        {/* Campos existentes permanecem iguais */}
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Nome do Produto
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={productForm.name}
                              onChange={handleProductFormChange}
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Preço
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                MZN
                              </span>
                            </div>
                            <input
                              type="number"
                              name="price"
                              id="price"
                              value={productForm.price}
                              onChange={handleProductFormChange}
                              step="0.01"
                              min="0"
                              className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Descrição
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="description"
                              name="description"
                              rows={3}
                              value={productForm.description}
                              onChange={handleProductFormChange}
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label
                            htmlFor="image"
                            className="block text-sm font-medium text-gray-700"
                          >
                            URL da Imagem Principal
                          </label>
                          <div className="mt-1">
                            <input
                              type="url"
                              name="image"
                              id="image"
                              value={productForm.image}
                              onChange={handleProductFormChange}
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              required
                            />
                          </div>
                          {productForm.image && (
                            <div className="mt-2">
                              <img
                                src={productForm.image}
                                alt="Preview"
                                className="h-20 w-20 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>

                        {/* Nova seção para Galeria de Imagens */}
                        <div className="sm:col-span-6">
                          <label className="block text-sm font-medium text-gray-700">
                            Galeria de Imagens
                          </label>
                          <div className="mt-1">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleGalleryImagesChange}
                              disabled={uploadingImages}
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          {uploadingImages && (
                            <div className="mt-2 text-sm text-gray-500">
                              Fazendo upload das imagens...
                            </div>
                          )}

                          {/* Preview da galeria */}
                          {productForm.gallery.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Imagens da Galeria:
                              </h4>
                              <div className="grid grid-cols-4 gap-2">
                                {productForm.gallery.map((imgUrl, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={imgUrl}
                                      alt={`Gallery ${index}`}
                                      className="h-20 w-20 object-cover rounded"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeGalleryImage(index)}
                                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Nova seção para Ficha Técnica */}
                        <div className="sm:col-span-6">
                          <label
                            htmlFor="technicalSpecs"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Ficha Técnica (JSON)
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="technicalSpecs"
                              name="technicalSpecs"
                              rows={6}
                              value={productForm.technicalSpecs}
                              onChange={handleProductFormChange}
                              placeholder='{"marca": "Exemplo", "potencia": "100W", "tensão": "12V"}'
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono text-sm"
                            />
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Insira os dados técnicos em formato JSON. Exemplo:{" "}
                            {"{"}"marca": "SolarX", "potencia": "100W",
                            "tensão": "12V"{"}"}
                          </p>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Categoria
                          </label>
                          <div className="mt-1">
                            <select
                              id="category"
                              name="category"
                              value={productForm.category}
                              onChange={handleProductFormChange}
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              required
                            >
                              <option value="">Selecione uma categoria</option>

                              <optgroup label="⚡ Energia Solar - Geração">
                                <option value="painel_fotovoltaico">
                                  Painéis Fotovoltaicos
                                </option>
                                <option value="painel_termico">
                                  Painéis Solares Térmicos
                                </option>
                                <option value="inversores">
                                  Inversores (On-grid, Off-grid, Híbrido)
                                </option>
                                <option value="microinversores">
                                  Microinversores
                                </option>
                                <option value="controladores">
                                  Controladores de Carga (PWM / MPPT)
                                </option>
                                <option value="kits_solares">
                                  Kits de Energia Solar Completo
                                </option>
                              </optgroup>

                              <optgroup label="🔋 Armazenamento e Backup">
                                <option value="baterias_litio">
                                  Baterias Lítio (LiFePO4, Íon-lítio)
                                </option>
                                <option value="baterias_gel">
                                  Baterias Gel / AGM / Chumbo-ácido
                                </option>
                                <option value="banco_baterias">
                                  Banco de Baterias
                                </option>
                                <option value="ups">
                                  UPS / No-Break Solares
                                </option>
                                <option value="geradores_hibridos">
                                  Geradores Solares Híbridos
                                </option>
                              </optgroup>

                              <optgroup label="💧 Bombas e Irrigação Solar">
                                <option value="bomba_submersivel">
                                  Bombas Submersíveis
                                </option>
                                <option value="bomba_superficie">
                                  Bombas de Superfície
                                </option>
                                <option value="bomba_centrifuga">
                                  Bombas Centrífugas
                                </option>
                                <option value="bomba_diafragma">
                                  Bombas de Diafragma
                                </option>
                                <option value="controladores_bomba">
                                  Controladores de Bombas
                                </option>
                                <option value="kits_bombeamento">
                                  Kits Solares de Bombeamento
                                </option>
                                <option value="irrigacao_gotejamento">
                                  Sistemas de Irrigação por Gotejamento
                                </option>
                                <option value="irrigacao_aspersao">
                                  Sistemas de Irrigação por Aspersão
                                </option>
                                <option value="reservatorios">
                                  Reservatórios / Cisternas
                                </option>
                                <option value="filtros">Filtros de Água</option>
                              </optgroup>

                              <optgroup label="🔌 Acessórios Elétricos e Estruturas">
                                <option value="estruturas_montagem">
                                  Estruturas de Montagem
                                </option>
                                <option value="trackers">
                                  Trackers Solares (Seguidor Solar)
                                </option>
                                <option value="cabos_solares">
                                  Cabos Solares
                                </option>
                                <option value="conectores_mc4">
                                  Conectores MC4
                                </option>
                                <option value="disjuntores">
                                  Disjuntores / Fusíveis
                                </option>
                                <option value="string_box">
                                  Quadros Elétricos (String Box)
                                </option>
                                <option value="caixa_controle">
                                  Caixas de Controle
                                </option>
                                <option value="protecao_surtos">
                                  Dispositivos de Proteção contra Surtos (DPS)
                                </option>
                              </optgroup>

                              <optgroup label="📡 Monitoramento e Automação">
                                <option value="monitoramento_iot">
                                  Sistemas de Monitoramento IoT
                                </option>
                                <option value="softwares">
                                  Softwares de Gestão de Energia
                                </option>
                                <option value="sensores">
                                  Sensores (Nível de Água, Irradiação,
                                  Temperatura)
                                </option>
                                <option value="medidores">
                                  Medidores Bidirecionais
                                </option>
                                <option value="controladores_remotos">
                                  Controladores Remotos
                                </option>
                              </optgroup>

                              <optgroup label="🌍 Sustentabilidade e Acessórios Verdes">
                                <option value="iluminacao_solar">
                                  Iluminação Solar (Lampadas, Postes, Holofotes)
                                </option>
                                <option value="carregadores_solares">
                                  Carregadores Solares Portáteis
                                </option>
                                <option value="kits_emergencia">
                                  Kits de Energia para Emergência
                                </option>
                                <option value="geladeiras_solares">
                                  Geladeiras / Freezers Solares
                                </option>
                                <option value="bombas_calor">
                                  Bombas de Calor
                                </option>
                                <option value="aquecedores_solares">
                                  Aquecedores de Água Solares
                                </option>
                              </optgroup>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="stock"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Estoque
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="stock"
                              id="stock"
                              value={productForm.stock}
                              onChange={handleProductFormChange}
                              min="0"
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                          }}
                          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          {editingProduct
                            ? "Atualizar Produto"
                            : "Adicionar Produto"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Lista de Produtos */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Imagem
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Nome
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Categoria
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Preço
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Estoque
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Galeria
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 object-cover rounded"
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
                            <div className="text-sm text-gray-900 capitalize">
                              {product.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.price.toLocaleString("pt-MZ", {
                                style: "currency",
                                currency: "MZN",
                              })}
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
                              {product.gallery ? product.gallery.length : 0}{" "}
                              imagens
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
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Relatório de Vendas
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Visão geral das vendas por período e categoria.
                    </p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="h-96">
                      <Bar
                        data={salesChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top",
                            },
                            title: {
                              display: true,
                              text: "Vendas Mensais (MZN)",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

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
                      <Pie
                        data={categoriesChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                            },
                            title: {
                              display: true,
                              text: "Produtos por Categoria",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

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
                          {stats.inStockProducts || 0}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="text-lg font-medium text-yellow-800">
                          Produtos com Estoque Baixo
                        </h4>
                        <p className="text-2xl font-bold text-yellow-600 mt-2">
                          {stats.lowStockProducts || 0}
                        </p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="text-lg font-medium text-red-800">
                          Produtos Esgotados
                        </h4>
                        <p className="text-2xl font-bold text-red-600 mt-2">
                          {stats.outOfStockProducts || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
