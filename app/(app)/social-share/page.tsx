"use client"
import React, { useRef, useState, useEffect } from 'react'
import { CldImage } from "next-cloudinary";
import axios from 'axios';

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

function SocialShare() {

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
    const [isUploading, setIsUploading] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const imageRef  = useRef<HTMLImageElement>(null);


    useEffect(() => {
      if(uploadedImage) {
        setIsTransforming(true);
      }
    }, [selectedFormat, uploadedImage])

    const handleFileUpload =  async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if(!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/api/image-upload", formData);

            const data = response.data;
            setUploadedImage(data.publicId)
        } catch (error) {

            console.log(error)
            alert("Failed to upload image")
            
        } finally {
            setIsUploading(false);
        }

    }  
    
    const handleDownload = async () => {
      if (!imageRef.current) return;

      try {
        const response = await fetch(imageRef.current.src);

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const blob = await response.blob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

      } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download image.");
      }
    };  

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="card bg-base-100 shadow-xl border">
        <div className="card-body space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Social Media Image Creator</h1>
            <p className="text-base-content/70 mt-2">
              Upload an image and instantly resize it for popular social media
              platforms.
            </p>
          </div>

          {/* Upload */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Upload Image</span>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="file-input file-input-bordered file-input-primary w-full"
            />

            {isUploading && (
              <div className="mt-4 flex items-center gap-3">
                <span className="loading loading-spinner loading-md"></span>
                <span>Uploading image...</span>
              </div>
            )}
          </div>

          {/* Format Selection */}
          {uploadedImage && (
            <>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Social Media Format
                  </span>
                </label>

                <select
                  className="select select-bordered w-full"
                  value={selectedFormat}
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as SocialFormat)
                  }
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-sm text-base-content/60">
                  Output Size: {socialFormats[selectedFormat].width} ×{" "}
                  {socialFormats[selectedFormat].height}
                </p>
              </div>

              {/* Preview */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Preview</h2>

                <div className="relative rounded-xl border bg-base-200 p-6 min-h-[450px] flex items-center justify-center overflow-hidden">
                  {isTransforming && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-base-100/80 backdrop-blur-sm">
                      <span className="loading loading-spinner loading-lg"></span>
                      <p className="mt-3 font-medium">Generating Preview...</p>
                    </div>
                  )}

                  <CldImage
                    ref={imageRef}
                    src={uploadedImage}
                    alt="Transformed image"
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    crop="fill"
                    gravity="auto"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    className="rounded-xl shadow-xl max-h-[500px] w-auto"
                    onLoad={() => setIsTransforming(false)}
                  />
                </div>
              </div>

              {/* Download */}
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={handleDownload}
                  disabled={isTransforming}
                >
                  {isTransforming
                    ? "Generating..."
                    : `Download ${selectedFormat}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SocialShare