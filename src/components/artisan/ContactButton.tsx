'use client';

export function ContactButton() {
  return (
    <button
      className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      onClick={() => {
        // À implémenter dans le MVP 3
        alert("Cette fonctionnalité sera disponible prochainement");
      }}
    >
      Contacter l'artisan
    </button>
  );
} 