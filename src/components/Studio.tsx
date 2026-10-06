"use client";

/* Dynamic user/provider media intentionally uses native img elements. */
/* eslint-disable @next/next/no-img-element */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import styles from "./Studio.module.css";

type View =
  | "create"
  | "motion"
  | "avatar"
  | "library";

type Purpose =
  | "professional"
  | "creator"
  | "cinematic"
  | "social";

type Look =
  | "founder"
  | "editorial"
  | "golden"
  | "night"
  | "film"
  | "studio";

type Result = {
  id: string;
  url: string;
  createdAt: number;
  latencyMs?: number;
};

type NavItem = {
  id: View;
  label: string;
};

const navItems: NavItem[] = [
  { id: "create", label: "Create" },
  { id: "motion", label: "Motion" },
  { id: "avatar", label: "Avatar" },
  { id: "library", label: "Library" },
];

const purposes: {
  id: Purpose;
  label: string;
}[] = [
  { id: "professional", label: "Professional" },
  { id: "creator", label: "Creator" },
  { id: "cinematic", label: "Cinematic" },
  { id: "social", label: "Lifestyle" },
];

const looks: {
  id: Look;
  label: string;
}[] = [
  { id: "founder", label: "Founder portrait" },
  { id: "editorial", label: "Editorial" },
  { id: "golden", label: "Golden hour" },
  { id: "night", label: "City night" },
  { id: "film", label: "Film still" },
  { id: "studio", label: "Clean studio" },
];

function NavIcon({
  type,
}: {
  type: View;
}) {
  if (type === "create") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 5.5h15v13h-15z" />
        <path d="m7 15 3-3.2 2.8 2.6 2.2-2 2.2 2.1" />
        <circle cx="16.3" cy="8.7" r="1.3" />
      </svg>
    );
  }

  if (type === "motion") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="m10 9 5 3-5 3z" />
      </svg>
    );
  }

  if (type === "avatar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="9" r="3.2" />
        <path d="M6.5 19c.8-3.1 2.7-4.7 5.5-4.7s4.7 1.6 5.5 4.7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </svg>
  );
}

function Brand() {
  return (
    <span className={styles.brand}>
      <span className={styles.brandMark}>
        <i />
      </span>
      <strong>OneFrame</strong>
    </span>
  );
}

export default function Studio() {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [view, setView] =
    useState<View>("create");

  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [purpose, setPurpose] =
    useState<Purpose>("professional");

  const [look, setLook] =
    useState<Look>("founder");

  const [instruction, setInstruction] =
    useState("");

  const [strength, setStrength] =
    useState(45);

  const [consent, setConsent] =
    useState(false);

  const [adjustOpen, setAdjustOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [elapsed, setElapsed] =
    useState(0);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState<Result | null>(null);

  const [history, setHistory] =
    useState<Result[]>([]);

  const [showOriginal, setShowOriginal] =
    useState(false);

  const [motionPrompt, setMotionPrompt] =
    useState("");

  const [motionStyle, setMotionStyle] =
    useState("Natural");

  const [motionError, setMotionError] =
    useState("");

  const [avatarScript, setAvatarScript] =
    useState("");

  const [avatarVoice, setAvatarVoice] =
    useState("Natural");

  const [avatarError, setAvatarError] =
    useState("");

  useEffect(() => {
    if (!loading) return;

    const started = Date.now();

    const timer =
      window.setInterval(() => {
        setElapsed(
          Date.now() - started
        );
      }, 250);

    return () =>
      window.clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    return () => {
      if (
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const phase = useMemo(() => {
    if (elapsed < 2500) {
      return "Reading your photo";
    }

    if (elapsed < 8500) {
      return "Building the image";
    }

    if (elapsed < 16000) {
      return "Refining details";
    }

    return "Finishing";
  }, [elapsed]);

  function chooseFile(next: File) {
    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(next.type)
    ) {
      setError(
        "Use a JPG, PNG or WEBP image."
      );
      return;
    }

    if (
      next.size >
      10 * 1024 * 1024
    ) {
      setError(
        "Use an image smaller than 10 MB."
      );
      return;
    }

    if (
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    setFile(next);
    setPreview(
      URL.createObjectURL(next)
    );
    setResult(null);
    setShowOriginal(false);
    setError("");
  }

  function fileChange(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    const next =
      event.target.files?.[0];

    if (next) {
      chooseFile(next);
    }
  }

  function drop(
    event:
      DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    const next =
      event.dataTransfer.files?.[0];

    if (next) {
      chooseFile(next);
    }
  }

  async function generate() {
    if (!file) {
      inputRef.current?.click();
      return;
    }

    if (!consent) {
      setError(
        "Confirm that you own this photo or have permission to use it."
      );
      return;
    }

    setElapsed(0);
    setLoading(true);
    setError("");
    setShowOriginal(false);

    try {
      const body =
        new FormData();

      body.append(
        "image",
        file
      );

      body.append(
        "purpose",
        purpose
      );

      body.append(
        "look",
        look
      );

      body.append(
        "instruction",
        instruction
      );

      body.append(
        "strength",
        String(
          strength / 100
        )
      );

      body.append(
        "consent",
        "true"
      );

      const response =
        await fetch(
          "/api/generate/image",
          {
            method: "POST",
            body,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "We couldn't create this image."
        );
      }

      const url =
        data?.images?.[0]?.url;

      if (!url) {
        throw new Error(
          "No image was returned."
        );
      }

      const next: Result = {
        id:
          data.requestId ||
          crypto.randomUUID(),
        url,
        createdAt:
          Date.now(),
        latencyMs:
          data.latencyMs,
      };

      setResult(next);

      setHistory(
        (current) => [
          next,
          ...current
            .filter(
              (item) =>
                item.id !==
                next.id
            )
            .slice(0, 11),
        ]
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Image creation failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function download() {
    if (!result) return;

    try {
      const response =
        await fetch(
          result.url
        );

      const blob =
        await response.blob();

      const local =
        URL.createObjectURL(
          blob
        );

      const anchor =
        document.createElement(
          "a"
        );

      anchor.href = local;

      anchor.download =
        `oneframe-${Date.now()}.jpg`;

      document.body.appendChild(
        anchor
      );

      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(
        local
      );
    } catch {
      window.open(
        result.url,
        "_blank",
        "noopener,noreferrer"
      );
    }
  }

  function reset() {
    setFile(null);
    setPreview("");
    setResult(null);
    setInstruction("");
    setError("");
    setShowOriginal(false);
    setAdjustOpen(false);
    setView("create");
  }

  function motionSource() {
    return (
      result?.url ||
      preview ||
      ""
    );
  }

  function motionGenerate() {
    setMotionError(
      "The Motion interface is ready. The video engine still needs to be connected to this flow before a real video can be generated."
    );
  }

  function avatarGenerate() {
    setAvatarError(
      "The Avatar interface is ready. The avatar generation engine still needs to be connected before a real avatar can be generated."
    );
  }

  return (
    <div className={styles.app}>
      <input
        ref={inputRef}
        className={styles.hidden}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={fileChange}
      />

      <aside className={styles.sidebar}>
        <div>
          <button
            className={styles.brandButton}
            type="button"
            onClick={() =>
              setView("create")
            }
          >
            <Brand />
          </button>

          <nav className={styles.nav}>
            {navItems.map(
              (item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setView(
                      item.id
                    );
                    setError("");
                    setMotionError(
                      ""
                    );
                    setAvatarError(
                      ""
                    );
                  }}
                  className={
                    view === item.id
                      ? styles.navActive
                      : styles.navItem
                  }
                >
                  <span
                    className={
                      styles.navIcon
                    }
                  >
                    <NavIcon
                      type={
                        item.id
                      }
                    />
                  </span>

                  <span
                    className={
                      styles.navLabel
                    }
                  >
                    {
                      item.label
                    }
                  </span>
                </button>
              )
            )}
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <button
            type="button"
            className={styles.profile}
            title="Profile"
          >
            <span>A</span>
            <div>
              <strong>
                Account
              </strong>
              <small>
                Personal
              </small>
            </div>
          </button>
        </div>
      </aside>

      <header className={styles.mobileHeader}>
        <Brand />

        <button
          type="button"
          onClick={reset}
        >
          New
        </button>
      </header>

      <main className={styles.main}>
        {view === "create" ? (
          <section
            className={
              styles.create
            }
          >
            <header
              className={
                styles.topbar
              }
            >
              <div>
                <h1>Create</h1>

                <span>
                  Image from one
                  reference
                </span>
              </div>

              <button
                type="button"
                onClick={reset}
                className={
                  styles.newButton
                }
              >
                New
              </button>
            </header>

            <div
              className={
                styles.canvas
              }
              onDragOver={(
                event
              ) =>
                event.preventDefault()
              }
              onDrop={drop}
            >
              {!preview ? (
                <div
                  className={
                    styles.empty
                  }
                >
                  <button
                    type="button"
                    className={
                      styles.uploadOrb
                    }
                    onClick={() =>
                      inputRef
                        .current
                        ?.click()
                    }
                  >
                    +
                  </button>

                  <h2>
                    Start with
                    a photo.
                  </h2>

                  <p>
                    Upload one
                    image.
                    OneFrame will
                    handle the
                    rest.
                  </p>

                  <button
                    type="button"
                    className={
                      styles.choose
                    }
                    onClick={() =>
                      inputRef
                        .current
                        ?.click()
                    }
                  >
                    Choose photo
                  </button>

                  <small>
                    JPG, PNG or
                    WEBP · up to
                    10 MB
                  </small>
                </div>
              ) : loading ? (
                <div
                  className={
                    styles.loading
                  }
                >
                  <img
                    src={
                      preview
                    }
                    alt=""
                  />

                  <div
                    className={
                      styles.loadingWash
                    }
                  />

                  <div
                    className={
                      styles.loadingCard
                    }
                  >
                    <span
                      className={
                        styles.spinner
                      }
                    />

                    <strong>
                      {phase}
                    </strong>

                    <small>
                      {Math.max(
                        1,
                        Math.round(
                          elapsed /
                            1000
                        )
                      )}
                      s
                    </small>
                  </div>
                </div>
              ) : result ? (
                <div
                  className={
                    styles.result
                  }
                >
                  <img
                    src={
                      showOriginal
                        ? preview
                        : result.url
                    }
                    alt={
                      showOriginal
                        ? "Original"
                        : "Generated result"
                    }
                  />

                  <span
                    className={
                      styles.resultBadge
                    }
                  >
                    {showOriginal
                      ? "Original"
                      : "Result"}
                  </span>
                </div>
              ) : (
                <div
                  className={
                    styles.reference
                  }
                >
                  <img
                    src={
                      preview
                    }
                    alt="Reference"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      inputRef
                        .current
                        ?.click()
                    }
                  >
                    Change
                    photo
                  </button>
                </div>
              )}
            </div>

            {result &&
            !loading ? (
              <div
                className={
                  styles.resultActions
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowOriginal(
                      (current) =>
                        !current
                    )
                  }
                >
                  {showOriginal
                    ? "View result"
                    : "Original"}
                </button>

                <button
                  type="button"
                  onClick={
                    generate
                  }
                >
                  Variation
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setView(
                      "motion"
                    )
                  }
                >
                  Make it move
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setView(
                      "avatar"
                    )
                  }
                >
                  Create avatar
                </button>

                <button
                  type="button"
                  onClick={
                    download
                  }
                  className={
                    styles.actionPrimary
                  }
                >
                  Download
                </button>
              </div>
            ) : null}

            <div
              className={
                styles.composerArea
              }
            >
              {adjustOpen ? (
                <div
                  className={
                    styles.adjustPanel
                  }
                >
                  <div
                    className={
                      styles.adjustGroup
                    }
                  >
                    <span>
                      For
                    </span>

                    <div
                      className={
                        styles.chips
                      }
                    >
                      {purposes.map(
                        (
                          item
                        ) => (
                          <button
                            key={
                              item.id
                            }
                            type="button"
                            onClick={() =>
                              setPurpose(
                                item.id
                              )
                            }
                            className={
                              purpose ===
                              item.id
                                ? styles.chipActive
                                : styles.chip
                            }
                          >
                            {
                              item.label
                            }
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div
                    className={
                      styles.adjustGroup
                    }
                  >
                    <span>
                      Look
                    </span>

                    <div
                      className={
                        styles.chips
                      }
                    >
                      {looks.map(
                        (
                          item
                        ) => (
                          <button
                            key={
                              item.id
                            }
                            type="button"
                            onClick={() =>
                              setLook(
                                item.id
                              )
                            }
                            className={
                              look ===
                              item.id
                                ? styles.chipActive
                                : styles.chip
                            }
                          >
                            {
                              item.label
                            }
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div
                    className={
                      styles.sliderRow
                    }
                  >
                    <div>
                      <strong>
                        Change
                        amount
                      </strong>

                      <small>
                        Lower keeps
                        more of the
                        original
                      </small>
                    </div>

                    <input
                      type="range"
                      min="30"
                      max="65"
                      value={
                        strength
                      }
                      onChange={(
                        event
                      ) =>
                        setStrength(
                          Number(
                            event
                              .target
                              .value
                          )
                        )
                      }
                    />

                    <span>
                      {
                        strength
                      }
                      %
                    </span>
                  </div>
                </div>
              ) : null}

              <div
                className={
                  styles.composer
                }
              >
                <button
                  type="button"
                  className={
                    styles.attach
                  }
                  onClick={() =>
                    inputRef
                      .current
                      ?.click()
                  }
                >
                  +
                </button>

                <textarea
                  value={
                    instruction
                  }
                  onChange={(
                    event
                  ) =>
                    setInstruction(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder={
                    preview
                      ? "Describe what you want — optional"
                      : "Add a photo to begin"
                  }
                  maxLength={
                    600
                  }
                  disabled={
                    !preview ||
                    loading
                  }
                />

                <button
                  type="button"
                  className={
                    styles.adjustButton
                  }
                  disabled={
                    !preview
                  }
                  onClick={() =>
                    setAdjustOpen(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                >
                  Adjust
                </button>

                <button
                  type="button"
                  className={
                    styles.generate
                  }
                  disabled={
                    !preview ||
                    loading
                  }
                  onClick={
                    generate
                  }
                >
                  ↑
                </button>
              </div>

              {preview ? (
                <div
                  className={
                    styles.meta
                  }
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        consent
                      }
                      onChange={(
                        event
                      ) =>
                        setConsent(
                          event
                            .target
                            .checked
                        )
                      }
                    />

                    <span>
                      I own this
                      photo or
                      have
                      permission
                      to use it.
                    </span>
                  </label>

                  <span>
                    {
                      looks.find(
                        (
                          item
                        ) =>
                          item.id ===
                          look
                      )?.label
                    }
                  </span>
                </div>
              ) : null}

              {error ? (
                <div
                  className={
                    styles.error
                  }
                >
                  {error}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {view === "motion" ? (
          <section
            className={
              styles.toolPage
            }
          >
            <header
              className={
                styles.toolHeader
              }
            >
              <div>
                <span>
                  Motion
                </span>

                <h1>
                  Make the
                  moment move.
                </h1>

                <p>
                  Turn a
                  finished image
                  into a short,
                  believable
                  motion clip.
                </p>
              </div>
            </header>

            <div
              className={
                styles.toolWorkspace
              }
            >
              <div
                className={
                  styles.toolPreview
                }
              >
                {motionSource() ? (
                  <img
                    src={
                      motionSource()
                    }
                    alt="Motion source"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      inputRef
                        .current
                        ?.click()
                    }
                    className={
                      styles.toolEmpty
                    }
                  >
                    <span>
                      +
                    </span>

                    <strong>
                      Add an image
                    </strong>

                    <small>
                      Or create one
                      first
                    </small>
                  </button>
                )}
              </div>

              <div
                className={
                  styles.toolControls
                }
              >
                <span
                  className={
                    styles.controlLabel
                  }
                >
                  Movement
                </span>

                <div
                  className={
                    styles.motionStyles
                  }
                >
                  {[
                    "Natural",
                    "Portrait",
                    "Cinematic",
                    "Slow push",
                  ].map(
                    (
                      item
                    ) => (
                      <button
                        type="button"
                        key={
                          item
                        }
                        onClick={() =>
                          setMotionStyle(
                            item
                          )
                        }
                        className={
                          motionStyle ===
                          item
                            ? styles.optionActive
                            : styles.option
                        }
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>

                <label
                  className={
                    styles.field
                  }
                >
                  <span>
                    Direction
                  </span>

                  <textarea
                    value={
                      motionPrompt
                    }
                    onChange={(
                      event
                    ) =>
                      setMotionPrompt(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Optional — subtle camera push, natural hair movement..."
                  />
                </label>

                <div
                  className={
                    styles.inlineControls
                  }
                >
                  <div>
                    <span>
                      Duration
                    </span>
                    <strong>
                      5 sec
                    </strong>
                  </div>

                  <div>
                    <span>
                      Format
                    </span>
                    <strong>
                      Auto
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className={
                    styles.toolGenerate
                  }
                  disabled={
                    !motionSource()
                  }
                  onClick={
                    motionGenerate
                  }
                >
                  Generate motion
                  <span>↑</span>
                </button>

                {motionError ? (
                  <div
                    className={
                      styles.toolNotice
                    }
                  >
                    {
                      motionError
                    }
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {view === "avatar" ? (
          <section
            className={
              styles.toolPage
            }
          >
            <header
              className={
                styles.toolHeader
              }
            >
              <div>
                <span>
                  Avatar
                </span>

                <h1>
                  Give the
                  image a voice.
                </h1>

                <p>
                  Start from a
                  clear portrait
                  and create a
                  natural talking
                  avatar.
                </p>
              </div>
            </header>

            <div
              className={
                styles.toolWorkspace
              }
            >
              <div
                className={
                  styles.toolPreview
                }
              >
                {motionSource() ? (
                  <img
                    src={
                      motionSource()
                    }
                    alt="Avatar source"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      inputRef
                        .current
                        ?.click()
                    }
                    className={
                      styles.toolEmpty
                    }
                  >
                    <span>
                      +
                    </span>

                    <strong>
                      Add a portrait
                    </strong>

                    <small>
                      Front-facing
                      works best
                    </small>
                  </button>
                )}
              </div>

              <div
                className={
                  styles.toolControls
                }
              >
                <label
                  className={
                    styles.field
                  }
                >
                  <span>
                    Script
                  </span>

                  <textarea
                    value={
                      avatarScript
                    }
                    onChange={(
                      event
                    ) =>
                      setAvatarScript(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Type what the avatar should say..."
                  />
                </label>

                <span
                  className={
                    styles.controlLabel
                  }
                >
                  Voice
                </span>

                <div
                  className={
                    styles.motionStyles
                  }
                >
                  {[
                    "Natural",
                    "Warm",
                    "Clear",
                    "Energetic",
                  ].map(
                    (
                      item
                    ) => (
                      <button
                        type="button"
                        key={
                          item
                        }
                        onClick={() =>
                          setAvatarVoice(
                            item
                          )
                        }
                        className={
                          avatarVoice ===
                          item
                            ? styles.optionActive
                            : styles.option
                        }
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>

                <div
                  className={
                    styles.inlineControls
                  }
                >
                  <div>
                    <span>
                      Framing
                    </span>
                    <strong>
                      Auto
                    </strong>
                  </div>

                  <div>
                    <span>
                      Expression
                    </span>
                    <strong>
                      Natural
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className={
                    styles.toolGenerate
                  }
                  disabled={
                    !motionSource() ||
                    !avatarScript.trim()
                  }
                  onClick={
                    avatarGenerate
                  }
                >
                  Create avatar
                  <span>↑</span>
                </button>

                {avatarError ? (
                  <div
                    className={
                      styles.toolNotice
                    }
                  >
                    {
                      avatarError
                    }
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {view === "library" ? (
          <section
            className={
              styles.library
            }
          >
            <header
              className={
                styles.libraryHeader
              }
            >
              <div>
                <span>
                  Library
                </span>

                <h1>
                  Your work.
                </h1>
              </div>

              <button
                type="button"
                onClick={() =>
                  setView(
                    "create"
                  )
                }
              >
                New creation
              </button>
            </header>

            {history.length ? (
              <div
                className={
                  styles.libraryGrid
                }
              >
                {history.map(
                  (item) => (
                    <article
                      key={
                        item.id
                      }
                      className={
                        styles.libraryCard
                      }
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setResult(
                            item
                          );
                          setView(
                            "create"
                          );
                          setShowOriginal(
                            false
                          );
                        }}
                      >
                        <img
                          src={
                            item.url
                          }
                          alt=""
                        />
                      </button>

                      <div>
                        <span>
                          Image
                        </span>

                        <small>
                          This
                          session
                        </small>
                      </div>
                    </article>
                  )
                )}
              </div>
            ) : (
              <div
                className={
                  styles.libraryEmpty
                }
              >
                <span>
                  No creations yet
                </span>

                <h2>
                  Your results
                  will live here.
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setView(
                      "create"
                    )
                  }
                >
                  Create image
                </button>
              </div>
            )}
          </section>
        ) : null}
      </main>

      <nav
        className={
          styles.mobileNav
        }
      >
        {navItems.map(
          (item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setView(
                  item.id
                )
              }
              className={
                view === item.id
                  ? styles.mobileActive
                  : styles.mobileItem
              }
            >
              <NavIcon
                type={item.id}
              />

              <span>
                {item.label}
              </span>
            </button>
          )
        )}
      </nav>
    </div>
  );
}
