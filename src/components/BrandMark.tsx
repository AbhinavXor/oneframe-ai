export default function BrandMark({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <span
      aria-label="OneFrame"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? 0 : 10,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1px solid currentColor",
          display: "inline-block",
          position: "relative",
          flex: "0 0 auto",
        }}
      >
        <span
          style={{
            position: "absolute",
            width: 13,
            height: 1,
            background: "currentColor",
            left: 7,
            top: 13,
          }}
        />
        <span
          style={{
            position: "absolute",
            width: 1,
            height: 13,
            background: "currentColor",
            left: 13,
            top: 7,
          }}
        />
        <span
          style={{
            position: "absolute",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#ee6b35",
            right: 3,
            top: 3,
          }}
        />
      </span>

      {!compact ? (
        <strong
          style={{
            fontSize: 14,
            letterSpacing: "-.025em",
            fontWeight: 680,
          }}
        >
          OneFrame
        </strong>
      ) : null}
    </span>
  );
}
