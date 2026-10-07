"use client";

/* Session-generated media intentionally uses native img elements. */
/* eslint-disable @next/next/no-img-element */

import styles from "./LibraryPanel.module.css";

export type LibraryImage = {
  id: string;
  url: string;
  createdAt: number;
  latencyMs?: number;
};

type Props = {
  images: LibraryImage[];
  onOpenImage: (item: LibraryImage) => void;
  onCreate: () => void;
};

export default function LibraryPanel({
  images,
  onOpenImage,
  onCreate,
}: Props) {
  return (
    <section className={styles.library}>
      <header className={styles.header}>
        <div>
          <span>Library</span>
          <h1>Your work.</h1>
          <p>Images generated during this session.</p>
        </div>

        <button type="button" onClick={onCreate}>
          New creation
        </button>
      </header>

      {images.length ? (
        <div className={styles.grid}>
          {images.map((item) => (
            <article key={item.id}>
              <button
                type="button"
                className={styles.imageButton}
                onClick={() => onOpenImage(item)}
              >
                <img src={item.url} alt="Generated OneFrame result" />
              </button>

              <div className={styles.meta}>
                <span>Image</span>
                <small>This session</small>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span>Nothing here yet</span>
          <h2>Create your first image.</h2>
          <button type="button" onClick={onCreate}>
            Start creating
          </button>
        </div>
      )}
    </section>
  );
}
