import VideoTutorials from '../../components/dashboard/VideoTutorials';
import { getSession } from '../../lib/auth';

export const metadata = {
  title: 'Tutoriais - Energia Renovável',
  description: 'Vídeos explicativos sobre instalação e manutenção de sistemas de energia renovável',
};

export default async function TutorialsPage() {
  await getSession(); // Protege a rota

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tutoriais em Vídeo</h1>
        <p className="text-lg text-gray-600 mb-8">
          Aprenda com nossos especialistas através de vídeos explicativos sobre instalação, manutenção
          e otimização de sistemas de energia renovável.
        </p>
        <VideoTutorials />
      </div>
    </div>
  );
}