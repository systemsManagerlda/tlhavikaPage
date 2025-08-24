"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "./AdminHeader";
import AdminTabs from "./AdminTabs";
import DashboardTab from "../tabs/DashboardTab";
import ProductsTab from "../tabs/ProductsTab";
import ReportsTab from "../tabs/ReportsTab";
import { ChartJSRegister } from "../../../../utils/chartjsConfig";

// Registra componentes do ChartJS
ChartJSRegister();

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeTab, setActiveTab] = useState("products");

  // Função para carregar produtos
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/produtos");
      if (response.ok) {
        const productsData = await response.json();
        setProducts(productsData);
      } else {
        console.error("Erro ao carregar produtos");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Função para carregar estatísticas (se necessário)
  const fetchStats = async () => {
    try {
      // Se você tiver um endpoint para estatísticas, use:
      // const response = await fetch("/api/produtos/stats");
      // Caso contrário, calcule as estatísticas localmente
      const totalProducts = products.length;
      const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
      const totalValue = products.reduce((sum, product) => sum + (product.price || 0) * (product.stock || 0), 0);
      
      setStats({
        totalProducts,
        totalStock,
        totalValue,
        averagePrice: totalProducts > 0 ? totalValue / totalStock : 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Função para carregar atividades recentes
  const fetchRecentActivity = async () => {
    try {
      // Se você tiver um endpoint para atividades, use:
      // const response = await fetch("/api/produtos/activity");
      // Caso contrário, use os produtos mais recentes
      const recentProducts = products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(product => ({
          id: product._id,
          type: 'product_added',
          name: product.name,
          timestamp: product.createdAt,
          description: `Produto ${product.name} adicionado`
        }));
      
      setRecentActivity(recentProducts);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  };

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

    checkAdmin();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Primeiro carrega os produtos
        await fetchProducts();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Atualiza stats e atividades quando os produtos mudam
  useEffect(() => {
    if (products.length > 0) {
      fetchStats();
      fetchRecentActivity();
    }
  }, [products]);

  const renderActiveTab = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            stats={stats}
            recentActivity={recentActivity}
            products={products}
          />
        );
      case "products":
        return (
          <ProductsTab
            products={products}
            setProducts={setProducts}
            stats={stats}
            setStats={setStats}
            recentActivity={recentActivity}
            setRecentActivity={setRecentActivity}
            fetchProducts={fetchProducts} // Passa a função para recarregar
          />
        );
      case "reports":
        return (
          <ReportsTab 
            stats={stats} 
            products={products}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderActiveTab()}
      </main>
    </div>
  );
}