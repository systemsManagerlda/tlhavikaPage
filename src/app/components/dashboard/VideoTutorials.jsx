'use client';

import { useState } from 'react';
import { FiPlay, FiX, FiFilter, FiSearch } from 'react-icons/fi';

const tutorialsData = [
  {
    id: 1,
    title: 'Instalação Completa de Painéis Solares',
    description: 'Aprenda o passo a passo para instalar painéis solares residenciais',
    category: 'painel_solar',
    level: 'iniciante',
    duration: '12:35',
    thumbnail: '/images/fundo.jpg',
    videoUrl: 'https://youtu.be/8m32IU8eO4Q',
    views: 1245,
    date: '2023-05-15'
  },
  {
    id: 2,
    title: 'Dimensionamento de Bombas Solares',
    description: 'Como calcular a bomba solar ideal para seu projeto',
    category: 'bomba_solar',
    level: 'intermediario',
    duration: '18:20',
    thumbnail: '/images/fundo.jpg',
    videoUrl: 'https://youtu.be/8m32IU8eO4Q',
    views: 892,
    date: '2023-04-10'
  },
  {
    id: 3,
    title: 'Configuração de Inversores Grid-Tie',
    description: 'Tutorial completo de configuração e sincronização com a rede elétrica',
    category: 'inversor',
    level: 'avancado',
    duration: '15:45',
    thumbnail: '/images/fundo.jpg',
    videoUrl: 'https://youtu.be/8m32IU8eO4Q',
    views: 1567,
    date: '2023-06-22'
  },
  {
    id: 4,
    title: 'Manutenção Preventiva em Sistemas Fotovoltaicos',
    description: 'Como manter seu sistema solar funcionando com máxima eficiência',
    category: 'manutencao',
    level: 'intermediario',
    duration: '14:10',
    thumbnail: '/images/fundo.jpg',
    videoUrl: 'https://youtu.be/8m32IU8eO4Q',
    views: 732,
    date: '2023-07-05'
  },
  {
    id: 5,
    title: 'Instalação de Sistemas Híbridos',
    description: 'Combine energia solar com outras fontes renováveis',
    category: 'sistema_hibrido',
    level: 'avancado',
    duration: '22:30',
    thumbnail: '/images/fundo.jpg',
    videoUrl: 'https://youtu.be/8m32IU8eO4Q',
    views: 543,
    date: '2023-08-12'
  },
  {
    id: 6,
    title: 'Introdução à Energia Solar Residencial',
    description: 'Conceitos básicos para quem está começando',
    category: 'introducao',
    level: 'iniciante',
    duration: '08:15',
    thumbnail: '/images/fundo.jpg',
    videoUrl: 'https://youtu.be/8m32IU8eO4Q',
    views: 2310,
    date: '2023-03-18'
  }
];

export default function VideoTutorials() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedLevel, setSelectedLevel] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['todos', ...new Set(tutorialsData.map(t => t.category))];
  const levels = ['todos', 'iniciante', 'intermediario', 'avancado'];

  const filteredTutorials = tutorialsData.filter(tutorial => {
    const matchesCategory = selectedCategory === 'todos' || tutorial.category === selectedCategory;
    const matchesLevel = selectedLevel === 'todos' || tutorial.level === selectedLevel;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const resetFilters = () => {
    setSelectedCategory('todos');
    setSelectedLevel('todos');
    setSearchTerm('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Cabeçalho e Filtros */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-green-700">Biblioteca de Vídeos</h2>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar tutoriais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-green placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-green-600 hover:text-green-800"
          >
            <FiFilter className="mr-1" /> {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
          
          {(selectedCategory !== 'todos' || selectedLevel !== 'todos') && (
            <button
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'todos' ? 'Todas Categorias' : category.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'todos' ? 'Todos Níveis' : 
                     level === 'iniciante' ? 'Iniciante' :
                     level === 'intermediario' ? 'Intermediário' : 'Avançado'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Player de Vídeo */}
      {selectedVideo && (
        <div className="mb-8 bg-black rounded-lg overflow-hidden">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={selectedVideo.videoUrl}
              className="w-full h-[500px]"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={selectedVideo.title}
            ></iframe>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold text-white">{selectedVideo.title}</h3>
            <div className="flex items-center text-gray-300 text-sm mt-2">
              <span>{selectedVideo.views} visualizações</span>
              <span className="mx-2">•</span>
              <span>{selectedVideo.date}</span>
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
              className="mt-4 flex items-center text-white hover:text-green-400"
            >
              <FiX className="mr-1" /> Fechar vídeo
            </button>
          </div>
        </div>
      )}

      {/* Lista de Vídeos */}
      {filteredTutorials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum tutorial encontrado com os filtros selecionados.</p>
          <button
            onClick={resetFilters}
            className="mt-4 text-green-600 hover:text-green-800"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map(tutorial => (
            <div 
              key={tutorial.id} 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedVideo(tutorial)}
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                <img 
                  src={tutorial.thumbnail} 
                  alt={tutorial.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-green-600 text-white rounded-full p-3">
                    <FiPlay className="h-6 w-6" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {tutorial.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{tutorial.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                    {tutorial.level === 'iniciante' ? 'Iniciante' : 
                     tutorial.level === 'intermediario' ? 'Intermediário' : 'Avançado'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{tutorial.description}</p>
                <div className="flex items-center text-xs text-gray-400 mt-3">
                  <span>{tutorial.views} visualizações</span>
                  <span className="mx-2">•</span>
                  <span>{tutorial.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}