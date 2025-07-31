import { NextResponse } from 'next/server';

// Dados simulados - na prática, você conectaria ao WooCommerce
const mockProducts = [
  {
    id: 1,
    name: 'Painel Solar 300W Monocristalino',
    description: 'Painel solar de alta eficiência para sistemas fotovoltaicos',
    price: 1200,
    image: '/images/painel-solar.jpg',
    category: 'painel_solar',
    stock: 15
  },
  {
    id: 2,
    name: 'Bomba Solar Submersa 2HP',
    description: 'Bomba solar para poços profundos com controlador integrado',
    price: 2500,
    image: '/images/bomba-solar.jpg',
    category: 'bomba_solar',
    stock: 8
  },
  {
    id: 3,
    name: 'Inversor Grid-Tie 3kW',
    description: 'Inversor para conexão à rede elétrica com monitoramento',
    price: 4500,
    image: '/images/inversor.jpg',
    category: 'inversor',
    stock: 5
  },
  // Adicione mais produtos conforme necessário
];

const mockCategories = [
  { slug: 'painel_solar', name: 'Painéis Solares' },
  { slug: 'bomba_solar', name: 'Bombas Solares' },
  { slug: 'inversor', name: 'Inversores' },
  { slug: 'controlador', name: 'Controladores' },
  { slug: 'acessorio', name: 'Acessórios' },
];

export async function GET() {
  try {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({
      products: mockProducts,
      categories: mockCategories
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}