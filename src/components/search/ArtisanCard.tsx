import { Artisan, User } from '@/generated/prisma';
import Link from 'next/link';

type ArtisanWithUser = Artisan & {
  user: Pick<User, 'email'>;
};

interface ArtisanCardProps {
  artisan: ArtisanWithUser;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {artisan.name}
          </h2>
          {artisan.commune && (
            <p className="text-gray-600 mt-1">
              {artisan.commune} {artisan.codePostal && `(${artisan.codePostal})`}
            </p>
          )}
        </div>
        <Link
          href={`/artisan/${artisan.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Voir le profil
        </Link>
      </div>

      {artisan.description && (
        <p className="mt-2 text-gray-600 line-clamp-2">
          {artisan.description}
        </p>
      )}

      {artisan.services.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Services proposés :</h3>
          <div className="flex flex-wrap gap-2">
            {artisan.services.map((service) => (
              <span
                key={service}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 