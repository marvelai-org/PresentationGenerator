"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Tooltip,
  ButtonGroup,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

interface SlideContent {
  id: number;
  title: string;
  bullets: string[];
}

export default function OutlinePage() {
  const router = useRouter();
  // Sample data based on the screenshot
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prompt, setPrompt] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [credits, setCredits] = useState(100);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [slides, setSlides] = useState<SlideContent[]>([
    {
      id: 1,
      title: "The Power of Creative Collaboration",
      bullets: [
        "Unlock potential through strategic partnerships",
        "78% of successful creators rely on collaborations",
        "Transform individual talents into collective innovation",
      ],
    },
    {
      id: 2,
      title: "Why Collaborate?",
      bullets: [
        "Expand creative networks and audience reach",
        "Combine complementary skills and expertise",
        "Cross-pollinate innovative ideas",
        "Amplify creative potential through shared resources",
      ],
    },
    {
      id: 3,
      title: "Identifying the Right Collaboration Partners",
      bullets: [
        "Align on shared creative vision and values",
        "Assess complementary skills and strengths",
        "Evaluate potential audience overlap",
        "Consider long-term collaborative potential",
      ],
    },
    {
      id: 4,
      title: "Effective Collaboration Structures",
      bullets: [
        "Define clear roles and responsibilities",
        "Establish communication protocols",
        "Create joint ownership agreements",
        "Set realistic timelines and milestones",
      ],
    },
    {
      id: 5,
      title: "Communication Strategies for Collaborators",
      bullets: [
        "Schedule regular check-ins and updates",
        "Use collaborative tools and platforms",
        "Practice active listening and open dialogue",
        "Develop conflict resolution mechanisms",
      ],
    },
    {
      id: 6,
      title: "Navigating Creative Differences",
      bullets: [
        "Embrace diverse perspectives as strength",
        "Develop compromise and negotiation skills",
        "Create space for constructive feedback",
        "Maintain mutual respect and professionalism",
      ],
    },
    {
      id: 7,
      title: "Maximizing Collaborative Outcomes",
      bullets: [
        "Document and celebrate collaborative achievements",
        "Create systems for future partnership opportunities",
        "Leverage collective social media and marketing reach",
        "Build long-term creative networks",
      ],
    },
    {
      id: 8,
      title: "The Future of Creative Collaboration",
      bullets: [
        "Emerging technologies enabling global connections",
        "Increasing importance of cross-disciplinary projects",
        "Potential for transformative creative innovations",
        "Continuous learning and adaptation",
      ],
    },
  ]);

  const [slideCount, setSlideCount] = useState("8 cards");
  const [templateStyle, setTemplateStyle] = useState("Default");
  const [language, setLanguage] = useState("English (US)");
  const [textDensity, setTextDensity] = useState("Medium");
  const [imageSource, setImageSource] = useState("AI images");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [aiModel, setAiModel] = useState("Flux Fast");

  const deleteSlide = (id: number) => {
    setSlides(slides.filter((slide) => slide.id !== id));
  };

  const handleGeneratePresentation = () => {
    // In a real app, we would save the current state before navigating
    router.push("/dashboard/create/editor");
  };

  return (
    <div className="max-w-5xl mx-auto pb-32">
      <div className="flex items-center mb-6">
        <Button
          className="mr-4"
          startContent={<Icon icon="material-symbols:arrow-back" />}
          variant="light"
          onPress={() => router.push("/dashboard/create")}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold">Generate</h1>
      </div>

      {/* Options Row */}
      <div className="flex flex-wrap gap-2 justify-start mb-6">
        <div className="mr-3">Prompt</div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={<Icon icon="material-symbols:expand-more" />}
              variant="flat"
            >
              {slideCount}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Card Count"
            onAction={(key) => setSlideCount(key.toString())}
          >
            <DropdownItem key="4 cards">4 cards</DropdownItem>
            <DropdownItem key="8 cards">8 cards</DropdownItem>
            <DropdownItem key="12 cards">12 cards</DropdownItem>
            <DropdownItem key="16 cards">16 cards</DropdownItem>
            <DropdownItem key="20 cards">20 cards</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={<Icon icon="material-symbols:expand-more" />}
              startContent={<Icon icon="material-symbols:refresh" />}
              variant="flat"
            >
              {templateStyle}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Template Style"
            onAction={(key) => setTemplateStyle(key.toString())}
          >
            <DropdownItem key="Default">Default</DropdownItem>
            <DropdownItem key="Professional">Professional</DropdownItem>
            <DropdownItem key="Creative">Creative</DropdownItem>
            <DropdownItem key="Minimalist">Minimalist</DropdownItem>
            <DropdownItem key="Bold">Bold</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={<Icon icon="material-symbols:expand-more" />}
              startContent={<Icon icon="material-symbols:language" />}
              variant="flat"
            >
              {language}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Language"
            onAction={(key) => setLanguage(key.toString())}
          >
            <DropdownItem key="English (US)">English (US)</DropdownItem>
            <DropdownItem key="English (UK)">English (UK)</DropdownItem>
            <DropdownItem key="Spanish">Spanish</DropdownItem>
            <DropdownItem key="French">French</DropdownItem>
            <DropdownItem key="German">German</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Prompt Display */}
      <div className="mb-8">
        <Card className="bg-content1/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg">
                Collaborating with other creators on a joint project or
                collaboration
              </p>
            </div>
            <Button isIconOnly className="text-default-500" variant="light">
              <Icon icon="material-symbols:refresh" width={20} />
            </Button>
          </div>
        </Card>
      </div>

      {/* Outline Section Title */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Outline</h2>
      </div>

      {/* Slide Outline Cards */}
      <div className="space-y-4 mb-8">
        {slides.map((slide) => (
          <Card
            key={slide.id}
            className="bg-content1/10 border border-content2"
          >
            <div className="flex p-4">
              <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-md text-primary mr-4">
                {slide.id}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{slide.title}</h3>
                <ul className="list-disc pl-5 text-default-600 space-y-1">
                  {slide.bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              </div>
              <div>
                {slide.id === 6 && (
                  <Button
                    isIconOnly
                    className="text-default-500"
                    variant="light"
                    onPress={() => deleteSlide(slide.id)}
                  >
                    <Icon icon="material-symbols:delete-outline" width={20} />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Card Button */}
      <div className="mb-8">
        <Button
          fullWidth
          className="border-2 border-dashed border-default-200 py-6"
          startContent={<Icon icon="material-symbols:add" />}
          variant="flat"
        >
          Add card
        </Button>
      </div>

      {/* Cards Count */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <span className="text-default-500">{slides.length} cards total</span>
        </div>

        <div className="flex items-center">
          <span className="text-default-500 mr-2">Type</span>
          <Input
            className="w-40 h-8"
            placeholder="-- for card breaks"
            size="sm"
          />
        </div>

        <div className="flex items-center">
          <span className="text-default-500 mr-2">300/20000</span>
        </div>
      </div>

      {/* Customize Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Customize your gamma</h2>

        {/* Themes */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Themes</h3>
            <Button
              size="sm"
              startContent={<Icon icon="material-symbols:visibility" />}
              variant="light"
            >
              View more
            </Button>
          </div>
          <p className="text-default-500 text-sm mb-4">
            Use one of our popular themes below or view more
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Theme 1 - Vanilla */}
            <div className="relative">
              <Card className="p-4 border-2 border-primary">
                <div className="p-2 rounded-lg bg-[#FFF9C4] mb-2">
                  <p className="font-semibold">Title</p>
                  <div className="text-sm">
                    Body & <span className="text-blue-500">link</span>
                  </div>
                </div>
                <div className="text-center text-sm">Vanilla</div>
              </Card>
              <div className="absolute top-2 left-2 text-primary">
                <Icon icon="material-symbols:check" />
              </div>
            </div>

            {/* Theme 2 - Daydream */}
            <Card className="p-4">
              <div className="p-2 rounded-lg bg-blue-100 mb-2">
                <p className="font-semibold">Title</p>
                <div className="text-sm">
                  Body & <span className="text-blue-500">link</span>
                </div>
              </div>
              <div className="text-center text-sm">Daydream</div>
            </Card>

            {/* Theme 3 - Chisel */}
            <Card className="p-4">
              <div className="p-2 rounded-lg bg-gray-50 mb-2">
                <p className="font-semibold">Title</p>
                <div className="text-sm">
                  Body & <span className="text-blue-500">link</span>
                </div>
              </div>
              <div className="text-center text-sm">Chisel</div>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Theme 4 - Wireframe */}
            <Card className="p-4">
              <div className="p-2 rounded-lg bg-gray-100 mb-2">
                <p className="font-semibold">Title</p>
                <div className="text-sm">
                  Body & <span className="text-blue-500">link</span>
                </div>
              </div>
              <div className="text-center text-sm">Wireframe</div>
            </Card>

            {/* Theme 5 - Bee Happy */}
            <Card className="p-4">
              <div className="p-2 rounded-lg bg-black mb-2">
                <p className="font-semibold text-yellow-400">Title</p>
                <div className="text-sm text-white">
                  Body & <span className="text-yellow-400">link</span>
                </div>
              </div>
              <div className="text-center text-sm">Bee Happy</div>
            </Card>

            {/* Theme 6 - Icebreaker */}
            <Card className="p-4">
              <div className="p-2 rounded-lg bg-blue-50 mb-2">
                <p className="font-semibold text-blue-600">Title</p>
                <div className="text-sm">
                  Body & <span className="text-blue-500">link</span>
                </div>
              </div>
              <div className="text-center text-sm">Icebreaker</div>
            </Card>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h3 className="font-medium mb-2">Content</h3>
          <p className="text-default-500 text-sm mb-4">
            Adjust text and image styles for your gamma
          </p>

          {/* Text Density */}
          <div className="mb-6">
            <p className="text-sm mb-2">Amount of text per card</p>
            <ButtonGroup className="w-full" variant="flat">
              <Button
                className={
                  textDensity === "Brief"
                    ? "bg-primary text-white flex-1"
                    : "flex-1"
                }
                onPress={() => setTextDensity("Brief")}
              >
                <Icon
                  className="mr-2"
                  icon="material-symbols:format-list-bulleted"
                />
                Brief
              </Button>
              <Button
                className={
                  textDensity === "Medium"
                    ? "bg-primary text-white flex-1"
                    : "flex-1"
                }
                onPress={() => setTextDensity("Medium")}
              >
                <Icon
                  className="mr-2"
                  icon="material-symbols:format-list-bulleted"
                />
                Medium
              </Button>
              <Button
                className={
                  textDensity === "Detailed"
                    ? "bg-primary text-white flex-1"
                    : "flex-1"
                }
                onPress={() => setTextDensity("Detailed")}
              >
                <Icon
                  className="mr-2"
                  icon="material-symbols:format-list-bulleted"
                />
                Detailed
              </Button>
            </ButtonGroup>
          </div>

          {/* Image Source */}
          <div className="mb-4">
            <p className="text-sm mb-2">Image source</p>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  fullWidth
                  className="justify-between"
                  endContent={
                    <Icon
                      icon={
                        showImageOptions
                          ? "material-symbols:keyboard-arrow-up"
                          : "material-symbols:keyboard-arrow-down"
                      }
                    />
                  }
                  startContent={<Icon icon="material-symbols:image" />}
                  variant="flat"
                  onPress={() => setShowImageOptions(!showImageOptions)}
                >
                  {imageSource}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Image Source"
                onAction={(key) => setImageSource(key.toString())}
              >
                <DropdownItem
                  key="Automatic"
                  startContent={<Icon icon="material-symbols:auto-awesome" />}
                >
                  <div>
                    <div>Automatic</div>
                    <div className="text-xs text-default-500">
                      Automatically select best image type for each image
                    </div>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="Stock photos"
                  startContent={<Icon icon="material-symbols:image" />}
                >
                  <div>
                    <div>Stock photos</div>
                    <div className="text-xs text-default-500">
                      Search free high-resolution photos and backgrounds from
                      Unsplash
                    </div>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="Web images"
                  startContent={<Icon icon="material-symbols:public" />}
                >
                  <div>
                    <div>Web images</div>
                    <div className="text-xs text-default-500">
                      Search the internet for images
                    </div>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="AI images"
                  startContent={<Icon icon="material-symbols:auto-awesome" />}
                >
                  <div>
                    <div>AI images</div>
                    <div className="text-xs text-default-500">
                      Generate original images and graphics with AI
                    </div>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="Illustrations"
                  startContent={<Icon icon="material-symbols:draw" />}
                >
                  <div>
                    <div>Illustrations</div>
                    <div className="text-xs text-default-500">
                      Search for illustrations from Pictographic
                    </div>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="Animated GIFs"
                  startContent={<Icon icon="material-symbols:gif-box" />}
                >
                  <div>
                    <div>Animated GIFs</div>
                    <div className="text-xs text-default-500">
                      Search for fun animated GIFs from Giphy
                    </div>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Image Style */}
          <div className="mb-4">
            <p className="text-sm mb-2">Image style</p>
            <Input
              fullWidth
              placeholder="Optional: describe the colors, style, or mood to use"
            />
          </div>

          {/* AI Image Model */}
          <div className="mb-4">
            <p className="text-sm mb-2">AI image model</p>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  fullWidth
                  className="justify-between"
                  endContent={
                    <Icon icon="material-symbols:keyboard-arrow-down" />
                  }
                  startContent={<Icon icon="material-symbols:auto-awesome" />}
                  variant="flat"
                >
                  {aiModel}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="AI Image Model"
                onAction={(key) => setAiModel(key.toString())}
              >
                <DropdownItem
                  key="basic-models-header"
                  className="text-sm opacity-70"
                  textValue="Basic models header"
                >
                  Basic models
                </DropdownItem>
                <DropdownItem
                  key="Flux Fast"
                  startContent={<Icon icon="material-symbols:bolt" />}
                >
                  <div className="flex justify-between w-full">
                    <span>Flux Fast</span>
                    <span className="text-xs text-default-500">
                      Black Forest Labs
                    </span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="Imagen 3 Fast"
                  startContent={<Icon icon="material-symbols:star" />}
                >
                  <div className="flex justify-between w-full">
                    <span>Imagen 3 Fast</span>
                    <span className="text-xs text-default-500">Google</span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="advanced-models-header"
                  className="text-sm opacity-70"
                  textValue="Advanced models header"
                >
                  <div className="flex items-center">
                    Advanced models
                    <span className="ml-2 bg-primary text-xs text-white px-1 rounded">
                      PLUS
                    </span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="Flux Pro"
                  startContent={<Icon icon="material-symbols:bolt" />}
                >
                  <div className="flex justify-between w-full">
                    <span>Flux Pro</span>
                    <span className="text-xs text-default-500">
                      Black Forest Labs
                    </span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="Ideogram 2 Turbo"
                  startContent={<Icon icon="material-symbols:star" />}
                >
                  <div className="flex justify-between w-full">
                    <span>Ideogram 2 Turbo</span>
                    <span className="text-xs text-default-500">Ideogram</span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="Imagen 3"
                  startContent={<Icon icon="material-symbols:star" />}
                >
                  <div className="flex justify-between w-full">
                    <span>Imagen 3</span>
                    <span className="text-xs text-default-500">Google</span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="Leonardo Phoenix"
                  startContent={<Icon icon="material-symbols:star" />}
                >
                  <div className="flex justify-between w-full">
                    <span>Leonardo Phoenix</span>
                    <span className="text-xs text-default-500">Leonardo</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {/* Advanced Mode */}
        <div className="flex justify-center mb-6">
          <Button
            startContent={<Icon icon="material-symbols:settings" />}
            variant="light"
          >
            Advanced mode
          </Button>
        </div>
      </div>

      {/* Footer with Generate Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center text-default-500">
            <Icon className="mr-2" icon="material-symbols:toll" />
            <span>{credits} credits</span>
            <Tooltip content="Information about credits">
              <Button isIconOnly size="sm" variant="light">
                <Icon icon="material-symbols:info" />
              </Button>
            </Tooltip>
          </div>
          <div className="text-default-500">{slides.length} cards total</div>
          <Button
            className="bg-indigo-600"
            color="primary"
            size="lg"
            startContent={<Icon icon="material-symbols:magic-button" />}
            onPress={handleGeneratePresentation}
          >
            Generate
          </Button>
        </div>
      </div>

      {/* Help Button */}
      <Button
        isIconOnly
        aria-label="Help"
        className="fixed bottom-20 right-6 z-10"
        radius="full"
        variant="bordered"
      >
        <Icon className="text-xl" icon="material-symbols:help" />
      </Button>
    </div>
  );
}
