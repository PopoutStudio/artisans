import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Trouvez l'artisan qu'il vous faut
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Des artisans qualifiés près de chez vous pour tous vos projets
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Rechercher un artisan
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Devenir artisan
          </Link>
        </div>
      </div>
    </div>
  );
}
