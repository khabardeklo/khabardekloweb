"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { registerQuillImageResize } from "@/lib/quill-image-resize";
import "react-quill-new/dist/quill.snow.css";

type PageTemplateType = "frontend-header" | "frontend-footer" | "header-menu" | "custom";

type ReporterPageFormProps = {
  authorName?: string;
  onSuccess?: () => void;
};

const ReactQuillEditor = dynamic(
  async () => {
    const ReactQuillModule = await import("react-quill-new");
    const QuillModule = await import("quill");
    const Quill = (QuillModule as any).default || (QuillModule as any).Quill || QuillModule;

    if (typeof window !== "undefined" && Quill) {
      (window as any).Quill = Quill;
      registerQuillImageResize(Quill);
    }

    return ReactQuillModule;
  },
  { ssr: false }
) as any;

const imageResizeHandleStyles = {
  backgroundColor: "#0f172a",
  border: "2px solid #ffffff",
  borderRadius: "9999px",
  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.22)",
  height: "12px",
  width: "12px",
};

const imageResizeDisplayStyles = {
  backgroundColor: "rgba(15, 23, 42, 0.92)",
  border: "none",
  borderRadius: "9999px",
  color: "#ffffff",
  fontSize: "11px",
  fontWeight: "700",
  padding: "4px 8px",
};

const imageResizeToolbarStyles = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "9999px",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
  padding: "4px 6px",
};

const imageResizeToolbarButtonStyles = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "9999px",
  color: "#0f172a",
  height: "28px",
  width: "28px",
};

const imageResizeToolbarButtonSvgStyles = {
  height: "14px",
  width: "14px",
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
const backendOrigin = backendUrl.replace(/\/api$/, "");

const createSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const stripHtml = (value: string): string =>
  value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const readFileAsDataUrl = async (file: File): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read image file"));
    reader.readAsDataURL(file);
  });

const templateLabels: Record<PageTemplateType, string> = {
  "frontend-header": "Frontend Header Page",
  "frontend-footer": "Frontend Footer Page",
  "header-menu": "Header Menu Page",
  custom: "Custom Page",
};

export function ReporterPageForm({ authorName = "Reporter", onSuccess }: ReporterPageFormProps) {
  const editorRef = useRef<any>(null);
  const [quillReady, setQuillReady] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [templateType, setTemplateType] = useState<PageTemplateType>("custom");
  const [menuLabel, setMenuLabel] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const contentText = useMemo(() => stripHtml(content), [content]);
  const isHeaderMenu = templateType === "header-menu";

  useEffect(() => {
    let cancelled = false;

    const initializeQuill = async () => {
      const QuillModule = await import("quill");
      const Quill = (QuillModule as any).default || (QuillModule as any).Quill || QuillModule;

      if (typeof window !== "undefined" && Quill) {
        (window as any).Quill = Quill;
        registerQuillImageResize(Quill);
      }

      if (!cancelled) {
        setQuillReady(true);
      }
    };

    void initializeQuill();

    return () => {
      cancelled = true;
    };
  }, []);

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
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }

      setUploadingImage(true);
      setErrorMessage(null);

      try {
        const dataUrl = await readFileAsDataUrl(file);
        const absoluteUrl = await uploadImageData(dataUrl, file.name, file.type);
        const editor = editorRef.current?.getEditor?.();

        if (!editor) {
          throw new Error("Editor is not ready yet");
        }

        const range = editor.getSelection(true);
        const insertAt = typeof range?.index === "number" ? range.index : editor.getLength();
        editor.insertEmbed(insertAt, "image", absoluteUrl, "user");
        editor.setSelection(insertAt + 1);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Image upload failed");
      } finally {
        setUploadingImage(false);
      }
    };

    input.click();
  }, [uploadImageData]);

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
          [{ align: [] }, { color: [] }, { background: [] }],
          ["link", "image", "clean"],
        ],
        handlers: {
          image: handleEditorImageUpload,
        },
      },
      clipboard: {
        matchVisual: false,
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
      imageResize: {
        parchment: quillReady ? (window as any).Quill.import("parchment") : undefined,
        modules: ["Resize", "DisplaySize", "Toolbar"],
        handleStyles: imageResizeHandleStyles,
        displayStyles: imageResizeDisplayStyles,
        toolbarStyles: imageResizeToolbarStyles,
        toolbarButtonStyles: imageResizeToolbarButtonStyles,
        toolbarButtonSvgStyles: imageResizeToolbarButtonSvgStyles,
      },
    }),
    [handleEditorImageUpload, quillReady]
  );

  const quillFormats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "indent",
      "align",
      "color",
      "background",
      "link",
      "image",
    ],
    []
  );

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTitle = event.target.value;
    setTitle(nextTitle);
    setSlug(createSlug(nextTitle));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const payload: Record<string, unknown> = {
        title,
        slug: slug || createSlug(title),
        templateType,
        content,
        isPublished,
      };

      if (isHeaderMenu && menuLabel) {
        payload.menuLabel = menuLabel;
      }

      const response = await fetch(`${backendUrl}/pages`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to create page");
      }

      setSuccessMessage(isPublished ? "Page published successfully." : "Page saved successfully.");
      setTitle("");
      setSlug("");
      setTemplateType("custom");
      setMenuLabel("");
      setContent("");
      setIsPublished(true);
      onSuccess?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 lg:p-8" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-xl font-black text-slate-950">New page</h2>
        <p className="mt-1 text-sm text-slate-600">
          Creating as <span className="font-semibold">{authorName}</span>
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
            placeholder="Enter page title"
            value={title}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="templateType">
              Template type
            </label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
              id="templateType"
              onChange={(e) => setTemplateType(e.target.value as PageTemplateType)}
              value={templateType}
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
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Auto-generated from title"
              value={slug}
            />
          </div>
        </div>

        {isHeaderMenu && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="menuLabel">
              Menu label
            </label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
              id="menuLabel"
              name="menuLabel"
              onChange={(e) => setMenuLabel(e.target.value)}
              placeholder="Label to display in menu"
              value={menuLabel}
            />
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Page content</label>
        {quillReady && (
          <ReactQuillEditor
            ref={editorRef}
            formats={quillFormats}
            modules={quillModules}
            onChange={setContent}
            placeholder="Write your page content here..."
            theme="snow"
            value={content}
          />
        )}
      </div>

      {successMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={submitting || !title || !content}
          className="bg-slate-950 text-white hover:bg-slate-800"
          onClick={() => setIsPublished(false)}
        >
          {submitting ? "Saving..." : "Save draft"}
        </Button>
        <Button
          type="submit"
          disabled={submitting || !title || !content}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => setIsPublished(true)}
        >
          {submitting ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </form>
  );
}
