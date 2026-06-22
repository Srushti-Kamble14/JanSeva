"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleSuccess() {

  const router = useRouter();

  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const accessToken =
      params.get("accessToken");

    if (accessToken) {

      localStorage.setItem(
        "accessToken",
        accessToken
      );

      router.push("/dashboard");
    }

  }, []);

   return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white animate-pulse">
          Signing In...
        </h1>

        <p className="mt-4 text-gray-400">
          Redirecting to your dashboard
        </p>

        <div className="mt-6 flex justify-center">
          <div className="h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}