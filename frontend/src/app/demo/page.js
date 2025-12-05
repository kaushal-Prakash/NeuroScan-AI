"use client";
import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Fullscreen,
  Download,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const Demo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percentage =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percentage);
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const rect = e.target.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  const enterFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Website Demo
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Watch a showcase of our platform&apos;s key features and user interface
            in action.
          </p>
        </motion.header>

        {/* Video Player */}
        <motion.div
          className="bg-white rounded-xl shadow-xl overflow-hidden mb-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full aspect-video bg-black"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720' fill='%23ddd'%3E%3Crect width='1280' height='720' fill='%23f5f5f5'/%3E%3Cpath d='M512 320L704 416L512 512V320Z' fill='%23999'/%3E%3C/svg%3E"
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
            >
              <source src="demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play overlay button */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center w-full h-full group"
              >
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm transition-all group-hover:scale-110">
                  <Play className="w-10 h-10 text-white fill-current" />
                </div>
              </button>
            )}

            {/* Video controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress bar */}
              <div
                className="h-1.5 w-full bg-white/30 rounded-full mb-3 cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={togglePlay}
                    className="text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause size={20} />
                    ) : (
                      <Play size={20} className="fill-current" />
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>

                  <div className="text-white text-sm">
                    {Math.floor((progress / 100) * 10)}:
                    {(Math.floor((progress / 100) * 60) % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={enterFullscreen}
                    className="text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Fullscreen size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video info */}
          <motion.div
            className="p-6"
            initial={{ opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Website Overview Demo
            </h2>
            <p className="text-slate-600 mb-4">
              This video demonstrates the key features and user interface of our
              platform. Watch to see how our solution can benefit your workflow.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                Dashboard
              </Badge>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 hover:bg-green-200"
              >
                Analytics
              </Badge>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 hover:bg-purple-200"
              >
                UI/UX
              </Badge>
            </div>
          </motion.div>
        </motion.div>

        {/* Features section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {/* Child 1 */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Modern Design</h3>
            <p className="text-slate-600 text-sm">
              Clean and intuitive interface designed for optimal user
              experience.
            </p>
          </motion.div>

          {/* Child 2 */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Powerful Features
            </h3>
            <p className="text-slate-600 text-sm">
              Comprehensive toolset that enhances productivity and workflow
              efficiency.
            </p>
          </motion.div>

          {/* Child 3 */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">User Focused</h3>
            <p className="text-slate-600 text-sm">
              Designed with the user in mind, prioritizing simplicity and
              functionality.
            </p>
          </motion.div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="text-center bg-white rounded-xl shadow-sm p-8 border border-slate-100"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-6">
            Explore our platform and discover how it can transform your workflow
            and productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Fixed Link usage */}
            <Link
              href="/get-started"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center transition-colors"
            >
              Get Started <ChevronRight size={18} className="ml-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Demo;
