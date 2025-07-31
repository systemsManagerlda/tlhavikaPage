import React from 'react';

const products = [
  {
    id: 1,
    name: 'Painel Solar 300W',
    description: 'Alta eficiência, ideal para sistemas off-grid e híbridos.',
    image: '/images/painel-solar.jpg',
  },
  {
    id: 2,
    name: 'Bomba Solar XT-2000',
    description: 'Ideal para furos profundos em zonas rurais.',
    image: '/images/bomba-solar.jpg',
  },
  {
    id: 3,
    name: 'Inversor Solar 3kW',
    description: 'Inversor híbrido compatível com baterias de lítio.',
    image: '/images/inversor.jpg',
  },
  {
    id: 4,
    name: 'Kit Solar Completo 2kW',
    description: 'Tudo que precisa para começar com energia solar.',
    image: '/images/kit-solar.jpg',
  },
];

export default function ProductShowcase() {
  return (
    <section className="py-14 px-4 md:px-8 bg-green-50 rounded-xl shadow-inner">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-green-800 text-center mb-12">
          Destaques em Energia Renovável
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-[1.02]"
            >
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-green-700">
                  {product.name}
                </h3>
                <p className="text-gray-600 mt-1 text-sm">
                  {product.description}
                </p>
                <button className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
