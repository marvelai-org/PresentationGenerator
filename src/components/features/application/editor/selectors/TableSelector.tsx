"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";

import CommandMenuModal from "../CommandMenuModal";

// Define basic table templates
const tableTemplates = [
  {
    id: "basic",
    name: "Basic Table",
    description: "Simple table with equal-sized cells",
    rows: 3,
    columns: 4,
    thumbnail: "/templates/table-basic.png",
  },
  {
    id: "header",
    name: "With Header",
    description: "Table with styled header row",
    rows: 4,
    columns: 4,
    hasHeader: true,
    thumbnail: "/templates/table-header.png",
  },
  {
    id: "header-column",
    name: "Header Row & Column",
    description: "Table with styled header row and first column",
    rows: 4,
    columns: 4,
    hasHeader: true,
    hasHeaderColumn: true,
    thumbnail: "/templates/table-header-column.png",
  },
  {
    id: "footer",
    name: "With Footer",
    description: "Table with header and footer rows",
    rows: 5,
    columns: 4,
    hasHeader: true,
    hasFooter: true,
    thumbnail: "/templates/table-footer.png",
  },
  {
    id: "highlight-alt",
    name: "Alternating Rows",
    description: "Table with alternating row colors",
    rows: 5,
    columns: 4,
    alternatingRows: true,
    thumbnail: "/templates/table-alternating.png",
  },
];

export interface TableOptions {
  rows: number;
  columns: number;
  hasHeader?: boolean;
  hasFooter?: boolean;
  hasHeaderColumn?: boolean;
  alternatingRows?: boolean;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  bodyBackgroundColor?: string;
  bodyTextColor?: string;
  footerBackgroundColor?: string;
  footerTextColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
}

interface TableSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tableOptions: TableOptions) => void;
}

export default function TableSelector({
  isOpen,
  onClose,
  onSelect,
}: TableSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(4);
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [customTableOptions, setCustomTableOptions] = useState<TableOptions>({
    rows: 3,
    columns: 4,
    hasHeader: false,
    hasFooter: false,
    hasHeaderColumn: false,
    alternatingRows: false,
    headerBackgroundColor: "#4F46E5", // Indigo
    headerTextColor: "#FFFFFF",
    bodyBackgroundColor: "#FFFFFF",
    bodyTextColor: "#000000",
    footerBackgroundColor: "#F3F4F6", // Light gray
    footerTextColor: "#000000",
    borderColor: "#E5E7EB", // Gray-200
    borderWidth: 1,
    borderStyle: "solid",
  });

  // Reset to initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTemplate(null);
      setRows(3);
      setColumns(4);
      setHoveredCell(null);
    }
  }, [isOpen]);

  // Update custom table options when rows or columns change
  useEffect(() => {
    setCustomTableOptions((prev) => ({
      ...prev,
      rows,
      columns,
    }));
  }, [rows, columns]);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = tableTemplates.find((t) => t.id === templateId);

    if (template) {
      setRows(template.rows);
      setColumns(template.columns);

      setCustomTableOptions((prev) => ({
        ...prev,
        rows: template.rows,
        columns: template.columns,
        hasHeader: template.hasHeader || false,
        hasFooter: template.hasFooter || false,
        hasHeaderColumn: template.hasHeaderColumn || false,
        alternatingRows: template.alternatingRows || false,
      }));
    }
  };

  // Handle option changes
  const handleOptionChange = (option: keyof TableOptions, value: any) => {
    setCustomTableOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  // Handle interactive table size selection
  const handleTableSizeHover = (row: number, col: number) => {
    setHoveredCell({ row, col });
    setRows(row + 1);
    setColumns(col + 1);
  };

  // Create and select table
  const handleCreateTable = () => {
    onSelect(customTableOptions);
    onClose();
  };

  const renderTemplatesTab = () => (
    <div className="p-4 grid grid-cols-2 gap-4">
      {tableTemplates
        .filter(
          (template) =>
            !searchTerm ||
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        )
        .map((template) => (
          <div
            key={template.id}
            className={`
              bg-content1 p-3 rounded-lg cursor-pointer border-2 transition-all
              ${selectedTemplate === template.id ? "border-primary" : "border-transparent hover:border-default-300"}
            `}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <div className="bg-content2 h-28 rounded-md flex items-center justify-center mb-3">
              {/* Template preview - would be an image in production */}
              <div className="w-4/5 h-4/5 bg-content3 rounded flex flex-col">
                {Array.from({ length: Math.min(4, template.rows) }).map(
                  (_, rowIndex) => (
                    <div key={rowIndex} className="flex flex-1">
                      {Array.from({
                        length: Math.min(4, template.columns),
                      }).map((_, colIndex) => (
                        <div
                          key={colIndex}
                          className={`
                          flex-1 border border-default-200
                          ${template.hasHeader && rowIndex === 0 ? "bg-primary text-white" : ""}
                          ${template.hasHeaderColumn && colIndex === 0 && rowIndex !== 0 ? "bg-primary-400" : ""}
                          ${template.hasFooter && rowIndex === Math.min(3, template.rows - 1) ? "bg-default-200" : ""}
                          ${template.alternatingRows && rowIndex % 2 === 1 ? "bg-default-100" : ""}
                        `}
                        />
                      ))}
                    </div>
                  ),
                )}
              </div>
            </div>
            <h3 className="text-default-900 font-medium">{template.name}</h3>
            <p className="text-default-500 text-sm">{template.description}</p>
          </div>
        ))}
    </div>
  );

  const renderCustomTab = () => (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-default-900 font-medium mb-2">Table Size</h3>
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-10 gap-1 mb-2">
              {Array.from({ length: 10 }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-1">
                  {Array.from({ length: 10 }).map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className={`
                        w-6 h-6 rounded-sm border transition-colors cursor-pointer
                        ${
                          rowIndex <= (hoveredCell?.row || -1) &&
                          colIndex <= (hoveredCell?.col || -1)
                            ? "bg-primary border-primary-600"
                            : "bg-content2 border-default-300 hover:bg-content3"
                        }
                      `}
                      onMouseEnter={() =>
                        handleTableSizeHover(rowIndex, colIndex)
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="text-default-600 text-sm">
              {rows} × {columns}
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <label className="text-default-600 text-sm block mb-1">
                Rows
              </label>
              <Input
                classNames={{
                  input: "bg-content1 text-default-900",
                  inputWrapper: "bg-content1 data-[hover=true]:bg-content2",
                }}
                max={20}
                min={1}
                type="number"
                value={rows.toString()}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <label className="text-default-600 text-sm block mb-1">
                Columns
              </label>
              <Input
                classNames={{
                  input: "bg-content1 text-default-900",
                  inputWrapper: "bg-content1 data-[hover=true]:bg-content2",
                }}
                max={20}
                min={1}
                type="number"
                value={columns.toString()}
                onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-default-900 font-medium mb-3">Table Options</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              checked={customTableOptions.hasHeader}
              className="rounded border-default-300"
              id="hasHeader"
              type="checkbox"
              onChange={(e) =>
                handleOptionChange("hasHeader", e.target.checked)
              }
            />
            <label className="text-default-700" htmlFor="hasHeader">
              Header Row
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              checked={customTableOptions.hasHeaderColumn}
              className="rounded border-default-300"
              id="hasHeaderColumn"
              type="checkbox"
              onChange={(e) =>
                handleOptionChange("hasHeaderColumn", e.target.checked)
              }
            />
            <label className="text-default-700" htmlFor="hasHeaderColumn">
              Header Column
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              checked={customTableOptions.hasFooter}
              className="rounded border-default-300"
              id="hasFooter"
              type="checkbox"
              onChange={(e) =>
                handleOptionChange("hasFooter", e.target.checked)
              }
            />
            <label className="text-default-700" htmlFor="hasFooter">
              Footer Row
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              checked={customTableOptions.alternatingRows}
              className="rounded border-default-300"
              id="alternatingRows"
              type="checkbox"
              onChange={(e) =>
                handleOptionChange("alternatingRows", e.target.checked)
              }
            />
            <label className="text-default-700" htmlFor="alternatingRows">
              Alternating Rows
            </label>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-default-900 font-medium mb-3">Border</h3>
        <div className="flex gap-8">
          <div className="flex-1">
            <label className="text-default-600 text-sm block mb-1">Style</label>
            <select
              className="w-full rounded-md bg-content1 border border-default-300 p-2 text-default-900"
              value={customTableOptions.borderStyle}
              onChange={(e) =>
                handleOptionChange("borderStyle", e.target.value)
              }
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-default-600 text-sm block mb-1">Width</label>
            <Input
              classNames={{
                input: "bg-content1 text-default-900",
                inputWrapper: "bg-content1 data-[hover=true]:bg-content2",
              }}
              max={10}
              min={0}
              type="number"
              value={customTableOptions.borderWidth?.toString()}
              onChange={(e) =>
                handleOptionChange("borderWidth", parseInt(e.target.value) || 0)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewTab = () => (
    <div className="p-4">
      <div className="bg-content1 p-6 rounded-lg">
        <div className="overflow-x-auto">
          <table
            className="w-full"
            style={{
              borderCollapse: "collapse",
              borderSpacing: 0,
              borderWidth: `${customTableOptions.borderWidth}px`,
              borderStyle: customTableOptions.borderStyle || "solid",
              borderColor: customTableOptions.borderColor,
            }}
          >
            {customTableOptions.hasHeader && (
              <thead>
                <tr
                  style={{
                    backgroundColor: customTableOptions.headerBackgroundColor,
                    color: customTableOptions.headerTextColor,
                  }}
                >
                  {Array.from({ length: customTableOptions.columns }).map(
                    (_, index) => (
                      <th
                        key={index}
                        style={{
                          padding: "12px",
                          borderWidth: `${customTableOptions.borderWidth}px`,
                          borderStyle:
                            customTableOptions.borderStyle || "solid",
                          borderColor: customTableOptions.borderColor,
                        }}
                      >
                        {index === 0 && customTableOptions.hasHeaderColumn
                          ? "Header"
                          : `Column ${index + 1}`}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
            )}
            <tbody>
              {Array.from({
                length:
                  customTableOptions.rows -
                  (customTableOptions.hasHeader ? 1 : 0) -
                  (customTableOptions.hasFooter ? 1 : 0),
              }).map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    backgroundColor:
                      customTableOptions.alternatingRows && rowIndex % 2 === 1
                        ? customTableOptions.footerBackgroundColor
                        : customTableOptions.bodyBackgroundColor,
                    color: customTableOptions.bodyTextColor,
                  }}
                >
                  {Array.from({ length: customTableOptions.columns }).map(
                    (_, colIndex) => (
                      <td
                        key={colIndex}
                        style={{
                          padding: "12px",
                          backgroundColor:
                            colIndex === 0 && customTableOptions.hasHeaderColumn
                              ? customTableOptions.headerBackgroundColor
                              : undefined,
                          color:
                            colIndex === 0 && customTableOptions.hasHeaderColumn
                              ? customTableOptions.headerTextColor
                              : undefined,
                          borderWidth: `${customTableOptions.borderWidth}px`,
                          borderStyle:
                            customTableOptions.borderStyle || "solid",
                          borderColor: customTableOptions.borderColor,
                        }}
                      >
                        {colIndex === 0 && customTableOptions.hasHeaderColumn
                          ? `Row ${rowIndex + 1}`
                          : "Cell"}
                      </td>
                    ),
                  )}
                </tr>
              ))}
              {customTableOptions.hasFooter && (
                <tr
                  style={{
                    backgroundColor: customTableOptions.footerBackgroundColor,
                    color: customTableOptions.footerTextColor,
                  }}
                >
                  {Array.from({ length: customTableOptions.columns }).map(
                    (_, index) => (
                      <td
                        key={index}
                        style={{
                          padding: "12px",
                          fontWeight: "bold",
                          borderWidth: `${customTableOptions.borderWidth}px`,
                          borderStyle:
                            customTableOptions.borderStyle || "solid",
                          borderColor: customTableOptions.borderColor,
                        }}
                      >
                        {index === 0 && customTableOptions.hasHeaderColumn
                          ? "Footer"
                          : `Footer ${index + 1}`}
                      </td>
                    ),
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button color="primary" onPress={handleCreateTable}>
          Insert Table
        </Button>
      </div>
    </div>
  );

  const tabs = [
    {
      key: "templates",
      title: "Templates",
      icon: "material-symbols:dashboard",
      content: renderTemplatesTab(),
    },
    {
      key: "custom",
      title: "Custom",
      icon: "material-symbols:edit-square",
      content: renderCustomTab(),
    },
    {
      key: "preview",
      title: "Preview",
      icon: "material-symbols:preview",
      content: renderPreviewTab(),
    },
  ];

  return (
    <CommandMenuModal
      isOpen={isOpen}
      modalSize="3xl"
      searchPlaceholder="Search table templates..."
      tabs={tabs}
      title="Insert Table"
      onClose={onClose}
      onSearch={setSearchTerm}
    />
  );
}
