"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import VideoCard from "@/components/VideoCard";
import type { Video } from "@prisma/client";
import { filesize } from "filesize";
import { Video as VideoIcon, Upload, Sparkles, TrendingDown } from "lucide-react";

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Video[]>("/api/videos");
      setVideos(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setError("Failed to load videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDownload = async (url: string, title: string) => {
    try {
      // Use fetch to download the video as a blob to preserve the name
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title.replace(/\s+/g, "_").toLowerCase()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Direct download failed, falling back to new tab:", error);
      // Fallback: Open in a new tab if fetch fails (CORS or network issue)
      window.open(url, "_blank");
    }
  };

  // Calculations for stats
  const totalOriginalSize = videos.reduce((acc, video) => acc + Number(video.originalSize), 0);
  const totalCompressedSize = videos.reduce((acc, video) => acc + Number(video.compressedSize), 0);
  const totalSavingsBytes = totalOriginalSize - totalCompressedSize;
  const averageCompression = totalOriginalSize > 0 
    ? Math.round((totalSavingsBytes / totalOriginalSize) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-slate-500 dark:text-zinc-400 font-medium">Retrieving your optimized media...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-2xl mx-auto shadow-lg mt-8">
        <div>
          <span className="font-semibold">Error:</span> {error}
        </div>
        <button className="btn btn-sm btn-ghost" onClick={fetchVideos}>Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Stats Section */}
      {videos.length > 0 && (
        <div className="stats stats-vertical lg:stats-horizontal shadow bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 w-full rounded-2xl overflow-hidden transition-all duration-300">
          <div className="stat">
            <div className="stat-figure text-primary">
              <VideoIcon className="h-8 w-8" />
            </div>
            <div className="stat-title text-slate-500 dark:text-zinc-400 font-medium">Total Media Files</div>
            <div className="stat-value text-slate-800 dark:text-zinc-100">{videos.length}</div>
            <div className="stat-desc text-slate-400 dark:text-zinc-500">Processed & compressed</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <TrendingDown className="h-8 w-8" />
            </div>
            <div className="stat-title text-slate-500 dark:text-zinc-400 font-medium">Total Storage Saved</div>
            <div className="stat-value text-secondary">
              {filesize(totalSavingsBytes)}
            </div>
            <div className="stat-desc text-slate-400 dark:text-zinc-500">
              Down from {filesize(totalOriginalSize)}
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-accent">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="stat-title text-slate-500 dark:text-zinc-400 font-medium">Avg. Compression</div>
            <div className="stat-value text-accent">{averageCompression}%</div>
            <div className="stat-desc text-slate-400 dark:text-zinc-500">Bandwidth & storage optimization</div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-3xl min-h-[45vh] shadow-sm">
          <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <Upload className="h-8 w-8 text-slate-400 dark:text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-2">No videos uploaded yet</h3>
          <p className="text-slate-500 dark:text-zinc-400 max-w-sm mb-6 text-sm">
            Upload your first video to compress and optimize it using Cloudinary's intelligent algorithms.
          </p>
          <Link href="/video-upload" className="btn btn-primary rounded-xl px-6 gap-2">
            <Upload className="h-4 w-4" />
            Upload Video
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">Your Video Library</h3>
            <Link href="/video-upload" className="btn btn-primary btn-sm rounded-lg gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Upload New
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;