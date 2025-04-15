declare module '@heroui/system/src/types' {
  // Define the SpinnerVariants interface
  export interface SpinnerVariants {
    size?: 'sm' | 'md' | 'lg';
    color?:
      | 'current'
      | 'default'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'white';
    labelColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'foreground';
    variant?: 'default' | 'dots' | 'gradient' | 'wave' | 'simple' | 'spinner';
  }

  // Define other common types that might be used
  export type NormalSizes = 'sm' | 'md' | 'lg';
  export type ThemeColors = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}
