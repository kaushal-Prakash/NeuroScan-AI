"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function NotFound() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <button
          onClick={() => router.back()}
          href="/"
          className="inline-block px-6 py-2 text-white bg-gray-800 rounded-2xl shadow-md hover:bg-gray-700 transition-colors"
        >
          Go Home
        </button>
      </motion.div>
    </div>
  );
}

export default NotFound;
