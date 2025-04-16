import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Select,
  SelectItem,
} from '@heroui/react';

import ImageSourceOption from './ImageSourceOption';

export interface ImageSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSource: string;
  setImageSource: (source: string) => void;
  imageModelId: string;
  setImageModelId: (modelId: string) => void;
  onApply: () => void;
}

export default function ImageSourceModal({
  isOpen,
  onClose,
  imageSource,
  setImageSource,
  imageModelId,
  setImageModelId,
  onApply,
}: ImageSourceModalProps) {
  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    <Modal
      classNames={{
        backdrop: 'bg-[#00000099] backdrop-blur-sm',
        base: 'border-0 shadow-xl bg-[#1C1C1E]',
        header: 'border-b border-[#38383A]',
        body: 'p-6',
        footer: 'border-t border-[#38383A]',
        closeButton: 'hover:bg-white/5',
      }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="border-b border-[#38383A] text-white">
              Select image source
            </ModalHeader>
            <ModalBody className="apple-dark">
              <RadioGroup className="space-y-3" value={imageSource} onValueChange={setImageSource}>
                <ImageSourceOption
                  description="High quality free stock photos"
                  title="Unsplash"
                  value="unsplash"
                />

                <ImageSourceOption
                  description="Free stock photos and videos"
                  title="Pexels"
                  value="pexels"
                />

                <ImageSourceOption
                  description="Generate AI images based on slide content"
                  title="AI images"
                  value="ai"
                />

                <ImageSourceOption
                  description="Use the best source for each slide automatically"
                  title="Automatic"
                  value="automatic"
                />
              </RadioGroup>

              {(imageSource === 'ai' || imageSource === 'automatic') && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    AI image model
                  </label>
                  <Select
                    className="w-full bg-[#232324] text-gray-300 border-[#38383A]"
                    classNames={{
                      trigger: 'bg-[#232324] data-[hover=true]:bg-[#28282A] border-[#38383A]',
                      listbox: 'bg-[#232324] text-gray-300',
                      popoverContent: 'bg-[#232324] border-[#38383A]',
                    }}
                    label="Select model"
                    selectedKeys={new Set([imageModelId])}
                    onChange={e => setImageModelId(e.target.value)}
                  >
                    <SelectItem key="dall-e-3" className="text-gray-300">
                      DALL-E 3
                    </SelectItem>
                    <SelectItem key="stable-diffusion" className="text-gray-300">
                      Stable Diffusion
                    </SelectItem>
                    <SelectItem key="midjourney" className="text-gray-300">
                      Midjourney
                    </SelectItem>
                  </Select>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="border-t border-[#38383A]">
              <Button className="text-gray-300" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white border-[#38383A]"
                onPress={handleApply}
              >
                Apply
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
