'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Input,
  ScrollShadow,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import ImagesTab from './tabs/ImagesTab';
import VideosTab from './tabs/VideosTab';
import UnsplashTab from './tabs/UnsplashTab';
import GiphyTab from './tabs/GiphyTab';
import IconSetsTab from './tabs/IconSetsTab';
import BrandfetchTab from './tabs/BrandfetchTab';
import StickersTab from './tabs/StickersTab';

interface MediaSelectorProps {
  onSelect: (mediaUrl: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function MediaSelector({ onSelect, onClose, isOpen }: MediaSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('images');
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search for images...');

  // Update search placeholder based on active tab
  useEffect(() => {
    const placeholders: Record<string, string> = {
      images: 'Search for images...',
      videos: 'Search for videos...',
      unsplash: 'Search Unsplash photos...',
      giphy: 'Search Giphy...',
      iconSets: 'Search icon sets...',
      brandfetch: 'Search for brand logos...',
      stickers: 'Search for stickers...',
    };

    setSearchPlaceholder(placeholders[activeTab] || 'Search...');
    // Reset search term when switching tabs
    setSearchTerm('');
  }, [activeTab]);

  // Add listener for custom giphy-search events
  useEffect(() => {
    const handleGiphySearch = (event: CustomEvent) => {
      if (event.detail?.term) {
        setSearchTerm(event.detail.term);
      }
    };

    window.addEventListener('giphy-search' as any, handleGiphySearch as EventListener);

    return () => {
      window.removeEventListener('giphy-search' as any, handleGiphySearch as EventListener);
    };
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{
        base: 'bg-black border border-gray-800',
        backdrop: 'bg-black/80',
      }}
      isOpen={isOpen}
      size="5xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Media Library</h2>
          <Button
            isIconOnly
            className="text-gray-400 bg-transparent"
            variant="light"
            onPress={onClose}
          >
            <Icon icon="material-symbols:close" width={24} />
          </Button>
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="flex h-[600px]">
            {/* Left sidebar */}
            <div className="w-64 border-r border-gray-800 bg-gray-900 shrink-0">
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-sm text-gray-400 mb-2">Library</h3>
                  <div className="space-y-1">
                    <SidebarItem
                      icon="material-symbols:image"
                      isActive={activeTab === 'images'}
                      label="Images"
                      onClick={() => handleTabChange('images')}
                    />
                    <SidebarItem
                      icon="material-symbols:videocam"
                      isActive={activeTab === 'videos'}
                      label="Videos"
                      onClick={() => handleTabChange('videos')}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm text-gray-400 mb-2">Integrations</h3>
                  <div className="space-y-1">
                    <SidebarItem
                      icon="simple-icons:unsplash"
                      isActive={activeTab === 'unsplash'}
                      label="Unsplash"
                      onClick={() => handleTabChange('unsplash')}
                    />
                    <SidebarItem
                      icon="simple-icons:giphy"
                      isActive={activeTab === 'giphy'}
                      label="Giphy"
                      onClick={() => handleTabChange('giphy')}
                    />
                    <SidebarItem
                      icon="material-symbols:category"
                      isActive={activeTab === 'iconSets'}
                      label="Icon sets"
                      onClick={() => handleTabChange('iconSets')}
                    />
                    <SidebarItem
                      icon="material-symbols:logo-dev"
                      isActive={activeTab === 'brandfetch'}
                      label="Brandfetch"
                      onClick={() => handleTabChange('brandfetch')}
                    />
                    <SidebarItem
                      icon="material-symbols:sticker"
                      isActive={activeTab === 'stickers'}
                      label="Stickers"
                      onClick={() => handleTabChange('stickers')}
                    />
                  </div>
                </div>

                <Button
                  className="w-full bg-gray-800 text-white border border-gray-700"
                  startContent={<Icon icon="material-symbols:cloud-upload" width={18} />}
                  variant="flat"
                >
                  Upload media
                </Button>
              </div>
            </div>

            {/* Right content area */}
            <div className="flex-1 flex flex-col">
              {/* Search bar */}
              <div className="p-3 border-b border-gray-800">
                <Input
                  classNames={{
                    base: 'w-full',
                    inputWrapper: 'bg-gray-800 border-none h-10',
                    input: 'text-white',
                  }}
                  placeholder={searchPlaceholder}
                  startContent={
                    <Icon className="text-gray-400" icon="material-symbols:search" width={18} />
                  }
                  value={searchTerm}
                  onValueChange={handleSearch}
                />
              </div>

              {/* Content tabs */}
              <ScrollShadow className="flex-1 overflow-y-auto p-4">
                {activeTab === 'images' && (
                  <ImagesTab searchTerm={searchTerm} onSelect={onSelect} />
                )}
                {activeTab === 'videos' && (
                  <VideosTab searchTerm={searchTerm} onSelect={onSelect} />
                )}
                {activeTab === 'unsplash' && (
                  <UnsplashTab searchTerm={searchTerm} onSelect={onSelect} />
                )}
                {activeTab === 'giphy' && <GiphyTab searchTerm={searchTerm} onSelect={onSelect} />}
                {activeTab === 'iconSets' && (
                  <IconSetsTab searchTerm={searchTerm} onSelect={onSelect} />
                )}
                {activeTab === 'brandfetch' && (
                  <BrandfetchTab searchTerm={searchTerm} onSelect={onSelect} />
                )}
                {activeTab === 'stickers' && (
                  <StickersTab searchTerm={searchTerm} onSelect={onSelect} />
                )}
              </ScrollShadow>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

// Helper component for sidebar items
function SidebarItem({
  label,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors ${
        isActive
          ? 'bg-gray-800 text-white'
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
      }`}
      onClick={onClick}
    >
      <Icon className={isActive ? 'text-white' : 'text-gray-400'} icon={icon} width={20} />
      <span>{label}</span>
    </button>
  );
}
