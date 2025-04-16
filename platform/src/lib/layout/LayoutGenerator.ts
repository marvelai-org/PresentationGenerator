import { ConstraintLayoutEngine } from './ConstraintLayoutEngine';
import { LAYOUT_PRESETS, LayoutPreset } from './LayoutPresets';
import { Bounds, ConstraintElement } from './index';

export interface GeneratedLayout {
  layoutName: string;
  elements: Array<{
    id: string;
    type: string;
    bounds: Bounds;
    zIndex: number;
  }>;
}

export class LayoutGenerator {
  private layoutEngine: ConstraintLayoutEngine;
  
  constructor() {
    this.layoutEngine = new ConstraintLayoutEngine();
  }
  
  /**
   * Generates a layout based on a preset and canvas dimensions
   */
  generateLayout(
    presetKey: string, 
    canvasWidth: number, 
    canvasHeight: number
  ): GeneratedLayout {
    const preset = LAYOUT_PRESETS[presetKey];
    
    if (!preset) {
      throw new Error(`Layout preset "${presetKey}" not found`);
    }
    
    const calculatedLayout = this.layoutEngine.calculateLayout(
      preset.elements,
      canvasWidth,
      canvasHeight
    );
    
    return {
      layoutName: preset.name,
      elements: calculatedLayout.map(element => ({
        id: element.id,
        type: element.type,
        bounds: element.bounds,
        zIndex: element.constraints.zIndex || 1
      }))
    };
  }
  
  /**
   * Generates a custom layout based on provided constraint elements
   */
  generateCustomLayout(
    elements: ConstraintElement[],
    canvasWidth: number,
    canvasHeight: number
  ): GeneratedLayout {
    const calculatedLayout = this.layoutEngine.calculateLayout(
      elements,
      canvasWidth,
      canvasHeight
    );
    
    return {
      layoutName: 'Custom Layout',
      elements: calculatedLayout.map(element => ({
        id: element.id,
        type: element.type,
        bounds: element.bounds,
        zIndex: element.constraints.zIndex || 1
      }))
    };
  }
  
  /**
   * Returns all available layout presets
   */
  getAvailablePresets(): Array<{ key: string; name: string; description: string; }> {
    return Object.entries(LAYOUT_PRESETS).map(([key, preset]) => ({
      key,
      name: preset.name,
      description: preset.description
    }));
  }
  
  /**
   * Returns a specific layout preset
   */
  getPreset(presetKey: string): LayoutPreset | null {
    return LAYOUT_PRESETS[presetKey] || null;
  }
  
  /**
   * Creates a copy of a preset that can be customized
   */
  clonePreset(presetKey: string): ConstraintElement[] {
    const preset = LAYOUT_PRESETS[presetKey];
    
    if (!preset) {
      throw new Error(`Layout preset "${presetKey}" not found`);
    }
    
    // Deep clone the preset elements
    return JSON.parse(JSON.stringify(preset.elements));
  }
} 