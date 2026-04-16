"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { registerQuillImageResize } from "@/lib/quill-image-resize";
import "react-quill-new/dist/quill.snow.css";

type ReporterNewsFormProps = {
  authorName?: string;
  onSuccess?: () => void;
  postToEdit?: {
    id: string;
    title: string;
    category: string;
    content: string;
    tags: string[];
    isPublished: boolean;
  } | null;
  onCancelEdit?: () => void;
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
const categories = ["India", "Politics", "Business", "Technology", "Sports", "Entertainment", "World"];

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

export function ReporterNewsForm({ authorName = "Reporter", onSuccess, postToEdit = null, onCancelEdit }: ReporterNewsFormProps) {
  const editorRef = useRef<any>(null);
  const [quillReady, setQuillReady] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [submitIntent, setSubmitIntent] = useState<"draft" | "published">("draft");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  useEffect(() => {
    if (!postToEdit) {
      return;
    }

    setTitle(postToEdit.title || "");
    setSlug(createSlug(postToEdit.title || ""));
    setCategory(postToEdit.category || categories[0]);
    setContent(postToEdit.content || "");
    setTags((postToEdit.tags || []).join(", "));
    setSubmitIntent(postToEdit.isPublished ? "published" : "draft");
    setMessage(null);
  }, [postToEdit]);

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
        alert(error instanceof Error ? error.message : "Image upload failed");
      } finally {
        setUploadingImage(false);
      }
    };

    input.click();
  }, []);

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
    setMessage(null);

    const isDraft = submitIntent === "draft";

    try {
      const endpoint = postToEdit ? `${backendUrl}/news/${postToEdit.id}` : `${backendUrl}/news`;
      const method = postToEdit ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          isPublished: !isDraft,
        }),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to create post");
      }

      setMessage({
        type: "success",
        text: postToEdit
          ? isDraft
            ? "Draft updated successfully."
            : "Article updated successfully."
          : isDraft
            ? "Draft saved successfully."
            : "Article published successfully.",
      });
      setTitle("");
      setSlug("");
      setCategory(categories[0]);
      setContent("");
      setTags("");
      setSubmitIntent("draft");
      onCancelEdit?.();
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
        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">WYSIWYG</span>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Draft ready</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">SEO friendly</span>
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-950">{postToEdit ? "Edit article" : "New article"}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Publishing as <span className="font-semibold">{authorName}</span>
        </p>
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
            placeholder="Write a catchy headline"
            value={title}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="category">
              Category
            </label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="tags">
              Tags
            </label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
              id="tags"
              name="tags"
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags"
              value={tags}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Article content</label>
        {quillReady && (
          <ReactQuillEditor
            ref={editorRef}
            formats={quillFormats}
            modules={quillModules}
            onChange={setContent}
            placeholder="Write your article here... Add images, format text, and more!"
            theme="snow"
            value={content}
          />
        )}
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
          disabled={submitting || !title || !content}
          className="bg-slate-950 text-white hover:bg-slate-800"
          onClick={() => setSubmitIntent("draft")}
        >
          {submitting ? "Saving..." : postToEdit ? "Update draft" : "Save draft"}
        </Button>
        <Button
          type="submit"
          value="published"
          disabled={submitting || !title || !content}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => setSubmitIntent("published")}
        >
          {submitting ? "Publishing..." : postToEdit ? "Update & publish" : "Publish"}
        </Button>
        {postToEdit && (
          <Button
            type="button"
            disabled={submitting}
            className="bg-slate-200 text-slate-800 hover:bg-slate-300"
            onClick={() => {
              onCancelEdit?.();
              setTitle("");
              setSlug("");
              setCategory(categories[0]);
              setContent("");
              setTags("");
              setSubmitIntent("draft");
              setMessage(null);
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
