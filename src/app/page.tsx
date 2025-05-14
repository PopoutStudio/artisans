import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center mb-8">
          Bienvenue sur Artisans
        </h1>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/auth/register"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          S'inscrire
        </Link>
        <Link
          href="/auth/login"
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}
