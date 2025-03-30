"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
  cn,
} from "@heroui/react";
import type { NavbarProps } from "@heroui/react";
import { Icon } from "@iconify/react";

// You'll need to create/replace this with your Vibing logo component
import { AcmeIcon } from "@/components/ui/Social";

const LeanNavbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ classNames: { base, wrapper, ...otherClassNames } = {}, ...props }, ref) => {
    return (
      <Navbar
        ref={ref}
        classNames={{
          base: cn(
            "max-w-full mx-auto bg-transparent px-4 py-2",
            base,
          ),
          wrapper: cn("px-0 max-w-[1200px] mx-auto", wrapper),
          ...otherClassNames,
        }}
        height="60px"
        position="static"
        {...props}
      >
        <NavbarBrand>
          <div className="flex items-center">
            {/* Replace with your Vibing logo or keep AcmeIcon */}
            <AcmeIcon className="text-white" size={34} />
            <span className="ml-2 text-xl font-medium text-white">Vibing</span>
          </div>
        </NavbarBrand>

        {/* This pushes the buttons to the right */}
        <NavbarContent className="flex gap-4" justify="end">
          <NavbarItem>
            <Button 
              as={Link} 
              href="/login" 
              variant="flat" 
              radius="full"
              className="text-white"
            >
              Log in
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button 
              as={Link} 
              href="/signup" 
              variant="bordered" 
              radius="full"
              className="border-[#9353d3] text-white"
              endContent={<Icon className="pointer-events-none" icon="solar:alt-arrow-right-linear" />}
            >
              Get Started
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    );
  },
);

LeanNavbar.displayName = "LeanNavbar";

export default LeanNavbar;