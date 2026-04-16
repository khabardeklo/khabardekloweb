"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { registerQuillImageResize } from "@/lib/quill-image-resize";
import "react-quill-new/dist/quill.snow.css";

type DraftStatus = "draft" | "published";

const ReactQuillEditor = dynamic(async () => {
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

const categories = ["India", "Politics", "Business", "Technology", "Sports", "Entertainment", "World"];

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
const backendOrigin = backendUrl.replace(/\/api$/, "");

const createSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const splitTags = (value: string): string[] =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12);

const stripHtml = (value: string): string =>
  value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const readFileAsDataUrl = async (file: File): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read image file"));
    reader.readAsDataURL(file);
  });

export default function NewsManagementPage() {
  const router = useRouter();
  const autosaveTimer = useRef<number | null>(null);
  const editorRef = useRef<any>(null);
  const [quillReady, setQuillReady] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [summary, setSummary] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState<DraftStatus>("draft");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tags = useMemo(() => splitTags(tagsInput), [tagsInput]);
  const contentText = useMemo(() => stripHtml(contentHtml), [contentHtml]);

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

  const readingTime = useMemo(() => {
    const words = contentText.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 180));
  }, [contentText]);

  const previewContent = useMemo(() => {
    const sections = [summary ? `<p>${escapeHtml(summary)}</p>` : "", contentHtml].filter(Boolean).join("");
    return sections;
  }, [summary, contentHtml]);

  useEffect(() => {
    if (autosaveTimer.current) {
      window.clearTimeout(autosaveTimer.current);
    }

    if (!title && !summary && !contentHtml) {
      return undefined;
    }

    autosaveTimer.current = window.setTimeout(() => {
      window.localStorage.setItem(
        "khabar-deklo-admin-draft",
        JSON.stringify({
          title,
          slug,
          category,
          imageUrl,
          summary,
          contentHtml,
          tagsInput,
          status,
          savedAt: new Date().toISOString(),
        })
      );
    }, 800);

    return () => {
      if (autosaveTimer.current) {
        window.clearTimeout(autosaveTimer.current);
      }
    };
  }, [title, slug, category, imageUrl, summary, contentHtml, tagsInput, status]);

  useEffect(() => {
    const storedDraft = window.localStorage.getItem("khabar-deklo-admin-draft");
    if (!storedDraft) {
      return;
    }

    try {
      const parsed = JSON.parse(storedDraft) as {
        title?: string;
        slug?: string;
        category?: string;
        imageUrl?: string;
        summary?: string;
        contentHtml?: string;
        tagsInput?: string;
        status?: DraftStatus;
      };

      setTitle(parsed.title || "");
      setSlug(parsed.slug || "");
      setCategory(parsed.category || categories[0]);
      setImageUrl(parsed.imageUrl || "");
      setImagePreview(parsed.imageUrl || null);
      setSummary(parsed.summary || "");
      setContentHtml(parsed.contentHtml || "");
      setTagsInput(parsed.tagsInput || "");
      setStatus(parsed.status || "draft");
    } catch {
      window.localStorage.removeItem("khabar-deklo-admin-draft");
    }
  }, []);

  useEffect(() => {
    setImagePreview(imageUrl || null);
  }, [imageUrl]);

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

  const uploadSelectedImage = async (file: File) => {
    setUploadingImage(true);
    setErrorMessage(null);

    try {
      const dataUrl = await readFileAsDataUrl(file);

      const absoluteUrl = await uploadImageData(dataUrl, file.name, file.type);
      setImageUrl(absoluteUrl);
      setImagePreview(absoluteUrl);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
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

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextTitle = event.target.value;
    setTitle(nextTitle);
    setSlug(createSlug(nextTitle));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const submitEvent = event.nativeEvent as SubmitEvent;
    const submitter = submitEvent.submitter as HTMLButtonElement | null;
    const nextStatus: DraftStatus = submitter?.value === "published" ? "published" : "draft";
    setStatus(nextStatus);

    try {
      const response = await fetch(`${backendUrl}/news`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: previewContent || contentHtml,
          category,
          imageUrl: imageUrl || undefined,
          tags,
          isPublished: nextStatus === "published",
        }),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to create post");
      }

      setSuccessMessage(nextStatus === "published" ? "Post published successfully." : "Draft saved successfully.");
      setTitle("");
      setSlug("");
      setCategory(categories[0]);
      setImageUrl("");
      setImagePreview(null);
      setSummary("");
      setContentHtml("");
      setTagsInput("");
      setStatus("draft");
      window.localStorage.removeItem("khabar-deklo-admin-draft");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell title="New Post" subtitle="Write like a blogger with a full WYSIWYG editor, live preview, and publish controls.">
      <form className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]" onSubmit={handleSubmit}>
        <section className="space-y-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">WYSIWYG</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Draft ready</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">SEO friendly</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="title">
                Post title
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
                id="title"
                maxLength={120}
                name="title"
                onChange={handleTitleChange}
                placeholder="Write a catchy blog-style headline"
                value={title}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="category">
                  Category
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
                  id="category"
                  name="category"
                  onChange={(event) => setCategory(event.target.value)}
                  value={category}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="slug">
                  Slug
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
                  id="slug"
                  name="slug"
                  onChange={(event) => setSlug(createSlug(event.target.value))}
                  placeholder="auto-generated-from-title"
                  value={slug}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="imageUrl">
                  Cover image URL
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
                  id="imageUrl"
                  name="imageUrl"
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setImageUrl(nextValue);
                    setImagePreview(nextValue ? (nextValue.startsWith("/") ? `${backendOrigin}${nextValue}` : nextValue) : null);
                  }}
                  placeholder="https://..."
                  value={imageUrl}
                />
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                  {uploadingImage ? "Uploading..." : "Upload image"}
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }

                      const localPreview = URL.createObjectURL(file);
                      setImagePreview(localPreview);
                      void uploadSelectedImage(file);
                    }}
                    type="file"
                  />
                </label>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="tags">
                  Tags
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
                  id="tags"
                  name="tags"
                  onChange={(event) => setTagsInput(event.target.value)}
                  placeholder="news, blog, trending"
                  value={tagsInput}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="summary">
                Short summary
              </label>
              <textarea
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
                id="summary"
                maxLength={220}
                name="summary"
                onChange={(event) => setSummary(event.target.value)}
                placeholder="One-line intro like a blogger would use in a feature card"
                value={summary}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-slate-700">Content</label>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{readingTime} min read</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{contentText.length} chars</span>
                </div>
              </div>
              <div className="news-editor-wrapper overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {quillReady ? (
                  <ReactQuillEditor
                    className="news-editor"
                    formats={quillFormats}
                    modules={quillModules}
                    onChange={setContentHtml}
                    placeholder="Write your story with formatting, links, quotes, and images..."
                    ref={editorRef}
                    theme="snow"
                    value={contentHtml}
                  />
                ) : (
                  <div className="flex min-h-[18rem] items-center justify-center text-sm font-medium text-slate-500">
                    Loading editor...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submitting || uploadingImage}
              type="submit"
              value="draft"
            >
              {submitting && status === "draft" ? "Saving..." : "Save Draft"}
            </button>
            <button
              className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submitting || uploadingImage}
              type="submit"
              value="published"
            >
              {submitting && status === "published" ? "Publishing..." : "Publish Now"}
            </button>
            <button
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
              disabled={submitting}
              onClick={() => {
                setTitle("");
                setSlug("");
                setCategory(categories[0]);
                setImageUrl("");
                setImagePreview(null);
                setSummary("");
                setContentHtml("");
                setTagsInput("");
                setStatus("draft");
                setSuccessMessage(null);
                setErrorMessage(null);
                window.localStorage.removeItem("khabar-deklo-admin-draft");
              }}
              type="button"
            >
              Reset
            </button>
          </div>

          {successMessage ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p> : null}
          {errorMessage ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</p> : null}
        </section>

        <aside className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            {imagePreview ? (
              <div className="aspect-[16/10] bg-slate-100">
                <img alt={title || "Cover preview"} className="h-full w-full object-cover" src={imagePreview} />
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center bg-[linear-gradient(135deg,#dbeafe_0%,#ecfeff_50%,#dcfce7_100%)] text-sm font-semibold text-slate-500">
                Cover image preview
              </div>
            )}
            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-white">{category}</span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">{status}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{readingTime} min</span>
                {uploadingImage ? <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Uploading image</span> : null}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight text-slate-950">{title || "Your article headline appears here"}</h2>
                <p className="text-sm leading-6 text-slate-600">{summary || "A short summary will make this look like a polished blog card."}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">No tags yet</span>
                )}
              </div>
              <p className="text-sm leading-7 text-slate-600">
                Slug: <span className="font-semibold text-slate-950">{slug || "auto-generated-slug"}</span>
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
            <h3 className="text-lg font-black text-slate-950">Preview article</h3>
            <div
              className="mt-4 space-y-3 text-sm leading-7 text-slate-700 [&_a]:text-sky-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-sky-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-black [&_img]:my-4 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-2xl [&_li]:ml-6 [&_li]:list-disc [&_p]:mb-4 [&_p]:leading-7 [&_ul]:space-y-2"
              dangerouslySetInnerHTML={{ __html: previewContent || "<p class='text-slate-400'>Write something to see the preview here.</p>" }}
            />
          </section>
        </aside>
      </form>
      <style jsx global>{`
        .news-editor-wrapper .ql-toolbar.ql-snow {
          border: 0;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 12px;
        }

        .news-editor-wrapper .ql-container.ql-snow {
          border: 0;
          min-height: 460px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 17px;
          line-height: 1.75;
        }

        .news-editor-wrapper .ql-editor {
          min-height: 460px;
          padding: 20px;
        }

        .news-editor-wrapper .ql-editor h1,
        .news-editor-wrapper .ql-editor h2,
        .news-editor-wrapper .ql-editor h3 {
          font-weight: 800;
          color: #0f172a;
        }

        .news-editor-wrapper .ql-editor blockquote {
          border-left: 4px solid #0ea5e9;
          margin: 1.25rem 0;
          padding-left: 1rem;
          color: #334155;
          font-style: italic;
        }

        .news-editor-wrapper .ql-editor img {
          margin: 1rem auto;
          border-radius: 1rem;
          max-width: 100%;
        }
      `}</style>
    </AdminShell>
  );
}
