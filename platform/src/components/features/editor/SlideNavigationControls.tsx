// src/components/features/application/editor/SlideNavigationControls.tsx
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface SlideNavigationControlsProps {
  currentSlideIndex: number;
  totalSlides: number;
  navigateToSlide: (index: number) => void;
}

const SlideNavigationControls = ({
  currentSlideIndex,
  totalSlides,
  navigateToSlide,
}: SlideNavigationControlsProps) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/60 rounded-full px-4 py-1">
      <Button
        isIconOnly
        className="text-gray-400"
        isDisabled={currentSlideIndex === 0}
        size="sm"
        variant="light"
        onPress={() => navigateToSlide(Math.max(0, currentSlideIndex - 1))}
      >
        <Icon icon="material-symbols:arrow-back" width={20} />
      </Button>

      <span className="text-gray-300 text-sm">
        {currentSlideIndex + 1} / {totalSlides}
      </span>

      <Button
        isIconOnly
        className="text-gray-400"
        isDisabled={currentSlideIndex === totalSlides - 1}
        size="sm"
        variant="light"
        onPress={() => navigateToSlide(Math.min(totalSlides - 1, currentSlideIndex + 1))}
      >
        <Icon icon="material-symbols:arrow-forward" width={20} />
      </Button>
    </div>
  );
};

export default SlideNavigationControls;
