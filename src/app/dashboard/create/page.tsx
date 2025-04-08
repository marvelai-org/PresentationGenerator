"use client";

import { Button, Card, CardBody, Chip, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CreatePage() {
  const _router = useRouter();

  return (
    <div className="min-h-screen flex flex-col gap-8 max-w-5xl mx-auto py-8 px-4 overflow-y-auto">
      {/* Home Button - Updated to match screenshot 2 */}
      <div className="flex items-center mb-2">
        <Button
          as={Link}
          className="rounded-full px-4 py-2 bg-background border border-default-200 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 shadow-sm"
          href="/dashboard"
          startContent={
            <Icon
              className="text-primary"
              icon="material-symbols:home-outline"
            />
          }
          variant="light"
        >
          Home
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
          Create with AI
        </h1>
        <p className="text-default-500 text-xl">
          How would you like to get started?
        </p>
      </motion.div>

      {/* Options Grid with Enhanced Animations - Made entire cards clickable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Paste Text Option */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Link className="h-full block" href="/dashboard/create/text">
            <Card className="bg-background/70 border border-default-200 hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg h-full overflow-hidden cursor-pointer">
              <CardBody className="flex flex-col items-center justify-center py-10 gap-6">
                <div className="w-32 h-32 flex items-center justify-center bg-primary/10 rounded-xl">
                  <Icon
                    className="w-16 h-16 text-primary"
                    icon="material-symbols:text-snippet-outline"
                  />
                </div>
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Paste in text
                  </h2>
                  <p className="text-default-500">
                    Create from notes, an outline, or existing content
                  </p>
                </div>
              </CardBody>
            </Card>
          </Link>
        </motion.div>

        {/* Generate Option */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Link className="h-full block" href="/dashboard/create/generate">
            <Card className="bg-background/70 border border-default-200 hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg h-full overflow-hidden relative cursor-pointer">
              <Chip
                className="absolute top-4 right-4 z-10"
                color="primary"
                size="sm"
                variant="solid"
              >
                Popular
              </Chip>
              <CardBody className="flex flex-col items-center justify-center py-10 gap-6">
                <div className="w-32 h-32 flex items-center justify-center bg-primary/10 rounded-xl group">
                  <Icon
                    className="w-16 h-16 text-primary transition-all duration-300 group-hover:scale-110"
                    icon="material-symbols:magic-button"
                  />
                </div>
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Generate
                  </h2>
                  <p className="text-default-500">
                    Create from a one-line prompt in a few seconds
                  </p>
                </div>
              </CardBody>
            </Card>
          </Link>
        </motion.div>

        {/* Import Option */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Link className="h-full block" href="/dashboard/create/import">
            <Card className="bg-background/70 border border-default-200 hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg h-full overflow-hidden cursor-pointer">
              <CardBody className="flex flex-col items-center justify-center py-10 gap-6">
                <div className="w-32 h-32 flex items-center justify-center bg-primary/10 rounded-xl group">
                  <Icon
                    className="w-16 h-16 text-primary transition-all duration-300 group-hover:scale-110"
                    icon="material-symbols:upload-file"
                  />
                </div>
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Import file or URL
                  </h2>
                  <p className="text-default-500">
                    Enhance existing docs, presentations, or webpages
                  </p>
                </div>
              </CardBody>
            </Card>
          </Link>
        </motion.div>
      </div>

      {/* Recent Prompts Section - Completely redesigned with modern formatting */}
      <motion.div
        animate={{ opacity: 1 }}
        className="mt-16"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <Icon
            className="text-primary text-xl mr-2"
            icon="material-symbols:history"
          />
          <h2 className="text-2xl font-bold text-foreground">
            Your recent prompts
          </h2>
        </div>

        {/* Redesigned prompt cards with modern layout */}
        <div className="space-y-4">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="group"
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Link href="/dashboard/create/generate/draft-123">
              <Card className="bg-background/30 border border-default-100 group-hover:border-primary/50 transition-all duration-300 shadow-sm group-hover:shadow-md overflow-hidden">
                <CardBody className="py-5 px-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                        Collaborating with other creators on a joint project or
                        collaboration
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                        <div className="flex items-center">
                          <Icon
                            className="text-primary mr-1"
                            icon="material-symbols:bolt"
                          />
                          <span className="text-default-500 text-sm">
                            Generate
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Icon
                            className="text-default-400 mr-1"
                            icon="material-symbols:schedule"
                          />
                          <span className="text-default-500 text-sm">
                            3 hours ago
                          </span>
                        </div>
                        <Chip
                          className="h-5 px-2"
                          color="primary"
                          size="sm"
                          variant="flat"
                        >
                          DRAFT
                        </Chip>
                      </div>
                    </div>
                    <div className="flex-shrink-0 rounded-full p-1.5 bg-default-100 group-hover:bg-primary/10 transition-colors duration-300">
                      <Icon
                        className="text-primary w-5 h-5"
                        icon="material-symbols:arrow-forward"
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="group"
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Link href="/dashboard/presentations/completed-456">
              <Card className="bg-background/30 border border-default-100 group-hover:border-primary/50 transition-all duration-300 shadow-sm group-hover:shadow-md overflow-hidden">
                <CardBody className="py-5 px-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                        Seminar on the psychology of decision-making
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                        <div className="flex items-center">
                          <Icon
                            className="text-primary mr-1"
                            icon="material-symbols:bolt"
                          />
                          <span className="text-default-500 text-sm">
                            Generate
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Icon
                            className="text-default-400 mr-1"
                            icon="material-symbols:schedule"
                          />
                          <span className="text-default-500 text-sm">
                            Yesterday
                          </span>
                        </div>
                        <Chip
                          className="h-5 px-2"
                          color="success"
                          size="sm"
                          variant="flat"
                        >
                          COMPLETED
                        </Chip>
                      </div>
                    </div>
                    <div className="flex-shrink-0 rounded-full p-1.5 bg-default-100 group-hover:bg-primary/10 transition-colors duration-300">
                      <Icon
                        className="text-primary w-5 h-5"
                        icon="material-symbols:arrow-forward"
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </motion.div>
        </div>
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
    </div>
  );
}
