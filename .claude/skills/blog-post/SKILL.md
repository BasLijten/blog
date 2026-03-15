---
name: blog-post
description: Generate a blog post from a research document, matching Bas Lijten's writing style
argument-hint: <path-to-research-document>
disabled-model-invocation: true
---

# Blog Post Generator

Generate a blog post from a research document. Read the document provided as `$ARGUMENTS`, extract key insights, and produce a complete blog post.

## Steps

1. Read the research document at the path provided in `$ARGUMENTS`
2. Identify the core problem, solution, and key technical details
3. Determine appropriate slug, categories, and tags
4. Create the post directory: `content/blog/[slug]/`
5. Create `content/blog/[slug]/images/` directory
6. Write the blog post to `content/blog/[slug]/index.md`

## Frontmatter

```yaml
---
title: "lowercase descriptive title - use problem or how-to framing"
date: YYYY-MM-DD
description: "1-2 sentence summary of the post"
img: ./images/banner.jpg
categories: ["category1", "category2"]
tags: ["tag1", "tag2"]
---
```

- **title**: Lowercase start, descriptive. Prefer "how to..." or problem-focused framing
- **date**: Today's date
- **categories**: Broad domain tags (e.g., "Sitecore", "Azure", "Kubernetes", ".Net")
- **tags**: Specific technology names and tools
- **img**: Always `./images/[name].[ext]` — note that the image must be provided or created separately

## Writing Style Guide

### Voice and tone

- **First person, conversational**: Write as "I" and address the reader as "you". This is a personal technical blog, not documentation
- **Honest and humble**: Acknowledge when something was confusing, when documentation was unclear, or when the solution isn't elegant. Phrases like "it was a real discovery tour", "totally unexpected", "not the most elegant solution, but..." are natural
- **Enthusiastic about discovery**: Show genuine interest in solving the problem. Use phrases like "the fun part is", "guess what?"
- **No emojis**: Professional tone throughout
- **No lecturing**: Share the journey, don't talk down to the reader

### Opening (first 2-3 paragraphs)

- **Start with the problem or personal observation** — never with definitions or generic introductions
- Establish WHY this matters: what pain point led to writing this post
- Examples of good openings:
  - "After making the decision to move the editorhost to Vercel, we started to see a lot of `ClientClosed` errors..."
  - "I often forget to open my windows terminal with admin privileges..."
  - "Not only has the Sitecore documentation some conflicting statements..."
- Ground the reader in a relatable scenario before any technical detail

### Structure

- **H2 (`##`) headers only** for major sections. Use H3 (`###`) sparingly, only when a section genuinely needs subsections
- **Sentence case** for headers (capitalize first word and proper nouns only)
- **No H1** in the body — the title comes from frontmatter
- **Problem → Solution flow**: Establish the problem, explain the cause, present the solution
- Mark optional sections with "(Optional)" in the header when applicable
- Use clear section breaks between problem description and solution

### Body content

- **Mix paragraph lengths**: Short punchy paragraphs (2-3 sentences) for key points, longer paragraphs for context and explanation
- **Code blocks always preceded by narrative**: Never drop code without explaining what it does and where it goes. After the block, explain implications or gotchas
- **Use language-specific syntax highlighting**: Always specify the language on code fences (```yaml, ```csharp, ```typescript, ```powershell, ```bash, ```json)
- **Show actual error messages**: Include real error output in code blocks — this makes posts searchable and relatable
- **Bold for key terms** on first mention. Use backticks for inline code references (commands, file names, variable names)
- **Italic used sparingly** — mainly for file names or subtle emphasis
- **Blockquotes (`>`)** for important warnings or notes
- **Before/After comparisons**: Show what happens without the solution vs. with it when applicable

### Linking

- **Inline contextual links**: Weave links naturally into sentences
- **Relative paths** for internal blog links: `../post-name/`
- **Descriptive link text**: Use meaningful text, not "click here"
- **Reference official documentation** where relevant

### Series posts

- Include "part N" or "Pt N" in titles
- Explicitly link to previous/next parts
- Each post should be independently readable but reference context from other parts

### Closing

- **Always include a `## Summary` section**
- Restate the problem and solution concisely
- Include actionable takeaways — what should the reader do next
- End on an encouraging, positive note (e.g., "Get started today!")
- Optionally reference related or follow-up posts

### Length

- Target **2,000–4,000 words** depending on complexity
- Simple tips/fixes can be shorter (~500-1,000 words)
- Complex architectural posts can be longer
- Prioritize information density over padding

## Quality checklist

Before finishing, verify:
- [ ] Frontmatter is complete and valid
- [ ] Title starts lowercase and uses problem/how-to framing
- [ ] Post opens with a problem or personal observation
- [ ] Code blocks have language tags and narrative context
- [ ] There is a `## Summary` section at the end
- [ ] Tone is conversational and first-person throughout
- [ ] Image references use `./images/` relative paths
- [ ] Internal links use relative paths
