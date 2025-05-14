'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const SERVICES = [
  'Plomberie',
  'Électricité',
  'Maçonnerie',
  'Peinture',
  'Menuiserie',
  'Jardinage',
  'Carrelage',
  'Chauffage',
  'Toiture',
  'Isolation',
];

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const service = formData.get('service') as string;
    const commune = formData.get('commune') as string;

    const params = new URLSearchParams();
    if (service) params.set('service', service);
    if (commune) params.set('commune', commune);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700">
          Service
        </label>
        <select
          name="service"
          id="service"
          defaultValue={searchParams.get('service') || ''}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="">Tous les services</option>
          {SERVICES.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="commune" className="block text-sm font-medium text-gray-700">
          Commune
        </label>
        <input
          type="text"
          name="commune"
          id="commune"
          defaultValue={searchParams.get('commune') || ''}
          placeholder="Entrez une commune"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Rechercher
      </button>
    </form>
  );
} 