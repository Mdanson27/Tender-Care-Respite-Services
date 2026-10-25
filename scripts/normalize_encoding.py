from pathlib import Path

REPLACEMENTS = {
    "\u00e2\u20ac\u00a2": "&bull;",
    "\u00e2\u02dc\u00b0": "&#9776;",
    "\u00e2\u20ac\u2122": "&rsquo;",
    "\u00c2\u00a9": "&copy;",
    "\u00e2\u2020\u2018": "&#8593;",
    "\u00e2\u02dc\u017d": "&#9742;",
    "\u00e2\u2020\u2019": "&rarr;",
    "\u00e2\u20ac\u201c": "&ndash;",
    "\u00e2\u20ac\u201d": "&mdash;",
    "\u00e2\u20ac\u0153": "&ldquo;",
    "\u00c2\u00a0": " ",
}

SCRIPT_VERSIONS = (
    "script.js?v=20261025-3",
    "script.js?v=20261025-2",
    "script.js?v=20261002-3",
    "script.js?v=20261002-2",
    "script.js?v=20261002-1",
)

changed = []
for path in Path('.').rglob('*.html'):
    text = path.read_text(encoding='utf-8-sig')
    original = text
    for bad, good in REPLACEMENTS.items():
        text = text.replace(bad, good)
    for old in SCRIPT_VERSIONS:
        text = text.replace(old, 'script.js?v=20261025-4')
    if text != original or path.read_bytes().startswith(b'\xef\xbb\xbf'):
        path.write_text(text, encoding='utf-8', newline='\n')
        changed.append(str(path))

print('Normalized files:')
for item in changed:
    print(item)
