// src/components/features/application/editor/SortableSlide.tsx
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Slide } from "./EditorContainer";

interface SortableSlideProps {
  slide: Slide;
  index: number;
  currentIndex: number;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
  onDuplicate: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

const SortableSlide = ({
  slide,
  index,
  currentIndex,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: SortableSlideProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} className="group relative" style={style}>
      <button
        className={`rounded-md overflow-hidden cursor-pointer relative w-full text-left transition-all ${currentIndex === index ? "ring-2 ring-indigo-600" : "hover:ring-1 hover:ring-gray-500"}`}
        onClick={() => onSelect(index)}
      >
        <div className="absolute top-1 left-2 text-xs text-white bg-black/50 px-1 rounded-sm">
          {index + 1}
        </div>

        <div
          className="h-28 bg-black p-2 text-center flex flex-col justify-center"
          style={{
            background: slide.gradient || slide.backgroundColor || "black",
          }}
        >
          {index === 0 ? (
            <>
              <div className="text-white text-xs font-bold truncate">
                {slide.title}
              </div>
              <div className="text-white text-[8px] mt-1 truncate">
                {slide.subtitle}
              </div>
            </>
          ) : (
            <>
              <div className="text-white text-xs font-bold truncate">
                {slide.title}
              </div>
              <div className="text-white text-[8px] mt-1">
                <ul className="list-disc list-inside">
                  {slide.content?.slice(0, 2).map((item, i) => (
                    <li key={i} className="truncate">
                      {item.value}
                    </li>
                  ))}
                  {(slide.content?.length || 0) > 2 && <li>...</li>}
                </ul>
              </div>
            </>
          )}
        </div>
      </button>

      {/* Slide actions overlay */}
      <div className="absolute top-0 right-0 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
        <Tooltip content="Drag to reorder" placement="right">
          <button
            className="p-1 bg-black/70 text-gray-300 hover:text-white"
            {...attributes}
            {...listeners}
          >
            <Icon icon="material-symbols:drag-indicator" width={16} />
          </button>
        </Tooltip>

        <Tooltip content="Move up" placement="right">
          <button
            className={`p-1 bg-black/70 text-gray-300 hover:text-white ${isFirst ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isFirst}
            onClick={() => !isFirst && onMoveUp(index)}
          >
            <Icon icon="material-symbols:arrow-upward" width={16} />
          </button>
        </Tooltip>

        <Tooltip content="Move down" placement="right">
          <button
            className={`p-1 bg-black/70 text-gray-300 hover:text-white ${isLast ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLast}
            onClick={() => !isLast && onMoveDown(index)}
          >
            <Icon icon="material-symbols:arrow-downward" width={16} />
          </button>
        </Tooltip>

        <Tooltip content="Duplicate slide" placement="right">
          <button
            className="p-1 bg-black/70 text-gray-300 hover:text-white"
            onClick={() => onDuplicate(index)}
          >
            <Icon icon="material-symbols:content-copy" width={16} />
          </button>
        </Tooltip>

        <Tooltip content="Delete slide" placement="right">
          <button
            className="p-1 bg-black/70 text-gray-300 hover:text-white"
            onClick={() => onDelete(index)}
          >
            <Icon icon="material-symbols:delete" width={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default SortableSlide;