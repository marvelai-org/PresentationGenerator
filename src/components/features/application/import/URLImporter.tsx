'use client';

import { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';

interface URLImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (url: string) => void;
}

export default function URLImporter({ isOpen, onClose, onImport }: URLImporterProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateUrl = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl);

      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        setError('URL must start with http:// or https://');

        return false;
      }

      setError(null);

      return true;
    } catch {
      setError('Please enter a valid URL');

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
        <ModalHeader className="flex flex-col gap-1">Import from URL</ModalHeader>
        <ModalBody>
          <p className="text-default-500 mb-4">
            This will extract the text from the webpage you enter.
          </p>
          <Input
            color={error ? 'danger' : 'default'}
            errorMessage={error}
            label="URL"
            placeholder="https://www.example.com/"
            value={url}
            onValueChange={value => {
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
