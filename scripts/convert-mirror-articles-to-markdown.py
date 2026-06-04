#!/usr/bin/env python3

from __future__ import annotations

from bs4 import BeautifulSoup, NavigableString, Tag
from html import unescape
from pathlib import Path
import re


CONTENT_ROOTS = [
    Path("src/content/blog"),
    Path("src/content/review"),
]

MEANINGFUL_TAGS = {"p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "table", "img", "hr"}
BLOCKING_ANCESTORS = {"table", "thead", "tbody", "tr", "td", "th", "li"}
INLINE_PASSTHROUGH = {"span", "div", "small", "sup", "sub"}


def split_frontmatter(text: str) -> tuple[list[tuple[str, str]], str]:
    match = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, re.DOTALL)
    if not match:
        raise ValueError("File is missing frontmatter")

    frontmatter, body = match.groups()
    pairs: list[tuple[str, str]] = []

    for raw_line in frontmatter.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        key, raw_value = line.split(":", 1)
        value = raw_value.strip()
        if value[:1] == value[-1:] and value[:1] in {'"', "'"}:
            value = value[1:-1]
        pairs.append((key.strip(), unescape(value)))

    return pairs, body


def dump_frontmatter(pairs: list[tuple[str, str]]) -> str:
    lines = ["---"]
    for key, value in pairs:
        escaped = value.replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{key}: "{escaped}"')
    lines.append("---")
    return "\n".join(lines)


def normalize_text(text: str) -> str:
    text = unescape(text).replace("\xa0", " ")
    text = text.replace("\u200b", "")
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"\(\s+", "(", text)
    text = re.sub(r"\s+\)", ")", text)
    return text.strip()


def paragraph_text(tag: Tag) -> str:
    return normalize_text(" ".join(tag.stripped_strings))


def preserve_edge_spacing(raw: str, wrapped: str) -> str:
    leading = " " if raw[:1].isspace() else ""
    trailing = " " if raw[-1:].isspace() else ""
    return f"{leading}{wrapped}{trailing}"


def render_inline(node) -> str:
    if isinstance(node, NavigableString):
        return str(node)

    if not isinstance(node, Tag):
        return ""

    if node.name == "br":
        return "\n"

    if node.name in {"script", "style", "noscript", "svg", "path"}:
        return ""

    if node.name in {"strong", "b"}:
        raw = "".join(render_inline(child) for child in node.children)
        content = normalize_text(raw)
        return preserve_edge_spacing(raw, f"**{content}**") if content else ""

    if node.name in {"em", "i"}:
        raw = "".join(render_inline(child) for child in node.children)
        content = normalize_text(raw)
        return preserve_edge_spacing(raw, f"*{content}*") if content else ""

    if node.name == "code":
        raw = node.get_text(" ")
        content = normalize_text(raw)
        return preserve_edge_spacing(raw, f"`{content}`") if content else ""

    if node.name == "a":
        href = node.get("href", "").strip()
        raw = "".join(render_inline(child) for child in node.children)
        content = normalize_text(raw)
        if not href:
            return content
        label = content or href
        return preserve_edge_spacing(raw, f"[{label}]({href})")

    if node.name == "img":
        src = node.get("src", "").strip()
        if not src:
            return ""
        alt = normalize_text(node.get("alt", ""))
        return f"![{alt}]({src})"

    if node.name in INLINE_PASSTHROUGH:
        return "".join(render_inline(child) for child in node.children)

    return "".join(render_inline(child) for child in node.children)


def has_blocking_ancestor(tag: Tag, root: Tag) -> bool:
    parent = tag.parent
    while parent and parent != root:
        if isinstance(parent, Tag):
            if parent.name in MEANINGFUL_TAGS or parent.name in BLOCKING_ANCESTORS:
                return True
        parent = parent.parent
    return False


def render_paragraph(tag: Tag) -> str:
    return normalize_text("".join(render_inline(child) for child in tag.children))


def render_heading(tag: Tag) -> str:
    level = int(tag.name[1])
    text = normalize_text("".join(render_inline(child) for child in tag.children))
    return f'{"#" * level} {text}' if text else ""


def render_list(tag: Tag, depth: int = 0) -> str:
    lines: list[str] = []
    for index, item in enumerate(tag.find_all("li", recursive=False), start=1):
        prefix = f"{index}." if tag.name == "ol" else "-"
        inline_parts: list[str] = []
        nested_parts: list[str] = []

        for child in item.children:
            if isinstance(child, Tag) and child.name in {"ul", "ol"}:
                nested = render_list(child, depth + 1)
                if nested:
                    nested_parts.append(nested)
            else:
                inline_parts.append(render_inline(child))

        text = normalize_text("".join(inline_parts))
        if text:
            lines.append(f'{"  " * depth}{prefix} {text}')

        for nested in nested_parts:
            lines.append(nested)

    return "\n".join(lines)


def render_table(table: Tag) -> str:
    rows: list[list[str]] = []
    has_header = bool(table.find("th"))

    for row in table.find_all("tr"):
        cells = row.find_all(["th", "td"], recursive=False)
        values = []
        for cell in cells:
            text = normalize_text(" ".join(cell.stripped_strings))
            values.append(text)
        if any(values):
            rows.append(values)

    if not rows:
        return ""

    if not has_header:
        lines: list[str] = []
        for row in rows:
            values = [value for value in row if value]
            if len(values) == 2:
                lines.append(f"- {values[0].rstrip(':：')}: {values[1]}")
            elif len(values) == 4:
                lines.append(f"- {values[0].rstrip(':：')}: {values[1]}")
                lines.append(f"- {values[2].rstrip(':：')}: {values[3]}")
            else:
                lines.append("- " + " | ".join(values))
        return "\n".join(lines)

    width = max(len(row) for row in rows)
    normalized = [row + [""] * (width - len(row)) for row in rows]
    header = normalized[0]
    divider = ["---"] * width
    body = normalized[1:]
    lines = [
        "| " + " | ".join(header) + " |",
        "| " + " | ".join(divider) + " |",
    ]
    for row in body:
        lines.append("| " + " | ".join(row) + " |")
    return "\n".join(lines)


def extract_markdown(body: str, title: str) -> tuple[str, str, str]:
    soup = BeautifulSoup(body, "html.parser")
    widget = soup.select_one(".elementor-widget-theme-post-content")
    if widget is None:
        raise ValueError("Could not locate theme-post-content widget")

    root = widget.select_one('[data-elementor-type="wp-post"]') or widget
    blocks: list[str] = []
    excerpt = ""
    first_image = ""
    skipped_h1 = False

    for tag in root.find_all(list(MEANINGFUL_TAGS)):
        if has_blocking_ancestor(tag, root):
            continue

        rendered = ""
        if tag.name == "p":
            rendered = render_paragraph(tag)
            if rendered and not excerpt:
                excerpt = paragraph_text(tag)
        elif tag.name in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            heading_text = paragraph_text(tag)
            if tag.name == "h1" and not skipped_h1 and heading_text.casefold() == title.casefold():
                skipped_h1 = True
                continue
            rendered = render_heading(tag)
        elif tag.name in {"ul", "ol"}:
            rendered = render_list(tag)
        elif tag.name == "table":
            rendered = render_table(tag)
        elif tag.name == "img":
            rendered = render_inline(tag)
            if rendered and not first_image:
                first_image = tag.get("src", "").strip()
        elif tag.name == "hr":
            rendered = "---"

        rendered = rendered.strip()
        if rendered:
            blocks.append(rendered)

    markdown = "\n\n".join(block for block in blocks if block)
    markdown = re.sub(r"\n{3,}", "\n\n", markdown).strip()
    return markdown, excerpt, first_image


def cleanup_markdown_spacing(markdown: str) -> str:
    text = markdown
    text = re.sub(r"!\s+\[", "![", text)
    text = re.sub(r"\*\*\s+(.+?)\s+\*\*", r"**\1**", text)
    text = re.sub(r"\*\*\s+(.+?)\*\*", r"**\1**", text)
    text = re.sub(r"\*\*(.+?)\s+\*\*", r"**\1**", text)
    text = re.sub(r"(?<!\*)\*\s+(.+?)\s+\*(?!\*)", r"*\1*", text)
    text = re.sub(r"(?<!\*)\*\s+(.+?)\*(?!\*)", r"*\1*", text)
    text = re.sub(r"(?<!\*)\*(.+?)\s+\*(?!\*)", r"*\1*", text)
    text = re.sub(r"\[\s*([^\]\n]+?)\s*\]\(([^)]+)\)", r"[\1](\2)", text)
    chunk = r"(\*\*\*[^\n]+?\*\*\*|\*\*[^*\n]+?\*\*|(?<!\*)\*[^\n]+?\*(?!\*)|\[[^\]\n]+\]\([^)]+\))"
    text = re.sub(rf"(?<=[0-9A-Za-z.,;:?])(?={chunk})", " ", text)
    text = re.sub(rf"{chunk}(?=[0-9A-Za-z])", r"\1 ", text)
    text = re.sub(r" {2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def update_file(path: Path) -> bool:
    raw = path.read_text(encoding="utf-8")
    pairs, body = split_frontmatter(raw)
    data = dict(pairs)
    excerpt = data.get("excerpt", "")
    first_image = ""

    if "elementor-widget-theme-post-content" in body:
        markdown, excerpt, first_image = extract_markdown(body, data.get("title", ""))
    else:
        markdown = cleanup_markdown_spacing(body)

    updated_pairs: list[tuple[str, str]] = []
    for key, value in pairs:
        if key == "excerpt" and "elementor-widget-theme-post-content" in body:
            value = excerpt or data.get("description", value)
        elif key == "heroImage" and "elementor-widget-theme-post-content" in body and "LOGO" in value and first_image:
            value = first_image
        updated_pairs.append((key, value))

    next_text = dump_frontmatter(updated_pairs) + "\n\n" + markdown + "\n"
    changed = next_text != raw
    if changed:
        path.write_text(next_text, encoding="utf-8")
    return changed


def main() -> None:
    changed = 0
    for root in CONTENT_ROOTS:
        for path in sorted(root.glob("*.md")):
            if path.stem == "index":
                continue
            if update_file(path):
                changed += 1
                print(f"updated {path}")
    print(f"converted {changed} article files")


if __name__ == "__main__":
    main()
