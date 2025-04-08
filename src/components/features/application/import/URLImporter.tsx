"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

interface URLImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (url: string) => void;
}

/**
 * Renders a modal for importing data from a URL.
 *
 * This component displays a modal with an input field where the user can enter a URL. It validates that the URL starts with "http://" or "https://", shows an error message for invalid inputs, and simulates an asynchronous import process by invoking the provided import callback after a short delay.
 *
 * @param isOpen - Controls the visibility of the modal.
 * @param onClose - Callback invoked to close the modal.
 * @param onImport - Callback invoked with the valid URL when the import action is confirmed.
 */
export default function URLImporter({
  isOpen,
  onClose,
  onImport,
}: URLImporterProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateUrl = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl);

      if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
        setError("URL must start with http:// or https://");

        return false;
      }

      setError(null);

      return true;
    } catch {
      setError("Please enter a valid URL");

      return false;
    }
  };

  const handleImport = () => {
    if (validateUrl(url)) {
      setIsLoading(true);

      // In a real application, you might want to check if the URL is reachable
      // before proceeding with the import.
      setTimeout(() => {
        setIsLoading(false);
        onImport(url);
      }, 1000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Import from URL
        </ModalHeader>
        <ModalBody>
          <p className="text-default-500 mb-4">
            This will extract the text from the webpage you enter.
          </p>
          <Input
            color={error ? "danger" : "default"}
            errorMessage={error}
            label="URL"
            placeholder="https://www.example.com/"
            value={url}
            onValueChange={(value) => {
              setUrl(value);
              if (error) validateUrl(value);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            isDisabled={!url.trim() || !!error}
            isLoading={isLoading}
            onPress={handleImport}
          >
            Import
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
