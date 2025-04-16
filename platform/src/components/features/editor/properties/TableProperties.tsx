import { useState } from 'react';
import {
  Tabs,
  Tab,
  Slider,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { TableData } from '@/types/editor';

interface TablePropertiesProps {
  tableData: TableData;
  onUpdateTable: (updatedData: TableData) => void;
}

export default function TableProperties({ tableData, onUpdateTable }: TablePropertiesProps) {
  const [activeTab, setActiveTab] = useState('style');

  // Handle changes to table properties
  const handlePropertyChange = <K extends keyof TableData>(property: K, value: TableData[K]) => {
    onUpdateTable({
      ...tableData,
      [property]: value,
    });
  };

  // Handle number input changes
  const handleNumberInput = (property: 'borderWidth' | 'width', value: string) => {
    const numValue = parseInt(value);

    if (!isNaN(numValue)) {
      if (property === 'borderWidth') {
        onUpdateTable({
          ...tableData,
          style: {
            ...(tableData.style || {}),
            borderWidth: numValue,
          },
        });
      } else if (property === 'width') {
        onUpdateTable({
          ...tableData,
          style: {
            ...(tableData.style || {}),
            width: numValue,
          },
        });
      }
    }
  };

  // Toggle header, footer, and other boolean options
  const toggleOption = (property: keyof TableData) => {
    handlePropertyChange(property, !tableData[property]);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 w-full">
      <Tabs
        aria-label="Table Properties"
        className="w-full"
        classNames={{
          tabList: 'bg-transparent p-0 border-b border-gray-800 mb-4',
          cursor: 'bg-indigo-500',
          tab: 'text-gray-400 data-[selected=true]:text-white',
        }}
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
      >
        <Tab
          key="style"
          title={
            <div className="flex items-center gap-1">
              <Icon icon="material-symbols:palette" width={16} />
              <span>Style</span>
            </div>
          }
        />
        <Tab
          key="layout"
          title={
            <div className="flex items-center gap-1">
              <Icon icon="material-symbols:table" width={16} />
              <span>Layout</span>
            </div>
          }
        />
        <Tab
          key="options"
          title={
            <div className="flex items-center gap-1">
              <Icon icon="material-symbols:settings" width={16} />
              <span>Options</span>
            </div>
          }
        />
      </Tabs>

      {activeTab === 'style' && (
        <div className="space-y-4">
          {/* Border Style */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="borderStyle">
              Border Style
            </label>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="w-full justify-start text-white bg-gray-800"
                  endContent={<Icon icon="material-symbols:arrow-drop-down" width={24} />}
                  id="borderStyle"
                  variant="flat"
                >
                  <div className="flex items-center">
                    <span className="capitalize">{tableData.style?.borderStyle || 'solid'}</span>
                  </div>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Border Style Options">
                <DropdownItem
                  key="solid"
                  onClick={() =>
                    onUpdateTable({
                      ...tableData,
                      style: {
                        ...(tableData.style || {}),
                        borderStyle: 'solid',
                      },
                    })
                  }
                >
                  Solid
                </DropdownItem>
                <DropdownItem
                  key="dashed"
                  onClick={() =>
                    onUpdateTable({
                      ...tableData,
                      style: {
                        ...(tableData.style || {}),
                        borderStyle: 'dashed',
                      },
                    })
                  }
                >
                  Dashed
                </DropdownItem>
                <DropdownItem
                  key="dotted"
                  onClick={() =>
                    onUpdateTable({
                      ...tableData,
                      style: {
                        ...(tableData.style || {}),
                        borderStyle: 'dotted',
                      },
                    })
                  }
                >
                  Dotted
                </DropdownItem>
                <DropdownItem
                  key="double"
                  onClick={() =>
                    onUpdateTable({
                      ...tableData,
                      style: {
                        ...(tableData.style || {}),
                        borderStyle: 'double',
                      },
                    })
                  }
                >
                  Double
                </DropdownItem>
                <DropdownItem
                  key="none"
                  onClick={() =>
                    onUpdateTable({
                      ...tableData,
                      style: {
                        ...(tableData.style || {}),
                        borderStyle: 'none',
                      },
                    })
                  }
                >
                  None
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Border Width */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="borderWidth">
              Border Width: {tableData.style?.borderWidth || 1}px
            </label>
            <div className="flex items-center gap-2">
              <Slider
                aria-valuemax={10}
                aria-valuemin={0}
                aria-valuenow={tableData.style?.borderWidth || 1}
                aria-valuetext={`${tableData.style?.borderWidth || 1} pixels`}
                className="max-w-md flex-1"
                id="borderWidth"
                maxValue={10}
                minValue={0}
                size="sm"
                step={1}
                value={tableData.style?.borderWidth || 1}
                onChange={value =>
                  onUpdateTable({
                    ...tableData,
                    style: {
                      ...(tableData.style || {}),
                      borderWidth: value as number,
                    },
                  })
                }
              />
              <Input
                aria-labelledby="borderWidth"
                className="w-20"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                max={10}
                min={0}
                size="sm"
                type="number"
                value={(tableData.style?.borderWidth || 1).toString()}
                onChange={e => handleNumberInput('borderWidth', e.target.value)}
              />
            </div>
          </div>

          {/* Border Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="borderColor">
              Border Color
            </label>
            <div className="flex items-center gap-2">
              <div
                aria-label={`Current border color: ${tableData.style?.borderColor || '#E5E7EB'}`}
                className="w-6 h-6 rounded border border-gray-600"
                role="img"
                style={{
                  backgroundColor: tableData.style?.borderColor || '#E5E7EB',
                }}
              />
              <Input
                className="flex-1"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                id="borderColor"
                placeholder="#E5E7EB"
                size="sm"
                type="text"
                value={tableData.style?.borderColor || '#E5E7EB'}
                onChange={e =>
                  onUpdateTable({
                    ...tableData,
                    style: {
                      ...(tableData.style || {}),
                      borderColor: e.target.value,
                    },
                  })
                }
              />
              <input
                aria-labelledby="borderColor"
                className="w-8 h-8 cursor-pointer bg-transparent border-0"
                type="color"
                value={tableData.style?.borderColor || '#E5E7EB'}
                onChange={e =>
                  onUpdateTable({
                    ...tableData,
                    style: {
                      ...(tableData.style || {}),
                      borderColor: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Header Background Color */}
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="headerBackground"
            >
              Header Background
            </label>
            <div className="flex items-center gap-2">
              <div
                aria-label={`Current header background color: ${tableData.style?.headerBackgroundColor || '#4F46E5'}`}
                className="w-6 h-6 rounded border border-gray-600"
                role="img"
                style={{
                  backgroundColor: tableData.style?.headerBackgroundColor || '#4F46E5',
                }}
              />
              <Input
                className="flex-1"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                id="headerBackground"
                placeholder="#4F46E5"
                size="sm"
                type="text"
                value={tableData.style?.headerBackgroundColor || '#4F46E5'}
                onChange={e =>
                  onUpdateTable({
                    ...tableData,
                    style: {
                      ...(tableData.style || {}),
                      headerBackgroundColor: e.target.value,
                    },
                  })
                }
              />
              <input
                aria-labelledby="headerBackground"
                className="w-8 h-8 cursor-pointer bg-transparent border-0"
                type="color"
                value={tableData.style?.headerBackgroundColor || '#4F46E5'}
                onChange={e =>
                  onUpdateTable({
                    ...tableData,
                    style: {
                      ...(tableData.style || {}),
                      headerBackgroundColor: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Header Text Color */}
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="headerTextColor"
            >
              Header Text Color
            </label>
            <div className="flex items-center gap-2">
              <div
                aria-label={`Current header text color: ${tableData.style?.headerTextColor || '#FFFFFF'}`}
                className="w-6 h-6 rounded border border-gray-600"
                role="img"
                style={{
                  backgroundColor: tableData.style?.headerTextColor || '#FFFFFF',
                }}
              />
              <Input
                className="flex-1"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                id="headerTextColor"
                placeholder="#FFFFFF"
                size="sm"
                type="text"
                value={tableData.style?.headerTextColor || '#FFFFFF'}
                onChange={e =>
                  onUpdateTable({
                    ...tableData,
                    style: {
                      ...(tableData.style || {}),
                      headerTextColor: e.target.value,
                    },
                  })
                }
              />
              <input
                aria-labelledby="headerTextColor"
                className="w-8 h-8 cursor-pointer bg-transparent border-0"
                type="color"
                value={tableData.style?.headerTextColor || '#FFFFFF'}
                onChange={e =>
                  onUpdateTable({
                    ...tableData,
                    style: {
                      ...(tableData.style || {}),
                      headerTextColor: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Footer Background Color */}
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="footerBackgroundColor"
            >
              Footer Background
            </label>
            <div className="flex items-center gap-2">
              <div
                aria-label={`Current footer background color: ${tableData.style?.footerBackgroundColor || '#F3F4F6'}`}
                className="w-6 h-6 rounded border border-gray-600"
                role="img"
                style={{
                  backgroundColor: tableData.style?.footerBackgroundColor || '#F3F4F6',
                }}
              />
              <Input
                className="flex-1"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                id="footerBackgroundColor"
                placeholder="#F3F4F6"
                size="sm"
                type="text"
                value={tableData.style?.footerBackgroundColor || '#F3F4F6'}
                onChange={e =>
                  onUpdateTable({
                    ...tableData,
                    style: {
                      ...(tableData.style || {}),
                      footerBackgroundColor: e.target.value,
                    },
                  })
                }
              />
              <input
                aria-labelledby="footerBackgroundColor"
                className="w-8 h-8 cursor-pointer bg-transparent border-0"
                type="color"
                value={tableData.style?.footerBackgroundColor || '#F3F4F6'}
                onChange={e =>
                  onUpdateTable({
                    ...tableData,
                    style: {
                      ...(tableData.style || {}),
                      footerBackgroundColor: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Footer Text Color */}
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="footerTextColor"
            >
              Footer Text Color
            </label>
            <div className="flex items-center gap-2">
              <div
                aria-label={`Current footer text color: ${tableData.style?.footerTextColor || '#000000'}`}
                className="w-6 h-6 rounded border border-gray-600"
                role="img"
                style={{
                  backgroundColor: tableData.style?.footerTextColor || '#000000',
                }}
              />
              <Input
                className="flex-1"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                id="footerTextColor"
                placeholder="#000000"
                size="sm"
                type="text"
                value={tableData.style?.footerTextColor || '#000000'}
                onChange={e =>
                  onUpdateTable({
                    ...tableData,
                    style: {
                      ...(tableData.style || {}),
                      footerTextColor: e.target.value,
                    },
                  })
                }
              />
              <input
                aria-labelledby="footerTextColor"
                className="w-8 h-8 cursor-pointer bg-transparent border-0"
                type="color"
                value={tableData.style?.footerTextColor || '#000000'}
                onChange={e =>
                  onUpdateTable({
                    ...tableData,
                    style: {
                      ...(tableData.style || {}),
                      footerTextColor: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="space-y-4">
          {/* Table Width */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="tableWidth">
              Table Width
            </label>
            <div className="flex items-center gap-2">
              <Input
                className="w-32"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                placeholder="100%"
                size="sm"
                type="text"
                value={tableData.style?.width?.toString() || '100%'}
                onChange={e =>
                  onUpdateTable({
                    ...tableData,
                    style: {
                      ...(tableData.style || {}),
                      width: e.target.value,
                    },
                  })
                }
              />
              <Dropdown>
                <DropdownTrigger>
                  <Button className="text-white bg-gray-800" size="sm" variant="flat">
                    <Icon icon="material-symbols:arrow-drop-down" width={24} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Width Options">
                  <DropdownItem
                    key="width-100"
                    onClick={() =>
                      onUpdateTable({
                        ...tableData,
                        style: {
                          ...(tableData.style || {}),
                          width: '100%',
                        },
                      })
                    }
                  >
                    Full width (100%)
                  </DropdownItem>
                  <DropdownItem
                    key="width-75"
                    onClick={() =>
                      onUpdateTable({
                        ...tableData,
                        style: {
                          ...(tableData.style || {}),
                          width: '75%',
                        },
                      })
                    }
                  >
                    75%
                  </DropdownItem>
                  <DropdownItem
                    key="width-50"
                    onClick={() =>
                      onUpdateTable({
                        ...tableData,
                        style: {
                          ...(tableData.style || {}),
                          width: '50%',
                        },
                      })
                    }
                  >
                    50%
                  </DropdownItem>
                  <DropdownItem
                    key="width-25"
                    onClick={() =>
                      onUpdateTable({
                        ...tableData,
                        style: {
                          ...(tableData.style || {}),
                          width: '25%',
                        },
                      })
                    }
                  >
                    25%
                  </DropdownItem>
                  <DropdownItem
                    key="width-auto"
                    onClick={() =>
                      onUpdateTable({
                        ...tableData,
                        style: {
                          ...(tableData.style || {}),
                          width: 'auto',
                        },
                      })
                    }
                  >
                    Auto
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {/* Rows and Columns */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="tableRows">
              Rows: {tableData.rows}
            </label>
            <div className="flex items-center gap-2 mb-4">
              <Slider
                aria-valuemax={20}
                aria-valuemin={1}
                aria-valuenow={tableData.rows}
                aria-valuetext={`${tableData.rows} rows`}
                className="max-w-md flex-1"
                id="tableRows"
                maxValue={20}
                minValue={1}
                size="sm"
                step={1}
                value={tableData.rows}
                onChange={value => handlePropertyChange('rows', value as number)}
              />
              <Input
                aria-labelledby="tableRows"
                className="w-20"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                max={50}
                min={1}
                size="sm"
                type="number"
                value={tableData.rows.toString()}
                onChange={e => {
                  const value = parseInt(e.target.value);

                  if (!isNaN(value) && value > 0) {
                    handlePropertyChange('rows', value);
                  }
                }}
              />
            </div>

            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="tableColumns">
              Columns: {tableData.columns}
            </label>
            <div className="flex items-center gap-2">
              <Slider
                aria-valuemax={20}
                aria-valuemin={1}
                aria-valuenow={tableData.columns}
                aria-valuetext={`${tableData.columns} columns`}
                className="max-w-md flex-1"
                id="tableColumns"
                maxValue={20}
                minValue={1}
                size="sm"
                step={1}
                value={tableData.columns}
                onChange={value => handlePropertyChange('columns', value as number)}
              />
              <Input
                aria-labelledby="tableColumns"
                className="w-20"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                max={50}
                min={1}
                size="sm"
                type="number"
                value={tableData.columns.toString()}
                onChange={e => {
                  const value = parseInt(e.target.value);

                  if (!isNaN(value) && value > 0) {
                    handlePropertyChange('columns', value);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'options' && (
        <div className="space-y-4">
          {/* Header, Footer and other options */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                checked={tableData.hasHeader || false}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                id="hasHeader"
                type="checkbox"
                onChange={() => toggleOption('hasHeader')}
              />
              <label className="text-gray-300" htmlFor="hasHeader">
                Header row
              </label>
            </div>

            <div className="flex items-center">
              <input
                checked={tableData.hasHeaderColumn || false}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                id="hasHeaderColumn"
                type="checkbox"
                onChange={() => toggleOption('hasHeaderColumn')}
              />
              <label className="text-gray-300" htmlFor="hasHeaderColumn">
                Header column
              </label>
            </div>

            <div className="flex items-center">
              <input
                checked={tableData.hasFooter || false}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                id="hasFooter"
                type="checkbox"
                onChange={() => toggleOption('hasFooter')}
              />
              <label className="text-gray-300" htmlFor="hasFooter">
                Footer row
              </label>
            </div>

            <div className="flex items-center">
              <input
                checked={tableData.alternatingRows || false}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                id="alternatingRows"
                type="checkbox"
                onChange={() => toggleOption('alternatingRows')}
              />
              <label className="text-gray-300" htmlFor="alternatingRows">
                Alternating row colors
              </label>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Preview</h3>
            <div aria-label="Table preview" className="bg-gray-800 p-3 rounded-lg" role="region">
              <div className="overflow-auto max-h-48">
                <table
                  aria-label="Table preview"
                  className="border-collapse w-full"
                  style={{
                    borderCollapse: 'collapse',
                    border: `${tableData.style?.borderWidth || 1}px ${tableData.style?.borderStyle || 'solid'} ${tableData.style?.borderColor || '#E5E7EB'}`,
                  }}
                >
                  <tbody>
                    {Array.from({ length: Math.min(5, tableData.rows) }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        {Array.from({
                          length: Math.min(5, tableData.columns),
                        }).map((_, colIndex) => {
                          const isHeader = tableData.hasHeader && rowIndex === 0;
                          const isHeaderColumn =
                            tableData.hasHeaderColumn && colIndex === 0 && rowIndex !== 0;
                          const isFooter =
                            tableData.hasFooter && rowIndex === Math.min(4, tableData.rows - 1);
                          const isAlternating =
                            tableData.alternatingRows &&
                            ((rowIndex % 2 === 1 && !tableData.hasHeader) ||
                              (rowIndex % 2 === 0 && tableData.hasHeader && rowIndex !== 0));

                          return (
                            <td
                              key={colIndex}
                              className="px-3 py-2 text-xs"
                              style={{
                                border: `${tableData.style?.borderWidth || 1}px ${tableData.style?.borderStyle || 'solid'} ${tableData.style?.borderColor || '#E5E7EB'}`,
                                backgroundColor: isHeader
                                  ? tableData.style?.headerBackgroundColor || '#4F46E5'
                                  : isHeaderColumn
                                    ? tableData.style?.headerBackgroundColor || '#4F46E5'
                                    : isFooter
                                      ? tableData.style?.footerBackgroundColor || '#F3F4F6'
                                      : isAlternating
                                        ? '#F9FAFB'
                                        : '',
                                color: isHeader
                                  ? tableData.style?.headerTextColor || '#FFFFFF'
                                  : isHeaderColumn
                                    ? tableData.style?.headerTextColor || '#FFFFFF'
                                    : isFooter
                                      ? tableData.style?.footerTextColor || '#000000'
                                      : '',
                                fontWeight:
                                  isHeader || isHeaderColumn || isFooter ? 'bold' : 'normal',
                              }}
                            >
                              {isHeader
                                ? `Header ${colIndex + 1}`
                                : isHeaderColumn
                                  ? `Row ${rowIndex}`
                                  : isFooter
                                    ? `Footer ${colIndex + 1}`
                                    : `Cell ${rowIndex},${colIndex}`}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
