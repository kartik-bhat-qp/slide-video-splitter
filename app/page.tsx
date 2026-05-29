"use client";

import { useRef, useState } from "react";

type FileFieldProps = {
  id: string;
  label: string;
  accept: string;
  hint: string;
  file: File | null;
  onChange: (file: File | null) => void;
};

function FileField({ id, label, accept, hint, file, onChange }: FileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {label}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 px-6 py-8 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
      >
        <svg
          className="h-8 w-8 text-zinc-400 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
          />
        </svg>
        {file ? (
          <span className="max-w-full truncate px-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {file.name}
          </span>
        ) : (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Click to choose a file
          </span>
        )}
        <span className="text-xs text-zinc-400 dark:text-zinc-500">{hint}</span>
      </button>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [mp4File, setMp4File] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canProcess = pdfFile !== null && mp4File !== null && !isProcessing;

  async function handleProcess() {
    if (!pdfFile || !mp4File) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("video", mp4File);
      // TODO: POST to processing API
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Slide Video Splitter
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Upload a PDF and MP4 to process your slides.
          </p>
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            void handleProcess();
          }}
        >
          <FileField
            id="pdf-upload"
            label="PDF"
            accept="application/pdf,.pdf"
            hint="PDF files only"
            file={pdfFile}
            onChange={setPdfFile}
          />

          <FileField
            id="mp4-upload"
            label="MP4 Video"
            accept="video/mp4,.mp4"
            hint="MP4 files only"
            file={mp4File}
            onChange={setMp4File}
          />

          <button
            type="submit"
            disabled={!canProcess}
            className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {isProcessing ? "Processing…" : "Process"}
          </button>
        </form>
      </main>
    </div>
  );
}
