import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>EduSync - Education Management System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold text-blue-600">EduSync</h1>
        <p className="mt-3 text-2xl">Education Management System</p>
        <div className="mt-6 animate-pulse">Redirecting to dashboard...</div>
      </main>
    </div>
  );
}