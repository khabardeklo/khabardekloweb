"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { defaultSiteSettings, getSettingsForAdmin, type HomepageSettings, type SettingsLink, type SiteSettings, updateSiteSettings } from "@/lib/site-settings";

type SiteControlMode = "full" | "layout" | "theme";

type SiteControlFormProps = {
  mode?: SiteControlMode;
};

type LinkCollectionKey = "primaryNavLinks" | "headerQuickLinks" | "footerLinks" | "sideMenuLinks";

const emptyLink = (): SettingsLink => ({
  label: "",
  href: "/",
  isActive: true,
  icon: "",
  badge: "",
});

const homepageBlockLabels: Record<string, string> = {
  bigNewsGrid: "Big News Grid",
  topStories: "Top Stories",
  mediaHighlights: "Media Highlights",
  contentColumns: "Content Columns",
  newsIn30Seconds: "News in 30 Seconds",
  newsForStudents: "News for Students",
  aiNewsChat: "AI News Chat",
};

function LinkListEditor({
  title,
  links,
  onAdd,
  onRemove,
  onChange,
  onReorder,
  includeIcon,
}: {
  title: string;
  links: SettingsLink[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, patch: Partial<SettingsLink>) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  includeIcon?: boolean;
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    onReorder(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Drag rows to reorder</span>
          <Button type="button" className="px-3 py-2 text-xs" onClick={onAdd}>
            Add Link
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {links.length === 0 ? <p className="text-xs text-slate-500">No links added yet.</p> : null}

        {links.map((link, index) => (
          <div
            key={`${title}-${index}`}
            draggable
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(index)}
            onDragEnd={() => setDraggedIndex(null)}
            className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-12"
          >
            <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500 md:col-span-1">
              <span className="text-base" aria-hidden="true">⋮⋮</span>
            </div>
            <input
              value={link.label}
              onChange={(event) => onChange(index, { label: event.target.value })}
              placeholder="Label"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            />
            <input
              value={link.href}
              onChange={(event) => onChange(index, { href: event.target.value })}
              placeholder="/path"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            />
            {includeIcon ? (
              <input
                value={link.icon || ""}
                onChange={(event) => onChange(index, { icon: event.target.value })}
                placeholder="Icon"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-1"
              />
            ) : null}
            {includeIcon ? (
              <input
                value={link.badge || ""}
                onChange={(event) => onChange(index, { badge: event.target.value })}
                placeholder="Badge"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-1"
              />
            ) : null}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 md:col-span-1">
              <input
                type="checkbox"
                checked={link.isActive !== false}
                onChange={(event) => onChange(index, { isActive: event.target.checked })}
              />
              Active
            </label>
            <div className="flex items-center gap-1 md:col-span-2">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => onReorder(index, index - 1)}
                className="rounded-lg border border-slate-300 px-2 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
              >
                Up
              </button>
              <button
                type="button"
                disabled={index === links.length - 1}
                onClick={() => onReorder(index, index + 1)}
                className="rounded-lg border border-slate-300 px-2 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
              >
                Down
              </button>
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="rounded-lg border border-rose-200 px-2 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 md:col-span-1"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SiteControlForm({ mode = "full" }: SiteControlFormProps) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFull = mode === "full";
  const showLayoutSections = isFull || mode === "layout";
  const showThemeSections = isFull || mode === "theme";

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await getSettingsForAdmin();
        if (!ignore) {
          setSettings(response);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load site settings");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  const activeLinksSummary = useMemo(() => {
    const total = [
      ...settings.primaryNavLinks,
      ...settings.headerQuickLinks,
      ...settings.footerLinks,
      ...settings.sideMenuLinks,
      ...settings.admin.sidebarLinks,
    ].filter((item) => item.isActive !== false).length;

    return `${total} active links configured`;
  }, [settings]);

  const updateLinkCollection = (key: LinkCollectionKey, index: number, patch: Partial<SettingsLink>) => {
    setSettings((current) => {
      const nextLinks = [...current[key]];
      nextLinks[index] = {
        ...nextLinks[index],
        ...patch,
      };

      return {
        ...current,
        [key]: nextLinks,
      };
    });
  };

  const reorderLinkCollection = (key: LinkCollectionKey, fromIndex: number, toIndex: number) => {
    setSettings((current) => {
      const nextLinks = [...current[key]];
      const [movedItem] = nextLinks.splice(fromIndex, 1);
      nextLinks.splice(toIndex, 0, movedItem);

      return {
        ...current,
        [key]: nextLinks,
      };
    });
  };

  const addLinkToCollection = (key: LinkCollectionKey) => {
    setSettings((current) => ({
      ...current,
      [key]: [...current[key], emptyLink()],
    }));
  };

  const removeLinkFromCollection = (key: LinkCollectionKey, index: number) => {
    setSettings((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateAdminSidebarLink = (index: number, patch: Partial<SettingsLink>) => {
    setSettings((current) => {
      const nextLinks = [...current.admin.sidebarLinks];
      nextLinks[index] = { ...nextLinks[index], ...patch };

      return {
        ...current,
        admin: {
          ...current.admin,
          sidebarLinks: nextLinks,
        },
      };
    });
  };

  const addAdminSidebarLink = () => {
    setSettings((current) => ({
      ...current,
      admin: {
        ...current.admin,
        sidebarLinks: [...current.admin.sidebarLinks, emptyLink()],
      },
    }));
  };

  const removeAdminSidebarLink = (index: number) => {
    setSettings((current) => ({
      ...current,
      admin: {
        ...current.admin,
        sidebarLinks: current.admin.sidebarLinks.filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  };

  const reorderAdminSidebarLink = (fromIndex: number, toIndex: number) => {
    setSettings((current) => {
      const nextLinks = [...current.admin.sidebarLinks];
      const [movedItem] = nextLinks.splice(fromIndex, 1);
      nextLinks.splice(toIndex, 0, movedItem);

      return {
        ...current,
        admin: {
          ...current.admin,
          sidebarLinks: nextLinks,
        },
      };
    });
  };

  const updateHomepage = (patch: Partial<HomepageSettings>) => {
    setSettings((current) => ({
      ...current,
      homepage: {
        ...current.homepage,
        ...patch,
      },
    }));
  };

  const moveHomepageBlock = (fromIndex: number, toIndex: number) => {
    setSettings((current) => {
      const nextOrder = [...current.homepage.blockOrder];
      const [movedItem] = nextOrder.splice(fromIndex, 1);
      nextOrder.splice(toIndex, 0, movedItem);

      return {
        ...current,
        homepage: {
          ...current.homepage,
          blockOrder: nextOrder,
        },
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const facebookPageId = settings.socialMedia.facebook.pageId.trim();
      const facebookAccessToken = settings.socialMedia.facebook.pageAccessToken.trim();
      const hasPartialFacebookCredentials = Boolean(facebookPageId || facebookAccessToken) && !(facebookPageId && facebookAccessToken);

      if (hasPartialFacebookCredentials) {
        throw new Error("Facebook Page ID aur Access Token dono save karein.");
      }

      const nextSettings = {
        ...settings,
        socialMedia: {
          ...settings.socialMedia,
          facebook: {
            ...settings.socialMedia.facebook,
            pageId: facebookPageId,
            pageAccessToken: facebookAccessToken,
            autoPostEnabled: facebookPageId && facebookAccessToken ? true : settings.socialMedia.facebook.autoPostEnabled,
          },
        },
      };

      const updated = await updateSiteSettings(nextSettings);
      setSettings(updated);
      setSuccessMessage(facebookPageId && facebookAccessToken ? "Facebook auto-post enabled and saved successfully." : "Site controls updated successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save site settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading site controls...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-base font-bold text-slate-900">Global Site Identity</h3>
        <p className="mt-1 text-xs text-slate-500">{activeLinksSummary}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={settings.siteName}
            onChange={(event) => setSettings((current) => ({ ...current, siteName: event.target.value }))}
            placeholder="Site name"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={settings.siteTagline}
            onChange={(event) => setSettings((current) => ({ ...current, siteTagline: event.target.value }))}
            placeholder="Site tagline"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={settings.logoEnglishUrl}
            onChange={(event) => setSettings((current) => ({ ...current, logoEnglishUrl: event.target.value }))}
            placeholder="English logo URL"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={settings.logoHindiUrl}
            onChange={(event) => setSettings((current) => ({ ...current, logoHindiUrl: event.target.value }))}
            placeholder="Hindi logo URL"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            value={settings.siteDescription}
            onChange={(event) => setSettings((current) => ({ ...current, siteDescription: event.target.value }))}
            placeholder="Site description"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            rows={2}
          />
          <input
            value={settings.copyrightText}
            onChange={(event) => setSettings((current) => ({ ...current, copyrightText: event.target.value }))}
            placeholder="Footer copyright text"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
          />
        </div>
      </section>

      {isFull ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Social Media Automation</h3>
              <p className="mt-1 text-xs text-slate-500">Auto-post every published admin post to your Facebook page.</p>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={settings.socialMedia.facebook.autoPostEnabled}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    socialMedia: {
                      ...current.socialMedia,
                      facebook: {
                        ...current.socialMedia.facebook,
                        autoPostEnabled: event.target.checked,
                      },
                    },
                  }))
                }
              />
              Enable Facebook auto-post
            </label>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              value={settings.socialMedia.facebook.pageId}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  socialMedia: {
                    ...current.socialMedia,
                    facebook: {
                      ...current.socialMedia.facebook,
                      pageId: event.target.value,
                    },
                  },
                }))
              }
              placeholder="Facebook Page ID"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="password"
              value={settings.socialMedia.facebook.pageAccessToken}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  socialMedia: {
                    ...current.socialMedia,
                    facebook: {
                      ...current.socialMedia.facebook,
                      pageAccessToken: event.target.value,
                    },
                  },
                }))
              }
              placeholder="Facebook Page Access Token"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
            <p className="font-semibold">Facebook setup checklist</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Create or select the Facebook Page you want to post to.</li>
              <li>Paste the numeric Page ID here, not your profile ID.</li>
              <li>Use a Page Access Token with <span className="font-semibold">pages_manage_posts</span> and <span className="font-semibold">pages_read_engagement</span>.</li>
              <li>Keep auto-post enabled only after the token is validated.</li>
            </ul>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs leading-5 text-slate-500">
              Changes in this section are saved with the main settings form.
            </p>
            <Button type="submit" className="px-4 py-2 text-sm">
              Save Social Media Settings
            </Button>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            The access token is stored in backend settings and is only exposed on the protected admin settings endpoint. Do not use a user token.
          </p>
        </section>
      ) : null}

      {showLayoutSections ? (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-bold text-slate-900">Layout Controls</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.layout.showHeader} onChange={(event) => setSettings((current) => ({ ...current, layout: { ...current.layout, showHeader: event.target.checked } }))} />Show Header</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.layout.showFooter} onChange={(event) => setSettings((current) => ({ ...current, layout: { ...current.layout, showFooter: event.target.checked } }))} />Show Footer</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.layout.showCategoryMenu} onChange={(event) => setSettings((current) => ({ ...current, layout: { ...current.layout, showCategoryMenu: event.target.checked } }))} />Show Category Menu</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.layout.showBreakingTicker} onChange={(event) => setSettings((current) => ({ ...current, layout: { ...current.layout, showBreakingTicker: event.target.checked } }))} />Show Breaking Ticker</label>
              <input value={settings.layout.maxHeaderLinks} type="number" min={1} onChange={(event) => setSettings((current) => ({ ...current, layout: { ...current.layout, maxHeaderLinks: Number(event.target.value || 1) } }))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Max Header Links" />
              <input value={settings.layout.maxFooterLinks} type="number" min={1} onChange={(event) => setSettings((current) => ({ ...current, layout: { ...current.layout, maxFooterLinks: Number(event.target.value || 1) } }))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Max Footer Links" />
              <input value={settings.layout.maxSideMenuLinks} type="number" min={1} onChange={(event) => setSettings((current) => ({ ...current, layout: { ...current.layout, maxSideMenuLinks: Number(event.target.value || 1) } }))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-1" placeholder="Max Side Menu Links" />
              <input value={settings.tickerSpeed} type="number" min={1000} onChange={(event) => setSettings((current) => ({ ...current, tickerSpeed: Number(event.target.value || 1000) }))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Ticker Speed (ms)" />
              <input value={settings.maxNewsPerPage} type="number" min={1} onChange={(event) => setSettings((current) => ({ ...current, maxNewsPerPage: Number(event.target.value || 1) }))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Max News Per Page" />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-bold text-slate-900">Homepage Controls</h3>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Homepage block order</p>
                  <p className="text-xs text-slate-500">Move the blocks up or down to change the landing page sequence.</p>
                </div>
              </div>
              <div className="space-y-2">
                {settings.homepage.blockOrder.map((blockKey, index) => (
                  <div key={blockKey} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{homepageBlockLabels[blockKey] || blockKey}</p>
                      <p className="text-xs text-slate-500">{blockKey}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveHomepageBlock(index, index - 1)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        disabled={index === settings.homepage.blockOrder.length - 1}
                        onClick={() => moveHomepageBlock(index, index + 1)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40"
                      >
                        Down
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.homepage.showBigNewsGrid} onChange={(event) => updateHomepage({ showBigNewsGrid: event.target.checked })} />Show Big News Grid</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.homepage.showTopStories} onChange={(event) => updateHomepage({ showTopStories: event.target.checked })} />Show Top Stories</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.homepage.showMediaHighlights} onChange={(event) => updateHomepage({ showMediaHighlights: event.target.checked })} />Show Media Highlights</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.homepage.showContentColumns} onChange={(event) => updateHomepage({ showContentColumns: event.target.checked })} />Show Content Columns</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.homepage.showHeadlinesRail} onChange={(event) => updateHomepage({ showHeadlinesRail: event.target.checked })} />Show Headlines Rail</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.homepage.showAdsRail} onChange={(event) => updateHomepage({ showAdsRail: event.target.checked })} />Show Ads Rail</label>
              <input value={settings.homepage.bigNewsTitle} onChange={(event) => updateHomepage({ bigNewsTitle: event.target.value })} placeholder="Big News Title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.bigNewsCtaLabel} onChange={(event) => updateHomepage({ bigNewsCtaLabel: event.target.value })} placeholder="Big News CTA Label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.bigNewsCtaHref} onChange={(event) => updateHomepage({ bigNewsCtaHref: event.target.value })} placeholder="Big News CTA Href" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.bigNewsLimit} type="number" min={1} onChange={(event) => updateHomepage({ bigNewsLimit: Number(event.target.value || 1) })} placeholder="Big News Limit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.topStoriesTitle} onChange={(event) => updateHomepage({ topStoriesTitle: event.target.value })} placeholder="Top Stories Title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.topStoriesCtaLabel} onChange={(event) => updateHomepage({ topStoriesCtaLabel: event.target.value })} placeholder="Top Stories CTA Label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.topStoriesCtaHref} onChange={(event) => updateHomepage({ topStoriesCtaHref: event.target.value })} placeholder="Top Stories CTA Href" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.topStoriesLimit} type="number" min={1} onChange={(event) => updateHomepage({ topStoriesLimit: Number(event.target.value || 1) })} placeholder="Top Stories Limit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.videoSectionTitle} onChange={(event) => updateHomepage({ videoSectionTitle: event.target.value })} placeholder="Video Section Title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.videoSectionCtaLabel} onChange={(event) => updateHomepage({ videoSectionCtaLabel: event.target.value })} placeholder="Video CTA Label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.videoSectionCtaHref} onChange={(event) => updateHomepage({ videoSectionCtaHref: event.target.value })} placeholder="Video CTA Href" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.videoSectionLimit} type="number" min={1} onChange={(event) => updateHomepage({ videoSectionLimit: Number(event.target.value || 1) })} placeholder="Video Limit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.photosSectionTitle} onChange={(event) => updateHomepage({ photosSectionTitle: event.target.value })} placeholder="Photos Section Title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.photosSectionCtaLabel} onChange={(event) => updateHomepage({ photosSectionCtaLabel: event.target.value })} placeholder="Photos CTA Label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.photosSectionCtaHref} onChange={(event) => updateHomepage({ photosSectionCtaHref: event.target.value })} placeholder="Photos CTA Href" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.photosSectionLimit} type="number" min={1} onChange={(event) => updateHomepage({ photosSectionLimit: Number(event.target.value || 1) })} placeholder="Photos Limit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.newsFeedEyebrow} onChange={(event) => updateHomepage({ newsFeedEyebrow: event.target.value })} placeholder="News Feed Eyebrow" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.newsFeedTitle} onChange={(event) => updateHomepage({ newsFeedTitle: event.target.value })} placeholder="News Feed Title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.headlinesTitle} onChange={(event) => updateHomepage({ headlinesTitle: event.target.value })} placeholder="Headlines Title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.adsTitle} onChange={(event) => updateHomepage({ adsTitle: event.target.value })} placeholder="Ads Title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.headlinesLimit} type="number" min={1} onChange={(event) => updateHomepage({ headlinesLimit: Number(event.target.value || 1) })} placeholder="Headlines Limit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.homepage.adsLimit} type="number" min={1} onChange={(event) => updateHomepage({ adsLimit: Number(event.target.value || 1) })} placeholder="Ads Limit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />

              {/* --- New Feature Controls --- */}
              <div className="col-span-2 mt-2 border-t border-slate-200 pt-4">
                <p className="mb-3 text-sm font-bold text-slate-800">Special Feature Sections</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.homepage.showNewsIn30Seconds} onChange={(event) => updateHomepage({ showNewsIn30Seconds: event.target.checked })} />Show News in 30 Seconds</label>
                  <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.homepage.showNewsForStudents} onChange={(event) => updateHomepage({ showNewsForStudents: event.target.checked })} />Show News for Students</label>
                  <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.homepage.showAiNewsChat} onChange={(event) => updateHomepage({ showAiNewsChat: event.target.checked })} />Show AI News Chat</label>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <input value={settings.homepage.newsIn30SecondsTitle} onChange={(event) => updateHomepage({ newsIn30SecondsTitle: event.target.value })} placeholder="News in 30 Seconds Title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input value={settings.homepage.newsIn30SecondsLimit} type="number" min={1} onChange={(event) => updateHomepage({ newsIn30SecondsLimit: Number(event.target.value || 1) })} placeholder="30 Seconds Limit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input value={settings.homepage.newsForStudentsTitle} onChange={(event) => updateHomepage({ newsForStudentsTitle: event.target.value })} placeholder="News for Students Title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input value={settings.homepage.newsForStudentsLimit} type="number" min={1} onChange={(event) => updateHomepage({ newsForStudentsLimit: Number(event.target.value || 1) })} placeholder="Students News Limit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input value={settings.homepage.aiNewsChatTitle} onChange={(event) => updateHomepage({ aiNewsChatTitle: event.target.value })} placeholder="AI News Chat Title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
                </div>
                <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs text-violet-800">
                  <strong>AI News Chat</strong> ke liye <code>GEMINI_API_KEY</code> frontend <code>.env</code> mein set karein.
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">These controls change the public homepage blocks, labels, and item counts directly from admin settings.</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-bold text-slate-900">Category Page Controls</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input value={settings.categoryPage.titlePrefix} onChange={(event) => setSettings((current) => ({ ...current, categoryPage: { ...current.categoryPage, titlePrefix: event.target.value } }))} placeholder="Title prefix" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.categoryPage.browseAllLabel} onChange={(event) => setSettings((current) => ({ ...current, categoryPage: { ...current.categoryPage, browseAllLabel: event.target.value } }))} placeholder="Browse button label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.categoryPage.browseAllHref} onChange={(event) => setSettings((current) => ({ ...current, categoryPage: { ...current.categoryPage, browseAllHref: event.target.value } }))} placeholder="Browse button href" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={settings.categoryPage.showSidebarWidgets} onChange={(event) => setSettings((current) => ({ ...current, categoryPage: { ...current.categoryPage, showSidebarWidgets: event.target.checked } }))} />Show sidebar widgets</label>
              <input value={settings.categoryPage.introText} onChange={(event) => setSettings((current) => ({ ...current, categoryPage: { ...current.categoryPage, introText: event.target.value } }))} placeholder="Intro text" className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
              <input value={settings.categoryPage.sidebarHeadlinesTitle} onChange={(event) => setSettings((current) => ({ ...current, categoryPage: { ...current.categoryPage, sidebarHeadlinesTitle: event.target.value } }))} placeholder="Sidebar headlines title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.categoryPage.sidebarHeadlinesLimit} type="number" min={1} onChange={(event) => setSettings((current) => ({ ...current, categoryPage: { ...current.categoryPage, sidebarHeadlinesLimit: Number(event.target.value || 1) } }))} placeholder="Sidebar headlines limit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.categoryPage.sidebarAdsTitle} onChange={(event) => setSettings((current) => ({ ...current, categoryPage: { ...current.categoryPage, sidebarAdsTitle: event.target.value } }))} placeholder="Sidebar ads title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.categoryPage.sidebarAdsLimit} type="number" min={1} onChange={(event) => setSettings((current) => ({ ...current, categoryPage: { ...current.categoryPage, sidebarAdsLimit: Number(event.target.value || 1) } }))} placeholder="Sidebar ads limit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-bold text-slate-900">Search Page Controls</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input value={settings.searchPage.eyebrow} onChange={(event) => setSettings((current) => ({ ...current, searchPage: { ...current.searchPage, eyebrow: event.target.value } }))} placeholder="Eyebrow" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.searchPage.title} onChange={(event) => setSettings((current) => ({ ...current, searchPage: { ...current.searchPage, title: event.target.value } }))} placeholder="Title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.searchPage.placeholder} onChange={(event) => setSettings((current) => ({ ...current, searchPage: { ...current.searchPage, placeholder: event.target.value } }))} placeholder="Input placeholder" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.searchPage.buttonLabel} onChange={(event) => setSettings((current) => ({ ...current, searchPage: { ...current.searchPage, buttonLabel: event.target.value } }))} placeholder="Button label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.searchPage.emptyStateText} onChange={(event) => setSettings((current) => ({ ...current, searchPage: { ...current.searchPage, emptyStateText: event.target.value } }))} placeholder="Empty state text" className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
              <input value={settings.searchPage.resultsLabel} onChange={(event) => setSettings((current) => ({ ...current, searchPage: { ...current.searchPage, resultsLabel: event.target.value } }))} placeholder="Results label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-bold text-slate-900">News Detail Controls</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input value={settings.newsPage.breadcrumbHomeLabel} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, breadcrumbHomeLabel: event.target.value } }))} placeholder="Breadcrumb home label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.backToHomeLabel} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, backToHomeLabel: event.target.value } }))} placeholder="Back button label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.relatedMediaTitle} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, relatedMediaTitle: event.target.value } }))} placeholder="Related media title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.relatedMediaHref} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, relatedMediaHref: event.target.value } }))} placeholder="Related media href" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.videoSectionTitle} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, videoSectionTitle: event.target.value } }))} placeholder="Video title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.videoSectionCtaLabel} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, videoSectionCtaLabel: event.target.value } }))} placeholder="Video CTA label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.photoSectionTitle} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, photoSectionTitle: event.target.value } }))} placeholder="Photo title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.photoSectionCtaLabel} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, photoSectionCtaLabel: event.target.value } }))} placeholder="Photo CTA label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.stayUpdatedTitle} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, stayUpdatedTitle: event.target.value } }))} placeholder="Subscribe title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.stayUpdatedDescription} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, stayUpdatedDescription: event.target.value } }))} placeholder="Subscribe description" className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
              <input value={settings.newsPage.subscribePlaceholder} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, subscribePlaceholder: event.target.value } }))} placeholder="Email placeholder" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.subscribeButtonLabel} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, subscribeButtonLabel: event.target.value } }))} placeholder="Subscribe button label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.sidebarHeadlinesTitle} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, sidebarHeadlinesTitle: event.target.value } }))} placeholder="Sidebar headlines title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.sidebarHeadlinesLimit} type="number" min={1} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, sidebarHeadlinesLimit: Number(event.target.value || 1) } }))} placeholder="Sidebar headlines limit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.sidebarAdsTitle} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, sidebarAdsTitle: event.target.value } }))} placeholder="Sidebar ads title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={settings.newsPage.sidebarAdsLimit} type="number" min={1} onChange={(event) => setSettings((current) => ({ ...current, newsPage: { ...current.newsPage, sidebarAdsLimit: Number(event.target.value || 1) } }))} placeholder="Sidebar ads limit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
          </section>

          <LinkListEditor
            title="Primary Navigation Links"
            links={settings.primaryNavLinks}
            onAdd={() => addLinkToCollection("primaryNavLinks")}
            onRemove={(index) => removeLinkFromCollection("primaryNavLinks", index)}
            onChange={(index, patch) => updateLinkCollection("primaryNavLinks", index, patch)}
            onReorder={(fromIndex, toIndex) => reorderLinkCollection("primaryNavLinks", fromIndex, toIndex)}
          />

          <LinkListEditor
            title="Header Quick Links"
            links={settings.headerQuickLinks}
            onAdd={() => addLinkToCollection("headerQuickLinks")}
            onRemove={(index) => removeLinkFromCollection("headerQuickLinks", index)}
            onChange={(index, patch) => updateLinkCollection("headerQuickLinks", index, patch)}
            onReorder={(fromIndex, toIndex) => reorderLinkCollection("headerQuickLinks", fromIndex, toIndex)}
          />

          <LinkListEditor
            title="Footer Links"
            links={settings.footerLinks}
            onAdd={() => addLinkToCollection("footerLinks")}
            onRemove={(index) => removeLinkFromCollection("footerLinks", index)}
            onChange={(index, patch) => updateLinkCollection("footerLinks", index, patch)}
            onReorder={(fromIndex, toIndex) => reorderLinkCollection("footerLinks", fromIndex, toIndex)}
          />

          <LinkListEditor
            title="Frontend Side Menu Links"
            links={settings.sideMenuLinks}
            onAdd={() => addLinkToCollection("sideMenuLinks")}
            onRemove={(index) => removeLinkFromCollection("sideMenuLinks", index)}
            onChange={(index, patch) => updateLinkCollection("sideMenuLinks", index, patch)}
            onReorder={(fromIndex, toIndex) => reorderLinkCollection("sideMenuLinks", fromIndex, toIndex)}
          />

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-bold text-slate-900">Admin Panel Controls</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                value={settings.admin.headerTitle}
                onChange={(event) => setSettings((current) => ({ ...current, admin: { ...current.admin, headerTitle: event.target.value } }))}
                placeholder="Admin header title"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                value={settings.admin.footerText}
                onChange={(event) => setSettings((current) => ({ ...current, admin: { ...current.admin, footerText: event.target.value } }))}
                placeholder="Admin footer text"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </section>

          <LinkListEditor
            title="Admin Sidebar Links"
            links={settings.admin.sidebarLinks}
            onAdd={addAdminSidebarLink}
            onRemove={removeAdminSidebarLink}
            onChange={updateAdminSidebarLink}
            onReorder={reorderAdminSidebarLink}
            includeIcon
          />
        </>
      ) : null}

      {showThemeSections ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-slate-900">Theme Controls</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="text-sm text-slate-600">
              Accent Color
              <input
                type="color"
                value={settings.theme.accentColor}
                onChange={(event) => setSettings((current) => ({ ...current, theme: { ...current.theme, accentColor: event.target.value } }))}
                className="mt-1 h-10 w-full rounded-lg border border-slate-300"
              />
            </label>
            <label className="text-sm text-slate-600">
              Header Background
              <input
                type="color"
                value={settings.theme.headerBackground}
                onChange={(event) => setSettings((current) => ({ ...current, theme: { ...current.theme, headerBackground: event.target.value } }))}
                className="mt-1 h-10 w-full rounded-lg border border-slate-300"
              />
            </label>
            <label className="text-sm text-slate-600">
              Footer Background
              <input
                type="color"
                value={settings.theme.footerBackground}
                onChange={(event) => setSettings((current) => ({ ...current, theme: { ...current.theme, footerBackground: event.target.value } }))}
                className="mt-1 h-10 w-full rounded-lg border border-slate-300"
              />
            </label>
          </div>
        </section>
      ) : null}

      {errorMessage ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p> : null}
      {successMessage ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p> : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Site Controls"}
        </Button>
      </div>
    </form>
  );
}
