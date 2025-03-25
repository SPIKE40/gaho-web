"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SoundAIPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/soundai/p1-vocalize');
  }, [router]);

  return null;
}
