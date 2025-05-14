import { ArtisanCard } from "@/components/search/ArtisanCard";
import { SearchForm } from "@/components/search/SearchForm";
import { prisma } from "@/lib/prisma";

interface SearchParams {
  service?: string;
  commune?: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const artisans = await prisma.artisan.findMany({
    where: {
      AND: [
        searchParams.service
          ? { services: { has: searchParams.service } }
          : {},
        searchParams.commune
          ? { commune: { contains: searchParams.commune, mode: 'insensitive' } }
          : {},
      ],
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Rechercher un artisan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <SearchForm />
          </div>
          
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 gap-6">
              {artisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
              {artisans.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Aucun artisan trouvé pour ces critères
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 