// src/app/dashboard/create/editor/page.tsx
"use client";

import { EditorContainer, ErrorBoundary } from "@/components/features/application/editor";

export default function PresentationEditorPage() {
  return (
    <ErrorBoundary id="presentation-editor">
      <EditorContainer />
    </ErrorBoundary>
  );
}
