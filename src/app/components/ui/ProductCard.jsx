import Image from 'next/image';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 relative">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-lg text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          
          <button
            onClick={onAddToCart}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}