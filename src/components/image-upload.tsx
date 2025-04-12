"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { XIcon } from "lucide-react";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

function ImageUpload({ endpoint, onChange, value }: ImageUploadProps) {
  if (value) {
    return (
      <div className="relative size-40">
        <img
          src={value}
          alt="Upload"
          className="object-cover rounded-md size-40"
        />
        <button
          onClick={() => onChange("")}
          className="absolute top-0 right-0 p-1 rounded-full bg-red-500"
          type="button"
        >
          <XIcon className="size-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error: Error) => {
        console.error(error?.message);
      }}
    />
  );
}

export default ImageUpload;
