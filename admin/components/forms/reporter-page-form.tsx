"use client";

import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor, type NodeViewProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import { NodeSelection } from "@tiptap/pm/state";
import { Button } from "@/components/ui/button";

type PageTemplateType = "frontend-header" | "frontend-footer" | "header-menu" | "custom";

type ReporterPageFormProps = {
  authorName?: string;
  onSuccess?: () => void;
  postToEdit?: {
    id: string;
    title: string;
    slug: string;
    templateType: PageTemplateType;
    menuLabel?: string;
    content: string;
    isPublished: boolean;
  } | null;
  onCancelEdit?: () => void;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
const backendOrigin = backendUrl.replace(/\/api$/, "");
const imageSizePresets = [25, 50, 75, 100] as const;
const imageAlignPresets = ["left", "center", "right"] as const;
const MAX_RECENT_COLORS = 8;

type ImageAlign = (typeof imageAlignPresets)[number];

const templateLabels: Record<PageTemplateType, string> = {
  "frontend-header": "Frontend Header Page",
  "frontend-footer": "Frontend Footer Page",
  "header-menu": "Header Menu Page",
  custom: "Custom Page",
};

const createSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const readFileAsDataUrl = async (file: File): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read image file"));
    reader.readAsDataURL(file);
  });

const editorButtonClass =
  "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700";

const iconToolbarButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700";

const iconToolbarButtonActiveClass = "border-sky-300 bg-sky-50 text-sky-700";

const colorPresets = [
  { label: "Slate", value: "#0f172a", className: "bg-slate-900" },
  { label: "Teal", value: "#0f766e", className: "bg-teal-700" },
  { label: "Blue", value: "#2563eb", className: "bg-blue-600" },
  { label: "Purple", value: "#9333ea", className: "bg-violet-600" },
  { label: "Red", value: "#dc2626", className: "bg-red-600" },
  { label: "Orange", value: "#ea580c", className: "bg-orange-600" },
];

const highlightPresets = [
  { label: "Yellow", value: "#fef08a", className: "bg-yellow-200" },
  { label: "Amber", value: "#fde68a", className: "bg-amber-200" },
  { label: "Orange", value: "#fdba74", className: "bg-orange-300" },
  { label: "Pink", value: "#f9a8d4", className: "bg-pink-300" },
  { label: "Blue", value: "#bfdbfe", className: "bg-blue-200" },
];

function ResizableImageNodeView({ node, selected, updateAttributes }: NodeViewProps) {
  const [isResizing, setIsResizing] = useState(false);

  const width = typeof node.attrs.width === "number" ? node.attrs.width : 100;
  const align = ((node.attrs.align as ImageAlign | undefined) || "center") as ImageAlign;

  const startResize = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsResizing(true);
    const startX = event.clientX;
    const startWidth = width;

    const imageElement = event.currentTarget.closest("[data-image-wrapper]") as HTMLElement | null;
    const editorRoot = imageElement?.closest(".tiptap-editor") as HTMLElement | null;
    const editorWidth = Math.max(editorRoot?.clientWidth || 800, 320);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const widthDeltaPercent = (deltaX / editorWidth) * 100;
      const nextWidth = Math.round(Math.max(10, Math.min(100, startWidth + widthDeltaPercent)));
      updateAttributes({ width: nextWidth });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const wrapperStyle: React.CSSProperties = {
    width: `${width}%`,
    maxWidth: "100%",
    position: "relative",
    display: align === "center" ? "block" : "inline-block",
    float: align === "center" ? "none" : align,
    margin: align === "left" ? "0.25rem 1rem 0.5rem 0" : align === "right" ? "0.25rem 0 0.5rem 1rem" : "0.75rem auto",
  };

  return (
    <NodeViewWrapper as="span" data-image-wrapper style={wrapperStyle} className="resizable-image-node">
      <img
        src={node.attrs.src as string}
        alt={(node.attrs.alt as string) || ""}
        title={(node.attrs.title as string) || ""}
        draggable={false}
        className={`block h-auto w-full rounded-xl ${selected ? "ring-2 ring-sky-400" : ""}`}
      />

      {selected ? (
        <>
          <span className="pointer-events-none absolute left-2 top-2 rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {width}%
          </span>
          <button
            type="button"
            aria-label="Resize image"
            title="Drag to resize image"
            onMouseDown={startResize}
            className={`absolute bottom-1 right-1 h-4 w-4 cursor-se-resize rounded-sm border border-white bg-sky-500 shadow ${isResizing ? "scale-110" : ""}`}
          />
        </>
      ) : null}
    </NodeViewWrapper>
  );
}

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const htmlElement = element as HTMLElement;
          const widthSource = htmlElement.getAttribute("data-width") || htmlElement.style.width || htmlElement.getAttribute("width");

          if (!widthSource) {
            return null;
          }

          const parsed = Number.parseFloat(widthSource.toString().replace("%", ""));
          return Number.isFinite(parsed) ? parsed : null;
        },
        renderHTML: (attributes) => {
          if (typeof attributes.width !== "number") {
            return {};
          }

          return {
            "data-width": attributes.width,
            style: `width: ${attributes.width}%; height: auto;`,
          };
        },
      },
      align: {
        default: "center",
        parseHTML: (element) => {
          const htmlElement = element as HTMLElement;
          const attrAlign = htmlElement.getAttribute("data-align");

          if (attrAlign === "left" || attrAlign === "right" || attrAlign === "center") {
            return attrAlign;
          }

          const floatValue = htmlElement.style.float;
          if (floatValue === "left" || floatValue === "right") {
            return floatValue;
          }

          return "center";
        },
        renderHTML: (attributes) => {
          const alignValue = attributes.align as ImageAlign | undefined;
          const widthValue = typeof attributes.width === "number" ? `${attributes.width}%` : "100%";
          const align = alignValue || "center";

          const styleMap: Record<ImageAlign, string> = {
            left: `float: left; margin: 0.25rem 1rem 0.5rem 0; width: ${widthValue}; height: auto;`,
            right: `float: right; margin: 0.25rem 0 0.5rem 1rem; width: ${widthValue}; height: auto;`,
            center: `display: block; margin: 0.75rem auto; width: ${widthValue}; height: auto; float: none;`,
          };

          return {
            "data-align": align,
            style: styleMap[align],
          };
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNodeView);
  },
});

type ToolbarIconButtonProps = {
  title: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

function ToolbarIconButton({ title, onClick, active = false, disabled = false, children }: ToolbarIconButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`${iconToolbarButtonClass} ${active ? iconToolbarButtonActiveClass : ""} ${disabled ? "opacity-60" : ""}`}
    >
      {children}
    </button>
  );
}

export function ReporterPageForm({ authorName = "Reporter", onSuccess, postToEdit = null, onCancelEdit }: ReporterPageFormProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [templateType, setTemplateType] = useState<PageTemplateType>("custom");
  const [menuLabel, setMenuLabel] = useState("");
  const [submitIntent, setSubmitIntent] = useState<"draft" | "published">("draft");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [selectedImageWidth, setSelectedImageWidth] = useState<number | null>(null);
  const [selectedImageAlign, setSelectedImageAlign] = useState<ImageAlign>("center");
  const [customImageWidth, setCustomImageWidth] = useState<number>(100);
  const [recentTextColors, setRecentTextColors] = useState<string[]>([]);
  const [recentHighlightColors, setRecentHighlightColors] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isHeaderMenu = templateType === "header-menu";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlock,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Highlight.configure({ multicolor: true }),
      ResizableImage.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: "Write your page content here... Add headings, links, media, and sections.",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "tiptap-editor prose prose-slate max-w-none min-h-[320px] rounded-b-2xl border border-t-0 border-slate-200 bg-slate-50 px-4 py-4 outline-none",
      },
    },
    immediatelyRender: false,
  });

  const syncSelectedImageState = useCallback(() => {
    if (!editor) {
      return;
    }

    const { selection } = editor.state;

    if (selection instanceof NodeSelection && selection.node.type.name === "image") {
      setIsImageSelected(true);
      const width = (selection.node.attrs.width as number | null) ?? null;
      const align = (selection.node.attrs.align as ImageAlign | undefined) || "center";
      setSelectedImageWidth(width);
      setSelectedImageAlign(align);
      setCustomImageWidth(width ?? 100);
      return;
    }

    setIsImageSelected(false);
    setSelectedImageWidth(null);
  }, [editor]);

  const contentHtml = editor?.getHTML() || "";
  const contentText = useMemo(() => {
    const text = editor?.getText() || "";
    return text.trim();
  }, [editor, contentHtml]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    syncSelectedImageState();
    editor.on("selectionUpdate", syncSelectedImageState);
    editor.on("update", syncSelectedImageState);

    return () => {
      editor.off("selectionUpdate", syncSelectedImageState);
      editor.off("update", syncSelectedImageState);
    };
  }, [editor, syncSelectedImageState]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (!postToEdit) {
      return;
    }

    setTitle(postToEdit.title || "");
    setSlug(postToEdit.slug || createSlug(postToEdit.title || ""));
    setTemplateType(postToEdit.templateType || "custom");
    setMenuLabel(postToEdit.menuLabel || "");
    setSubmitIntent(postToEdit.isPublished ? "published" : "draft");
    editor.commands.setContent(postToEdit.content || "");
    setMessage(null);
  }, [editor, postToEdit]);

  const resetForm = useCallback(() => {
    setTitle("");
    setSlug("");
    setTemplateType("custom");
    setMenuLabel("");
    setSubmitIntent("draft");
    setMessage(null);
    editor?.commands.setContent("");
  }, [editor]);

  const uploadImageData = async (imageData: string, fileName: string, mimeType: string): Promise<string> => {
    const response = await fetch(`${backendUrl}/uploads/image`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageData, fileName, mimeType }),
    });

    const data = (await response.json().catch(() => null)) as { message?: string; url?: string } | null;

    if (!response.ok || !data?.url) {
      throw new Error(data?.message || "Image upload failed");
    }

    return data.url.startsWith("http") ? data.url : `${backendOrigin}${data.url}`;
  };

  const handleEditorImageUpload = useCallback(() => {
    if (!editor) {
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }

      setUploadingImage(true);

      try {
        const dataUrl = await readFileAsDataUrl(file);
        const absoluteUrl = await uploadImageData(dataUrl, file.name, file.type);
        editor
          .chain()
          .focus()
          .setImage({ src: absoluteUrl, alt: file.name, width: 100 })
          .updateAttributes("image", { align: "center" })
          .run();
      } catch (error) {
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Image upload failed",
        });
      } finally {
        setUploadingImage(false);
      }
    };

    input.click();
  }, [editor]);

  const handleSetLink = useCallback(() => {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl || "https://");

    if (url === null) {
      return;
    }

    const trimmed = url.trim();

    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  }, [editor]);

  const handleUnsetLink = useCallback(() => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
  }, [editor]);

  const handleInsertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const handleDeleteTable = useCallback(() => {
    editor?.chain().focus().deleteTable().run();
  }, [editor]);

  const rememberRecentTextColor = useCallback((color: string) => {
    const normalized = color.toLowerCase();
    setRecentTextColors((previous) => [normalized, ...previous.filter((item) => item !== normalized)].slice(0, MAX_RECENT_COLORS));
  }, []);

  const rememberRecentHighlightColor = useCallback((color: string) => {
    const normalized = color.toLowerCase();
    setRecentHighlightColors((previous) => [normalized, ...previous.filter((item) => item !== normalized)].slice(0, MAX_RECENT_COLORS));
  }, []);

  const handleColorPick = useCallback(
    (color: string) => {
      editor?.chain().focus().setColor(color).run();
      rememberRecentTextColor(color);
    },
    [editor, rememberRecentTextColor]
  );

  const handleHighlightPick = useCallback(
    (color: string) => {
      editor?.chain().focus().setHighlight({ color }).run();
      rememberRecentHighlightColor(color);
    },
    [editor, rememberRecentHighlightColor]
  );

  const handleCustomTextColorChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const color = event.target.value;
      editor?.chain().focus().setColor(color).run();
      rememberRecentTextColor(color);
    },
    [editor, rememberRecentTextColor]
  );

  const handleCustomHighlightColorChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const color = event.target.value;
      editor?.chain().focus().setHighlight({ color }).run();
      rememberRecentHighlightColor(color);
    },
    [editor, rememberRecentHighlightColor]
  );

  const handleImageResize = useCallback(
    (width: number | null) => {
      if (!editor || !isImageSelected) {
        return;
      }

      editor
        .chain()
        .focus()
        .updateAttributes("image", {
          width,
        })
        .run();

      setSelectedImageWidth(width);
      if (typeof width === "number") {
        setCustomImageWidth(width);
      }
    },
    [editor, isImageSelected]
  );

  const handleImageAlign = useCallback(
    (align: ImageAlign) => {
      if (!editor || !isImageSelected) {
        return;
      }

      editor
        .chain()
        .focus()
        .updateAttributes("image", {
          align,
        })
        .run();

      setSelectedImageAlign(align);
    },
    [editor, isImageSelected]
  );

  const handleCustomImageWidthChange = useCallback(
    (nextWidth: number) => {
      const normalized = Math.max(10, Math.min(100, nextWidth));
      setCustomImageWidth(normalized);
      handleImageResize(normalized);
    },
    [handleImageResize]
  );

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextTitle = event.target.value;
    setTitle(nextTitle);
    setSlug(createSlug(nextTitle));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editor) {
      setMessage({ type: "error", text: "Editor not ready yet" });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const isDraft = submitIntent === "draft";

    try {
      const endpoint = postToEdit ? `${backendUrl}/pages/${postToEdit.id}` : `${backendUrl}/pages`;
      const method = postToEdit ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug: slug || createSlug(title),
          templateType,
          menuLabel: isHeaderMenu && menuLabel.trim() ? menuLabel.trim() : undefined,
          content: editor.getHTML(),
          isPublished: !isDraft,
        }),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to create page");
      }

      setMessage({
        type: "success",
        text: postToEdit
          ? isDraft
            ? "Page draft updated successfully."
            : "Page updated and published successfully."
          : isDraft
            ? "Page draft saved successfully."
            : "Page published successfully.",
      });

      if (!postToEdit) {
        resetForm();
      } else {
        onCancelEdit?.();
      }

      onSuccess?.();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="space-y-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 lg:p-8"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">TipTap</span>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Draft ready</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Publish ready</span>
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-950">{postToEdit ? "Edit page" : "New page"}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Publishing as <span className="font-semibold">{authorName}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="title">
            Page title
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
            id="title"
            maxLength={120}
            name="title"
            onChange={handleTitleChange}
            placeholder="Write page title"
            value={title}
            required
          />
          <p className="mt-1 text-xs text-slate-500">Slug: {slug || "will-be-generated"}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="templateType">
              Template type
            </label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
              id="templateType"
              value={templateType}
              onChange={(event) => setTemplateType(event.target.value as PageTemplateType)}
            >
              {(Object.keys(templateLabels) as PageTemplateType[]).map((type) => (
                <option key={type} value={type}>
                  {templateLabels[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="slug">
              Page slug
            </label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
              id="slug"
              name="slug"
              onChange={(event) => setSlug(createSlug(event.target.value))}
              placeholder="Auto-generated from title"
              value={slug}
            />
          </div>
        </div>

        {isHeaderMenu ? (
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="menuLabel">
              Menu label
            </label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
              id="menuLabel"
              name="menuLabel"
              onChange={(event) => setMenuLabel(event.target.value)}
              placeholder="Label shown in header menu"
              value={menuLabel}
            />
          </div>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Page content</label>
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 p-3">
            <ToolbarIconButton title="Undo" onClick={() => editor?.chain().focus().undo().run()}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 8H5V4" />
                <path d="M5 8a8 8 0 111.7 10.5" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Redo" onClick={() => editor?.chain().focus().redo().run()}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M15 8h4V4" />
                <path d="M19 8a8 8 0 10-1.7 10.5" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Bold" onClick={() => editor?.chain().focus().toggleBold().run()} active={Boolean(editor?.isActive("bold"))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 6h5a3 3 0 010 6H8zM8 12h6a3 3 0 010 6H8z" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()} active={Boolean(editor?.isActive("italic"))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 4l-4 16M9 4h8M7 20h8" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Underline" onClick={() => editor?.chain().focus().toggleUnderline().run()} active={Boolean(editor?.isActive("underline"))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 4v6a6 6 0 0012 0V4" />
                <path d="M4 20h16" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Strike" onClick={() => editor?.chain().focus().toggleStrike().run()} active={Boolean(editor?.isActive("strike"))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16" />
                <path d="M7 7c0-2 2-3 5-3 2.5 0 4.5 1 5 3M7 17c.5 2 2.5 3 5 3 3 0 5-1 5-3" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Inline code" onClick={() => editor?.chain().focus().toggleCode().run()} active={Boolean(editor?.isActive("code"))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Bullet list" onClick={() => editor?.chain().focus().toggleBulletList().run()} active={Boolean(editor?.isActive("bulletList"))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6h11M9 12h11M9 18h11" />
                <circle cx="5" cy="6" r="1" fill="currentColor" />
                <circle cx="5" cy="12" r="1" fill="currentColor" />
                <circle cx="5" cy="18" r="1" fill="currentColor" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Numbered list" onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={Boolean(editor?.isActive("orderedList"))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 6h10M10 12h10M10 18h10" />
                <path d="M4 7h2V5H4M4 12h2v2H4m0 2h2v2H4" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Quote" onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={Boolean(editor?.isActive("blockquote"))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 8H4v4h3v4l4-4v-4H7zm10 0h-3v4h3v4l4-4v-4h-4z" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Code block" onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={Boolean(editor?.isActive("codeBlock"))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Heading 2" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={Boolean(editor?.isActive("heading", { level: 2 }))}>
              <span className="text-[10px] font-extrabold">H2</span>
            </ToolbarIconButton>

            <ToolbarIconButton title="Heading 3" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={Boolean(editor?.isActive("heading", { level: 3 }))}>
              <span className="text-[10px] font-extrabold">H3</span>
            </ToolbarIconButton>

            <ToolbarIconButton title="Align left" onClick={() => editor?.chain().focus().setTextAlign("left").run()} active={Boolean(editor?.isActive({ textAlign: "left" }))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 10h10M4 14h16M4 18h10" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Align center" onClick={() => editor?.chain().focus().setTextAlign("center").run()} active={Boolean(editor?.isActive({ textAlign: "center" }))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M7 10h10M4 14h16M7 18h10" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Align right" onClick={() => editor?.chain().focus().setTextAlign("right").run()} active={Boolean(editor?.isActive({ textAlign: "right" }))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M10 10h10M4 14h16M10 18h10" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Align justify" onClick={() => editor?.chain().focus().setTextAlign("justify").run()} active={Boolean(editor?.isActive({ textAlign: "justify" }))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Set link" onClick={handleSetLink} active={Boolean(editor?.isActive("link"))}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1" />
                <path d="M14 11a5 5 0 00-7 0l-2 2a5 5 0 107 7l1-1" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Unset link" onClick={handleUnsetLink}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12a4 4 0 005.5.5l3-3a4 4 0 00-5.7-5.7l-1.1 1.1" />
                <path d="M15 12a4 4 0 00-5.5-.5l-3 3a4 4 0 105.7 5.7l1.1-1.1" />
                <path d="M4 4l16 16" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title={uploadingImage ? "Uploading image" : "Insert image"} onClick={handleEditorImageUpload} disabled={uploadingImage}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="8" cy="10" r="1.5" />
                <path d="M21 16l-5-5-6 6-3-3-4 4" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Divider" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Line break" onClick={() => editor?.chain().focus().setHardBreak().run()}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 7v6a4 4 0 004 4h9" />
                <path d="M17 14l3 3-3 3" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Insert table" onClick={handleInsertTable}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="4" y="5" width="16" height="14" rx="1.5" />
                <path d="M4 10h16M9 5v14M15 5v14" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Add column before" onClick={() => editor?.chain().focus().addColumnBefore().run()}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 4v16M12 4h8v16h-8z" />
                <path d="M3 12h6M6 9l-3 3 3 3" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Add column after" onClick={() => editor?.chain().focus().addColumnAfter().run()}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h8v16H4zM16 4v16" />
                <path d="M15 12h6M18 9l3 3-3 3" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Add row before" onClick={() => editor?.chain().focus().addRowBefore().run()}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 8h16M4 12h16v8H4z" />
                <path d="M12 3v6M9 6l3-3 3 3" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Add row after" onClick={() => editor?.chain().focus().addRowAfter().run()}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h16v8H4zM4 16h16" />
                <path d="M12 15v6M9 18l3 3 3-3" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Delete column" onClick={() => editor?.chain().focus().deleteColumn().run()}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 5h10v14H4z" />
                <path d="M18 7v10M16 9l4 4M20 9l-4 4" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Delete row" onClick={() => editor?.chain().focus().deleteRow().run()}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 4h14v10H5z" />
                <path d="M7 18h10M9 16l4 4M13 16l-4 4" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Delete table" onClick={handleDeleteTable}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="4" y="5" width="10" height="10" rx="1.5" />
                <path d="M16 8l4 4M20 8l-4 4" />
              </svg>
            </ToolbarIconButton>

            <ToolbarIconButton title="Clear blocks" onClick={() => editor?.chain().focus().clearNodes().run()}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 6h16M7 6l1 14h8l1-14" />
                <path d="M9 6V4h6v2" />
              </svg>
            </ToolbarIconButton>
          </div>

          <div className="flex flex-wrap gap-3 border-b border-slate-200 px-3 py-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Text color</p>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((preset) => (
                  <ToolbarIconButton
                    key={preset.value}
                    title={`Text color ${preset.label}`}
                    onClick={() => handleColorPick(preset.value)}
                    active={Boolean(editor?.isActive("textStyle", { color: preset.value }))}
                  >
                    <span className={`h-4 w-4 rounded-full ${preset.className}`} />
                  </ToolbarIconButton>
                ))}
                <ToolbarIconButton title="Reset text color" onClick={() => editor?.chain().focus().unsetColor().run()}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4l16 16" />
                    <path d="M8 16h8" />
                  </svg>
                </ToolbarIconButton>
                <label className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600">
                  Any
                  <input
                    type="color"
                    onChange={handleCustomTextColorChange}
                    aria-label="Pick custom text color"
                    title="Pick custom text color"
                    className="h-5 w-5 cursor-pointer rounded border border-slate-300 p-0"
                  />
                </label>
              </div>
              {recentTextColors.length > 0 ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Recent</span>
                  {recentTextColors.map((color) => (
                    <button
                      key={`text-recent-${color}`}
                      type="button"
                      onClick={() => handleColorPick(color)}
                      title={`Recent text color ${color}`}
                      aria-label={`Recent text color ${color}`}
                      className={`${editorButtonClass} !h-7 !px-2 !py-1 !text-[10px] uppercase ${editor?.isActive("textStyle", { color }) ? "border-sky-300 bg-sky-50 text-sky-700" : ""}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Highlight</p>
              <div className="flex flex-wrap gap-2">
                {highlightPresets.map((preset) => (
                  <ToolbarIconButton
                    key={preset.value}
                    title={`Highlight ${preset.label}`}
                    onClick={() => handleHighlightPick(preset.value)}
                    active={Boolean(editor?.isActive("highlight", { color: preset.value }))}
                  >
                    <span className={`h-4 w-4 rounded-full ${preset.className}`} />
                  </ToolbarIconButton>
                ))}
                <ToolbarIconButton title="Clear highlight" onClick={() => editor?.chain().focus().unsetHighlight().run()}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4l16 16" />
                    <path d="M7 17h10" />
                  </svg>
                </ToolbarIconButton>
                <label className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600">
                  Any
                  <input
                    type="color"
                    onChange={handleCustomHighlightColorChange}
                    aria-label="Pick custom highlight color"
                    title="Pick custom highlight color"
                    className="h-5 w-5 cursor-pointer rounded border border-slate-300 p-0"
                  />
                </label>
              </div>
              {recentHighlightColors.length > 0 ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Recent</span>
                  {recentHighlightColors.map((color) => (
                    <button
                      key={`highlight-recent-${color}`}
                      type="button"
                      onClick={() => handleHighlightPick(color)}
                      title={`Recent highlight color ${color}`}
                      aria-label={`Recent highlight color ${color}`}
                      className={`${editorButtonClass} !h-7 !px-2 !py-1 !text-[10px] uppercase ${editor?.isActive("highlight", { color }) ? "border-amber-300 bg-amber-50 text-amber-700" : ""}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {isImageSelected ? (
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Image resize</p>
              {imageSizePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleImageResize(preset)}
                  className={`${editorButtonClass} ${selectedImageWidth === preset ? "border-sky-300 bg-sky-50 text-sky-700" : ""}`}
                >
                  {preset}%
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleImageResize(null)}
                className={`${editorButtonClass} ${selectedImageWidth === null ? "border-sky-300 bg-sky-50 text-sky-700" : ""}`}
              >
                Auto
              </button>

              <div className="ml-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1">
                <label htmlFor="page-image-width-slider" className="text-xs font-semibold text-slate-600">Custom</label>
                <input
                  id="page-image-width-slider"
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={customImageWidth}
                  onChange={(event) => handleCustomImageWidthChange(Number(event.target.value))}
                  className="w-28"
                />
                <label htmlFor="page-image-width-input" className="sr-only">
                  Page image width percentage
                </label>
                <input
                  id="page-image-width-input"
                  type="number"
                  min={10}
                  max={100}
                  value={customImageWidth}
                  onChange={(event) => handleCustomImageWidthChange(Number(event.target.value || 100))}
                  title="Page image width percentage"
                  className="w-16 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                />
                <span className="text-xs font-semibold text-slate-600">%</span>
              </div>

              <div className="ml-2 flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1">
                <span className="text-xs font-semibold text-slate-600">Align</span>
                {imageAlignPresets.map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => handleImageAlign(align)}
                    className={`${iconToolbarButtonClass} ${selectedImageAlign === align ? iconToolbarButtonActiveClass : ""}`}
                    title={`Align image ${align}`}
                    aria-label={`Align image ${align}`}
                  >
                    {align === "left" ? (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="5" width="7" height="14" rx="1" />
                        <path d="M13 7h7M13 12h7M13 17h7" />
                      </svg>
                    ) : null}
                    {align === "center" ? (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="8.5" y="5" width="7" height="14" rx="1" />
                        <path d="M4 7h3M17 7h3M4 12h3M17 12h3M4 17h3M17 17h3" />
                      </svg>
                    ) : null}
                    {align === "right" ? (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="13" y="5" width="7" height="14" rx="1" />
                        <path d="M4 7h7M4 12h7M4 17h7" />
                      </svg>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <EditorContent editor={editor} />
        </div>
      </div>

      {message && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          value="draft"
          disabled={submitting || !title.trim() || !contentText}
          className="bg-slate-950 text-white hover:bg-slate-800"
          onClick={() => setSubmitIntent("draft")}
        >
          {submitting ? "Saving..." : postToEdit ? "Update draft" : "Save draft"}
        </Button>
        <Button
          type="submit"
          value="published"
          disabled={submitting || !title.trim() || !contentText}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => setSubmitIntent("published")}
        >
          {submitting ? "Publishing..." : postToEdit ? "Update and publish" : "Publish"}
        </Button>
        {postToEdit ? (
          <Button
            type="button"
            disabled={submitting}
            className="bg-slate-200 text-slate-800 hover:bg-slate-300"
            onClick={() => {
              onCancelEdit?.();
              resetForm();
            }}
          >
            Cancel
          </Button>
        ) : null}
      </div>

      <style jsx global>{`
        .tiptap-editor p.is-editor-empty:first-child::before {
          color: #94a3b8;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .tiptap-editor img {
          border-radius: 0.75rem;
          height: auto;
          max-width: 100%;
        }

        .tiptap-editor p {
          line-height: 1.7;
        }

        .tiptap-editor a {
          color: #0284c7;
          text-decoration: underline;
        }

        .tiptap-editor h2 {
          font-size: 1.4rem;
          font-weight: 800;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .tiptap-editor h3 {
          font-size: 1.2rem;
          font-weight: 800;
          margin-top: 0.9rem;
          margin-bottom: 0.45rem;
        }

        .tiptap-editor blockquote {
          border-left: 4px solid #0ea5e9;
          color: #475569;
          font-style: italic;
          margin: 1rem 0;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
        }

        .tiptap-editor pre {
          background: #0f172a;
          color: #e2e8f0;
          border-radius: 0.75rem;
          padding: 1rem;
          overflow-x: auto;
        }

        .tiptap-editor code {
          background: rgba(15, 23, 42, 0.08);
          border-radius: 0.375rem;
          padding: 0.15rem 0.35rem;
          font-size: 0.95em;
        }

        .tiptap-editor hr {
          border: 0;
          border-top: 1px solid #cbd5e1;
          margin: 1rem 0;
        }

        .tiptap-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }

        .tiptap-editor th,
        .tiptap-editor td {
          border: 1px solid #cbd5e1;
          padding: 0.5rem 0.65rem;
          text-align: left;
          vertical-align: top;
          min-width: 70px;
        }

        .tiptap-editor th {
          background: #f1f5f9;
          font-weight: 700;
        }
      `}</style>
    </form>
  );
}
