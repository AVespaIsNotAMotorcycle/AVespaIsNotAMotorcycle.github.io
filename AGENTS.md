<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## This repo

- Static export (`output: "export"`) deployed to GitHub Pages by
  `.github/workflows/publish.yml`. No server: no API routes, server actions,
  or runtime secrets. Data from GitHub and OpenAlex is baked in at build time
  or fetched in the browser, so anything in the page is public.
- Push with `npm run push`, not `git push`: it refreshes and commits
  `app/talkPapers.generated.json` first.
- Reading-group talks are the PDFs in the separate `reading-group` repo
  (`YYYY-MM-DD/<paper title>.pdf`). Override a talk's title, authors or note
  in `TALK_NOTES` (`app/data.ts`); don't hand-edit the generated JSON
  (delete an entry to re-fetch it).
- Site content (contact links, repos, experience, talk notes) lives in
  `app/data.ts`.
