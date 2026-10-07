# Contributing

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Before submitting changes:

```bash
npm run check
npm audit --omit=dev
```

Keep the public interface consumer-focused.
Do not expose provider or model internals.
Never commit credentials.
Do not add fake quality metrics or unmeasured performance claims.
