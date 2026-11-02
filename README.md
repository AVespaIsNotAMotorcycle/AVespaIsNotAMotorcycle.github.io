# AVespaIsNotAMotorcycle.github.io

Personal site of Sasha Madden Ebersole: <https://avespaisnotamotorcycle.github.io>.
A static Next.js export deployed to GitHub Pages on every push to `main`.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in out/
```

## Editing content

Contact links, featured repos, experience, and reading-group talk notes are in
`app/data.ts`.

The reading-group table lists the PDFs in the
[reading-group](https://github.com/AVespaIsNotAMotorcycle/reading-group) repo,
named `YYYY-MM-DD/<paper title>.pdf`. Each paper's title and authors are
looked up on [OpenAlex](https://openalex.org) at build time
(`npm run fetch-authors`, saved to `app/talkPapers.generated.json`); talks
added since the last build are looked up in the browser. To override a title
or authors, or add a note, add the PDF's path to `TALK_NOTES`.

## Deploy

```bash
npm run push    # refreshes the paper list, commits it if changed, pushes
```

The deploy workflow can use an optional `OPENALEX_API_KEY` repo secret for a
larger OpenAlex budget than the keyless one.
