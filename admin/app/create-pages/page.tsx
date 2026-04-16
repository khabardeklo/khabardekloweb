"use client";

import dynamic from "next/dynamic";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Button } from "@/components/ui/button";
import { registerQuillImageResize } from "@/lib/quill-image-resize";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(async () => {
  const ReactQuillModule = await import("react-quill-new");
  const QuillModule = await import("quill");
  const Quill = (QuillModule as any).default || (QuillModule as any).Quill || QuillModule;

  if (typeof window !== "undefined" && Quill) {
    (window as any).Quill = Quill;
    registerQuillImageResize(Quill);
  }

  return ReactQuillModule;
}, { ssr: false }) as any;

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

type PageTemplateType = "frontend-header" | "frontend-footer" | "header-menu" | "custom";

type PageItem = {
  _id: string;
  title: string;
  slug: string;
  templateType: PageTemplateType;
  menuLabel?: string;
  content: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
const backendOrigin = backendUrl.replace(/\/api$/, "");

const requestWithRefresh = async (url: string, init: RequestInit = {}): Promise<Response> => {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshResponse = await fetch(`${backendUrl}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!refreshResponse.ok) {
    return response;
  }

  return fetch(url, {
    ...init,
    credentials: "include",
  });
};

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

const formatRelativeDate = (value?: string): string => {
  if (!value) {
    return "Updated recently";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Updated recently";
  }

  const minutes = Math.max(1, Math.floor((Date.now() - parsed.getTime()) / 60000));
  if (minutes < 60) {
    return `Updated ${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Updated ${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  return `Updated ${days} day${days > 1 ? "s" : ""} ago`;
};

export default function CreatePagesPage() {
  const editorRef = useRef<any>(null);
  const [quillReady, setQuillReady] = useState(false);

  const [createdPages, setCreatedPages] = useState<PageItem[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [templateType, setTemplateType] = useState<PageTemplateType>("custom");
  const [menuLabel, setMenuLabel] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isHeaderMenu = templateType === "header-menu";
  const contentText = useMemo(() => stripHtml(content), [content]);

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

  const sortedPages = useMemo(
    () => [...createdPages].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime()),
    [createdPages]
  );

  const resetForm = () => {
    setEditingPageId(null);
    setTitle("");
    setSlug("");
    setTemplateType("custom");
    setMenuLabel("");
    setContent("");
    setIsPublished(true);
  };

  const fetchPages = async () => {
    setLoadingPages(true);

    try {
      const response = await requestWithRefresh(`${backendUrl}/pages`);

      const data = (await response.json().catch(() => null)) as PageItem[] | { message?: string } | null;

      if (!response.ok || !Array.isArray(data)) {
        throw new Error((data as { message?: string } | null)?.message || "Unable to fetch created pages");
      }

      setCreatedPages(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to fetch created pages");
    } finally {
      setLoadingPages(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const uploadImageData = async (imageData: string, fileName: string, mimeType: string): Promise<string> => {
    const response = await requestWithRefresh(`${backendUrl}/uploads/image`, {
      method: "POST",
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

  const handleTemplateSelect = (type: PageTemplateType) => {
    setTemplateType(type);
    if (type !== "header-menu") {
      setMenuLabel("");
    }
  };

  const handleStartEdit = (page: PageItem) => {
    setEditingPageId(page._id);
    setTitle(page.title);
    setSlug(page.slug);
    setTemplateType(page.templateType);
    setMenuLabel(page.menuLabel || "");
    setContent(page.content);
    setIsPublished(page.isPublished);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleDeletePage = async (id: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await requestWithRefresh(`${backendUrl}/pages/${id}`, {
        method: "DELETE",
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to delete page");
      }

      setCreatedPages((pages) => pages.filter((page) => page._id !== id));
      if (editingPageId === id) {
        resetForm();
      }
      setSuccessMessage("Page deleted successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete page");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const resolvedSlug = createSlug(slug || title);

    if (!resolvedSlug) {
      setSubmitting(false);
      setErrorMessage("Please enter a valid title.");
      return;
    }

    if (!contentText) {
      setSubmitting(false);
      setErrorMessage("Content is required.");
      return;
    }

    if (templateType === "header-menu" && !menuLabel.trim()) {
      setSubmitting(false);
      setErrorMessage("Header menu page ke liye menu label required hai.");
      return;
    }

    const payload = {
      title: title.trim(),
      slug: resolvedSlug,
      templateType,
      menuLabel: templateType === "header-menu" ? menuLabel.trim() : undefined,
      content: content.trim(),
      isPublished,
    };

    const isEditing = Boolean(editingPageId);
    const url = isEditing ? `${backendUrl}/pages/${editingPageId}` : `${backendUrl}/pages`;
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await requestWithRefresh(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to save page");
      }

      setSuccessMessage(isEditing ? "Page updated successfully." : "Page created successfully.");
      resetForm();
      await fetchPages();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save page");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell title="Create Pages" subtitle="Create and manage static website pages from one place.">
      <div className="grid gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">{editingPageId ? "Edit page" : "Create new page"}</h2>
          <p className="mt-2 text-sm text-slate-600">Bilkul blogger pages ki tarah page create karke frontend par publish karein.</p>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Page title
                <input
                  value={title}
                  onChange={(event) => {
                    const nextTitle = event.target.value;
                    setTitle(nextTitle);
                    if (!editingPageId) {
                      setSlug(createSlug(nextTitle));
                    }
                  }}
                  placeholder="About Us"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Page slug
                <input
                  value={slug}
                  onChange={(event) => setSlug(createSlug(event.target.value))}
                  placeholder="about-us"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Template type
                <select
                  value={templateType}
                  onChange={(event) => handleTemplateSelect(event.target.value as PageTemplateType)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                >
                  <option value="frontend-header">Frontend Header Page</option>
                  <option value="frontend-footer">Frontend Footer Page</option>
                  <option value="header-menu">Header Menu Page</option>
                  <option value="custom">Custom Page</option>
                </select>
              </label>

              {isHeaderMenu ? (
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Menu label
                  <input
                    value={menuLabel}
                    onChange={(event) => setMenuLabel(event.target.value)}
                    placeholder="About"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                    required
                  />
                </label>
              ) : (
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Status
                  <select
                    value={isPublished ? "published" : "draft"}
                    onChange={(event) => setIsPublished(event.target.value === "published")}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </label>
              )}
            </div>

            <div className="grid gap-2 text-sm font-semibold text-slate-700">
              <p>Page content (Rich editor)</p>
              <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
                {quillReady ? (
                  <ReactQuill
                    ref={editorRef}
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Yahan page content likhein..."
                    className="min-h-[18rem]"
                  />
                ) : (
                  <div className="flex min-h-[18rem] items-center justify-center text-sm font-medium text-slate-500">
                    Loading editor...
                  </div>
                )}
              </div>
            </div>

            {uploadingImage ? (
              <p className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700">Image uploading in editor...</p>
            ) : null}

            {errorMessage ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</p> : null}
            {successMessage ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p> : null}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingPageId ? "Update Page" : "Create Page"}
              </Button>
              {editingPageId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
                >
                  Cancel editing
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">Created pages</h2>
              <p className="mt-2 text-sm text-slate-600">Yahan aapke create kiye hue pages dikhte hain. Inhe edit ya delete kar sakte hain.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {loadingPages ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-600">
                Loading created pages...
              </div>
            ) : createdPages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-medium text-slate-600">
                Abhi koi page create nahi hua hai.
              </div>
            ) : (
              sortedPages.map((page) => (
                <article key={page._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 sm:text-base">{page.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-sky-700">{templateLabels[page.templateType]}</p>
                    <p className="mt-1 text-xs text-slate-500">/{page.slug}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatRelativeDate(page.updatedAt || page.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" className="px-4 py-2 text-xs sm:text-sm" onClick={() => handleStartEdit(page)}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      className="bg-rose-600 px-4 py-2 text-xs hover:bg-rose-700 sm:text-sm"
                      onClick={() => handleDeletePage(page._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
