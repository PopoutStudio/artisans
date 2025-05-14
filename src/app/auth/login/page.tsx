import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Connexion
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              créer un compte
            </Link>
          </p>
        </div>

        <AuthForm type="login" />
      </div>
    </div>
  );
} 