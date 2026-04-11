"use client";

import SearchBar from "@/components/SearchBar";
import ReviewGrid from "@/components/ReviewGrid";
import GenreDropdown from "@/components/GenreDropdown";
import HeroSlider from "@/components/HeroSlider";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function HomePageContent() {
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString() || "home";

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />

      <Suspense fallback={<div className="min-h-[400px] flex justify-center items-center"><div className="w-8 h-8 rounded-full border-4 border-white/10 dark:border-white/10 border-t-[var(--color-brand)] dark:border-t-[var(--color-brand)] animate-spin"></div></div>}>
        <ReviewGrid />
      </Suspense>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}
