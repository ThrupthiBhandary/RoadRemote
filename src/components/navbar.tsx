'use client';

import Link from 'next/link';
import { Car, ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { UserNav } from './user-nav';
import { Button } from './ui/button';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname.startsWith('/dashboard');
  const isAuth = pathname.startsWith('/auth');
  const isHomePage = pathname === '/';

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b">
      <div className="flex items-center gap-4">
        {!isHomePage && (
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        )}
        <Link href="/" className="text-lg font-semibold hover:underline" prefetch={false}>
          Home
        </Link>
      </div>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        { !isDashboard && !isAuth && (
           <>
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                Features
            </Link>
            <Link href="#roles" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                Get Started
            </Link>
           </>
        )}
        {isDashboard && <UserNav />}
      </nav>
    </header>
  );
}
