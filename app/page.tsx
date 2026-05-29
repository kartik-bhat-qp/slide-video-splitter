"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  async function uploadFile() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setUrl(data.url);
  }

  return (
    <main className="max-w-xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">
        Slide Video Splitter
      </h1>

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <button
        onClick={uploadFile}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Upload
      </button>

      {url && (
        <div className="mt-6">
          Uploaded Successfully
        </div>
      )}
    </main>
  );
}