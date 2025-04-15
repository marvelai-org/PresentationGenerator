'use client';

import React from 'react';
import { Button, Card, CardBody, useDisclosure, Link as HeroUILink, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import FileUploader from '@/components/features/application/import/FileUploader';
import URLImporter from '@/components/features/application/import/URLImporter';

export default function ImportPage() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileSelect = (_file: File) => {
    setSelectedFile(_file);
    // In a real application, you might want to upload the file right away
    // or wait for a user action
    handleFileUpload(_file);
  };

  const handleFileUpload = (_file: File) => {
    setIsUploading(true);

    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      // Navigate to next step or show success message
      router.push('/dashboard/create/outline');
    }, 1500);
  };

  const handleUrlImport = (_url: string) => {
    // Process the URL and navigate to the next step
    onClose();
    router.push('/dashboard/create/outline');
  };

  const handleDriveConnect = () => {
    // In a real application, you would initiate OAuth flow for Google Drive
    // Simulate connection and navigate
    setTimeout(() => {
      router.push('/dashboard/create/outline');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col gap-8 max-w-5xl mx-auto py-8 px-4 sm:px-6 overflow-y-auto">
      {/* Back Button */}
      <div className="flex items-center mb-2">
        <Button
          as={Link}
          className="rounded-full px-4 py-2 bg-background border border-default-200 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 shadow-sm mr-4"
          href="/dashboard/create"
          startContent={<Icon className="text-primary" icon="material-symbols:arrow-back" />}
          variant="light"
        >
          Back
        </Button>
      </div>

      {/* Header Section with Animation */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Import with AI
        </h1>
        <p className="text-default-500 text-xl">Select the file you&apos;d like to transform</p>
      </motion.div>

      {/* Import Options Grid with Animations - Adjusted for better spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {/* Upload a file */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Card
            isPressable
            className="bg-background/70 border border-default-200 hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg h-full w-full overflow-hidden cursor-pointer"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <CardBody className="flex flex-col items-center justify-between p-6 sm:p-8 h-full">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center bg-primary/10 rounded-xl">
                <Icon
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-primary"
                  icon="material-symbols:folder"
                />
              </div>

              <div className="space-y-2 text-center my-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Upload a file</h2>
                <div className="flex flex-col items-center gap-1 text-default-500 text-sm sm:text-base">
                  <div className="flex items-center gap-1">
                    <Icon className="text-success text-sm" icon="material-symbols:check-circle" />
                    <span>Powerpoint PPTX</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon className="text-success text-sm" icon="material-symbols:check-circle" />
                    <span>Word docs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon className="text-success text-sm" icon="material-symbols:check-circle" />
                    <span>PDFs</span>
                  </div>
                </div>
              </div>

              <Button
                className="rounded-full min-w-[140px]"
                color="primary"
                endContent={<Icon icon="material-symbols:download" />}
                variant="flat"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  document.getElementById('file-input')?.click();
                }}
              >
                Browse files
              </Button>
              <FileUploader
                buttonText={isUploading ? 'Uploading...' : ''}
                className="hidden"
                onFileSelect={handleFileSelect}
              />
            </CardBody>
          </Card>
        </motion.div>

        {/* Import from Drive */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Card
            isPressable
            className="bg-background/70 border border-default-200 hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg h-full w-full overflow-hidden cursor-pointer"
            onClick={handleDriveConnect}
          >
            <CardBody className="flex flex-col items-center justify-between p-6 sm:p-8 h-full">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center bg-primary/10 rounded-xl">
                <Icon
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-primary"
                  icon="material-symbols:cloud"
                />
              </div>

              <div className="space-y-2 text-center my-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  Import from Drive
                </h2>
                <div className="flex flex-col items-center gap-1 text-default-500 text-sm sm:text-base">
                  <div className="flex items-center gap-1">
                    <Icon className="text-success text-sm" icon="material-symbols:check-circle" />
                    <span>Google Slides</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon className="text-success text-sm" icon="material-symbols:check-circle" />
                    <span>Google Docs</span>
                  </div>
                </div>
              </div>

              <Button
                className="rounded-full min-w-[140px]"
                color="primary"
                endContent={<Icon icon="material-symbols:search" />}
                variant="flat"
              >
                Connect
              </Button>
            </CardBody>
          </Card>
        </motion.div>

        {/* Import from URL */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Card
            isPressable
            className="bg-background/70 border border-default-200 hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg h-full w-full overflow-hidden cursor-pointer"
            onClick={onOpen}
          >
            <CardBody className="flex flex-col items-center justify-between p-6 sm:p-8 h-full">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center bg-primary/10 rounded-xl">
                <Icon
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-primary"
                  icon="material-symbols:language"
                />
              </div>

              <div className="space-y-2 text-center my-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  Import from URL
                </h2>
                <div className="flex flex-col items-center gap-1 text-default-500 text-sm sm:text-base">
                  <div className="flex items-center gap-1">
                    <Icon className="text-success text-sm" icon="material-symbols:check-circle" />
                    <span>Webpages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon className="text-success text-sm" icon="material-symbols:check-circle" />
                    <span>Blog posts or articles</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon className="text-success text-sm" icon="material-symbols:check-circle" />
                    <span>Notion docs (public only)</span>
                  </div>
                </div>
              </div>

              <Button
                className="rounded-full min-w-[140px]"
                color="primary"
                endContent={<Icon icon="material-symbols:add" />}
                variant="flat"
              >
                Enter URL
              </Button>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* URL Importer Component */}
      <URLImporter isOpen={isOpen} onClose={onClose} onImport={handleUrlImport} />

      <motion.div
        animate={{ opacity: 1 }}
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-default-500">
          If your file isn&apos;t supported, you can also{' '}
          <HeroUILink
            as={Link}
            className="text-primary cursor-pointer"
            href="/dashboard/create/text"
            underline="hover"
          >
            paste in text
          </HeroUILink>
        </p>
      </motion.div>

      {/* Help Button */}
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6"
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Tooltip content="Help & Resources">
          <Button
            isIconOnly
            aria-label="Help"
            className="bg-primary hover:bg-primary/90 text-white transition-all duration-300"
            radius="full"
            variant="shadow"
          >
            <Icon className="text-xl" icon="material-symbols:help" />
          </Button>
        </Tooltip>
      </motion.div>

      {/* Add Generate Outline button */}
      {selectedFile && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            className="px-8"
            color="primary"
            size="lg"
            startContent={<Icon icon="material-symbols:magic-button" />}
            onPress={() => router.push('/dashboard/create/outline')}
          >
            Generate Outline
          </Button>
        </motion.div>
      )}
    </div>
  );
}
