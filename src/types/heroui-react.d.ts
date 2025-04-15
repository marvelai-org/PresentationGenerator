// Type definitions for @heroui/react
declare module '@heroui/react' {
  import * as React from 'react';

  // Base props for components
  interface BaseProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    classNames?: Record<string, string>;
  }

  // Button component
  export interface ButtonProps extends BaseProps {
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    isDisabled?: boolean;
    isLoading?: boolean;
    isIconOnly?: boolean;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    fullWidth?: boolean;
    onPress?: (e: React.MouseEvent) => void;
    onClick?: (e: React.MouseEvent) => void;
    children?: React.ReactNode;
    href?: string;
    as?: string;
    disableRipple?: boolean;
    key?: string;
  }
  export const Button: React.FC<ButtonProps>;

  // Spinner component
  interface SpinnerSlots {
    base?: string;
    wrapper?: string;
    circle1?: string;
    circle2?: string;
    label?: string;
    dots?: string;
    spinnerBars?: string;
  }

  export interface SpinnerProps extends BaseProps {
    /**
     * The color of the spinner.
     * @default "primary"
     */
    color?:
      | 'current'
      | 'default'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'white';

    /**
     * The size of the spinner.
     * @default "md"
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * The variant of the spinner.
     * @default "default"
     */
    variant?: 'default' | 'dots' | 'gradient' | 'wave' | 'simple' | 'spinner';

    /**
     * The color of the spinner label.
     * @default "foreground"
     */
    labelColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'foreground';

    /**
     * The label of the spinner, if provided it will be used as aria-label.
     */
    label?: string;

    /**
     * Classname or List of classes to change the classNames of the element.
     * if `className` is passed, it will be added to the base slot.
     *
     * @example
     * ```ts
     * <Spinner classNames={{
     *    base:"base-classes",
     *    wrapper: "wrapper-classes",
     *    circle1: "circle1-classes",
     *    circle2: "circle2-classes",
     *    label: "label-classes"
     * }} />
     * ```
     */
    classNames?: Partial<SpinnerSlots>;
  }
  export const Spinner: React.FC<SpinnerProps>;

  // Card component
  export interface CardProps extends BaseProps {
    shadow?: boolean | 'sm' | 'md' | 'lg' | 'none';
    radius?: 'none' | 'sm' | 'md' | 'lg';
    isPressable?: boolean;
    disableAnimation?: boolean;
    disableRipple?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
    onPress?: () => void;
    key?: string | number;
  }
  export const Card: React.FC<CardProps>;

  // CardBody component
  export interface CardBodyProps extends BaseProps {
    children?: React.ReactNode;
  }
  export const CardBody: React.FC<CardBodyProps>;

  // CardHeader component
  export interface CardHeaderProps extends BaseProps {
    children?: React.ReactNode;
  }
  export const CardHeader: React.FC<CardHeaderProps>;

  // CardFooter component
  export interface CardFooterProps extends BaseProps {
    children?: React.ReactNode;
  }
  export const CardFooter: React.FC<CardFooterProps>;

  // Input component
  export interface InputProps extends BaseProps {
    label?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onValueChange?: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    disabled?: boolean;
    required?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'flat' | 'bordered' | 'underlined' | 'faded';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    labelPlacement?: 'inside' | 'outside' | 'outside-left';
    description?: string;
    errorMessage?: string;
    isInvalid?: boolean;
    isRequired?: boolean;
    isReadOnly?: boolean;
    autoComplete?: string;
    name?: string;
    'aria-labelledby'?: string;
    'aria-valuemax'?: number;
    'aria-valuemin'?: number;
    'aria-valuenow'?: number;
    'aria-valuetext'?: string;
    max?: number;
    min?: number;
    ref?: React.RefObject<HTMLInputElement>;
    maxLength?: number;
  }
  export const Input: React.FC<InputProps>;

  // Tooltip component
  export interface TooltipProps extends BaseProps {
    content: React.ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    showArrow?: boolean;
    delay?: number;
    offset?: number;
    children: React.ReactNode;
  }
  export const Tooltip: React.FC<TooltipProps>;

  // Dropdown components
  export interface DropdownProps extends BaseProps {
    children: React.ReactNode;
    placement?: string;
  }
  export const Dropdown: React.FC<DropdownProps>;

  export interface DropdownTriggerProps extends BaseProps {
    children: React.ReactNode;
  }
  export const DropdownTrigger: React.FC<DropdownTriggerProps>;

  export interface DropdownMenuProps extends BaseProps {
    children: React.ReactNode;
    'aria-label'?: string;
    onAction?: (key: string) => void;
    selectionMode?: string;
    selectedKeys?: string[];
    variant?: string;
  }
  export const DropdownMenu: React.FC<DropdownMenuProps>;

  export interface DropdownItemProps extends BaseProps {
    key?: string;
    color?: string;
    startContent?: React.ReactNode;
    onClick?: () => void;
    children: React.ReactNode;
  }
  export const DropdownItem: React.FC<DropdownItemProps>;

  // Badge component
  export interface BadgeProps extends BaseProps {
    content?: React.ReactNode;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow';
    size?: 'sm' | 'md' | 'lg';
    placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    isInvisible?: boolean;
    disableAnimation?: boolean;
    children?: React.ReactNode;
    shape?: string;
    showOutline?: boolean;
  }
  export const Badge: React.FC<BadgeProps>;

  // Chip component
  export interface ChipProps extends BaseProps {
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow';
    size?: 'sm' | 'md' | 'lg';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    children?: React.ReactNode;
  }
  export const Chip: React.FC<ChipProps>;

  // Tab components
  export interface TabsProps extends BaseProps {
    'aria-label'?: string;
    selectedKey?: string;
    defaultSelectedKey?: string;
    onSelectionChange?: (key: string) => void;
    children: React.ReactNode;
    variant?: string;
    color?: string;
    radius?: string;
  }
  export const Tabs: React.FC<TabsProps>;

  export interface TabProps extends BaseProps {
    key?: string;
    title: React.ReactNode;
    children?: React.ReactNode;
  }
  export const Tab: React.FC<TabProps>;

  // Switch component
  export interface SwitchProps extends BaseProps {
    isSelected?: boolean;
    defaultSelected?: boolean;
    onValueChange?: (isSelected: boolean) => void;
    size?: 'sm' | 'md' | 'lg';
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    thumbIcon?: React.ReactNode;
    children?: React.ReactNode;
  }
  export const Switch: React.FC<SwitchProps>;

  // Avatar component
  export interface AvatarProps extends BaseProps {
    src?: string;
    name?: string;
    showFallback?: boolean;
    fallback?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    isBordered?: boolean;
    isDisabled?: boolean;
  }
  export const Avatar: React.FC<AvatarProps>;

  // Radio component
  export interface RadioProps extends BaseProps {
    value?: string;
    name?: string;
    isSelected?: boolean;
    defaultSelected?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    size?: 'sm' | 'md' | 'lg';
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    description?: React.ReactNode;
    isDisabled?: boolean;
    isRequired?: boolean;
    children?: React.ReactNode;
  }
  export const Radio: React.FC<RadioProps>;

  // RadioGroup component
  export interface RadioGroupProps extends BaseProps {
    value?: string;
    defaultValue?: string;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    orientation?: 'horizontal' | 'vertical';
    children: React.ReactNode;
  }
  export const RadioGroup: React.FC<RadioGroupProps>;

  // Link component
  export interface LinkProps extends BaseProps {
    href?: string;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isExternal?: boolean;
    isDisabled?: boolean;
    underline?: 'none' | 'hover' | 'always' | 'active';
    children: React.ReactNode;
  }
  export const Link: React.FC<LinkProps>;

  // Navbar components
  export interface NavbarProps extends BaseProps {
    variant?: string;
    position?: 'static' | 'sticky' | 'floating';
    children: React.ReactNode;
  }
  export const Navbar: React.FC<NavbarProps>;

  export interface NavbarBrandProps extends BaseProps {
    children: React.ReactNode;
  }
  export const NavbarBrand: React.FC<NavbarBrandProps>;

  export interface NavbarContentProps extends BaseProps {
    justify?: 'start' | 'end' | 'center';
    children: React.ReactNode;
  }
  export const NavbarContent: React.FC<NavbarContentProps>;

  export interface NavbarItemProps extends BaseProps {
    isActive?: boolean;
    children: React.ReactNode;
  }
  export const NavbarItem: React.FC<NavbarItemProps>;

  export interface NavbarMenuProps extends BaseProps {
    children: React.ReactNode;
  }
  export const NavbarMenu: React.FC<NavbarMenuProps>;

  export interface NavbarMenuItemProps extends BaseProps {
    children: React.ReactNode;
  }
  export const NavbarMenuItem: React.FC<NavbarMenuItemProps>;

  export interface NavbarMenuToggleProps extends BaseProps {
    children?: React.ReactNode;
  }
  export const NavbarMenuToggle: React.FC<NavbarMenuToggleProps>;

  // Modal components
  export interface ModalProps extends BaseProps {
    isOpen?: boolean;
    onClose?: () => void;
    placement?: 'center' | 'auto' | 'top' | 'bottom' | 'top-center' | 'bottom-center';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | '5xl';
    scrollBehavior?: 'normal' | 'inside' | 'outside';
    children: React.ReactNode;
  }
  export const Modal: React.FC<ModalProps>;

  export interface ModalContentProps extends BaseProps {
    children: React.ReactNode;
  }
  export const ModalContent: React.FC<ModalContentProps>;

  export interface ModalHeaderProps extends BaseProps {
    children: React.ReactNode;
  }
  export const ModalHeader: React.FC<ModalHeaderProps>;

  export interface ModalBodyProps extends BaseProps {
    children: React.ReactNode;
  }
  export const ModalBody: React.FC<ModalBodyProps>;

  export interface ModalFooterProps extends BaseProps {
    children: React.ReactNode;
  }
  export const ModalFooter: React.FC<ModalFooterProps>;

  // Slider component
  export interface SliderProps extends BaseProps {
    value?: number | number[];
    defaultValue?: number | number[];
    onChange?: (value: number | number[]) => void;
    min?: number;
    max?: number;
    step?: number;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    hideValue?: boolean;
    isDisabled?: boolean;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    minValue?: number;
    maxValue?: number;
  }
  export const Slider: React.FC<SliderProps>;

  // Select component
  export interface SelectProps extends BaseProps {
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'flat' | 'bordered' | 'underlined' | 'faded';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    label?: string;
    labelPlacement?: 'inside' | 'outside' | 'outside-left';
    description?: string;
    errorMessage?: string;
    isInvalid?: boolean;
    isRequired?: boolean;
    isDisabled?: boolean;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    children: React.ReactNode;
  }
  export const Select: React.FC<SelectProps>;

  export interface SelectItemProps extends BaseProps {
    key?: string;
    value?: string;
    children: React.ReactNode;
  }
  export const SelectItem: React.FC<SelectItemProps>;

  // ButtonGroup component
  export interface ButtonGroupProps extends BaseProps {
    variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    isDisabled?: boolean;
    isVertical?: boolean;
    children: React.ReactNode;
  }
  export const ButtonGroup: React.FC<ButtonGroupProps>;

  // Popover components
  export interface PopoverProps extends BaseProps {
    placement?:
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'top-start'
      | 'top-end'
      | 'bottom-start'
      | 'bottom-end'
      | 'left-start'
      | 'left-end'
      | 'right-start'
      | 'right-end';
    offset?: number;
    showArrow?: boolean;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    children: React.ReactNode;
  }
  export const Popover: React.FC<PopoverProps>;

  export interface PopoverTriggerProps extends BaseProps {
    children: React.ReactNode;
  }
  export const PopoverTrigger: React.FC<PopoverTriggerProps>;

  export interface PopoverContentProps extends BaseProps {
    children: React.ReactNode;
  }
  export const PopoverContent: React.FC<PopoverContentProps>;

  // ScrollShadow component
  export interface ScrollShadowProps extends BaseProps {
    hideScrollBar?: boolean;
    orientation?: 'horizontal' | 'vertical' | 'both';
    size?: number;
    children: React.ReactNode;
  }
  export const ScrollShadow: React.FC<ScrollShadowProps>;

  // Hook for managing modal state
  export interface UseDisclosureProps {
    isOpen?: boolean;
    defaultOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
  }
  export interface UseDisclosureReturn {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
  }
  export function useDisclosure(props?: UseDisclosureProps): UseDisclosureReturn;

  // Utility function for class name management
  export function cn(...inputs: any[]): string;
}
