"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  className?: string;
  buttonText?: string;
}

export default function FileUploader({
  onFileSelect,
  acceptedTypes = "application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain",
  maxSize = 10, // 10MB default
  className = "",
  buttonText = "Browse files",
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileType = file.type;

    if (!acceptedTypes.includes(fileType)) {
      setError(`File type ${fileType} not accepted`);

      return false;
    }

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > maxSize) {
      setError(`File size exceeds the ${maxSize}MB limit`);

      return false;
    }

    setError(null);

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`w-full ${className} ${dragActive ? "border-primary" : ""}`}
      onDragEnter={handleDrag}
    >
      <div
        className="flex items-center justify-center w-full"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          accept={acceptedTypes}
          className="hidden"
          type="file"
          onChange={handleChange}
        />

        <Button
          color="primary"
          endContent={<Icon icon="material-symbols:upload" />}
          variant="flat"
          onPress={handleButtonClick}
        >
          {buttonText}
        </Button>
      </div>

      {error && <p className="text-danger text-sm mt-2">{error}</p>}
    </div>
  );
}
