from pathlib import Path
import re

REPLACEMENTS = {
    "\u00e2\u20ac\u00a2": "&bull;",
    "\u00e2\u02dc\u00b0": "",
    "\u00e2\u20ac\u2122": "&rsquo;",
    "\u00c2\u00a9": "&copy;",
    "\u00e2\u2020\u2018": "",
    "\u00e2\u02dc\u017d": "",
    "\u00e2\u2020\u2019": "&rarr;",
    "\u00e2\u20ac\u201c": "&ndash;",
    "\u00e2\u20ac\u201d": "&mdash;",
    "\u00e2\u20ac\u0153": "&ldquo;",
    "\u00c2\u00a0": " ",
}

SCRIPT_VERSION = "script.js?v=20261025-5"
ICON_STYLE = """<style id=\"tc-safe-icons\">.menu-icon-lines{display:flex;flex-direction:column;gap:5px;width:23px}.menu-icon-lines i{display:block;width:100%;height:2px;border-radius:99px;background:currentColor}.back-top svg,.floating-call svg,.phone-icon svg{display:block;width:1.15em;height:1.15em}.back-top svg,.floating-call svg{width:24px;height:24px}.phone-icon{display:inline-flex;align-items:center;justify-content:center;margin-right:.42em}</style>"""
PHONE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 10.8c1.8 3.5 3.1 4.8 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.4.6 3.7.6.5 0 .8.3.8.8V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.7c.5 0 .8.3.8.8 0 1.3.2 2.5.6 3.7.1.4 0 .8-.3 1.1l-2.2 2.2Z" fill="currentColor"/></svg>'
UP_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5m0 0-6 6m6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
MENU_MARKUP = '<span class="menu-icon-lines" aria-hidden="true"><i></i><i></i><i></i></span>'

changed = []
for path in Path('.').rglob('*.html'):
    text = path.read_text(encoding='utf-8-sig')
    original = text

    for bad, good in REPLACEMENTS.items():
        text = text.replace(bad, good)

    is_home = path.as_posix() == 'index.html'
    if not is_home:
        # Remove any loader block and loading state from all non-home pages.
        text = re.sub(r'<div class="site-loader" id="site-loader".*?</div></div>\s*', '', text, count=1, flags=re.S)
        text = re.sub(r'(<body class=")is-loading\s+', r'\1', text, count=1)
        text = text.replace('<body class="is-loading">', '<body>')
        # Repair the stray close tag left by older loader-removal output.
        text = re.sub(r'(<body[^>]*>)\s*</div>\s*(<div class="topbar")', r'\1\n\2', text, count=1)

    text = re.sub(
        r'(<button class="nav-toggle"[^>]*>).*?(</button>)',
        lambda m: m.group(1) + MENU_MARKUP + m.group(2),
        text,
        flags=re.S,
    )
    text = re.sub(
        r'(<button class="back-top"[^>]*>).*?(</button>)',
        lambda m: m.group(1) + UP_SVG + m.group(2),
        text,
        flags=re.S,
    )
    text = re.sub(
        r'(<a class="floating-call"[^>]*>).*?(</a>)',
        lambda m: m.group(1) + PHONE_SVG + m.group(2),
        text,
        flags=re.S,
    )

    if 'id="tc-safe-icons"' not in text:
        text = text.replace('</head>', ICON_STYLE + '</head>', 1)

    text = re.sub(r'script\.js\?v=[0-9-]+', SCRIPT_VERSION, text)

    if text != original or path.read_bytes().startswith(b'\xef\xbb\xbf'):
        path.write_text(text, encoding='utf-8', newline='\n')
        changed.append(str(path))

print('Normalized files:')
for item in changed:
    print(item)
