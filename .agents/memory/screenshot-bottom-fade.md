---
name: Screenshot bottom-fade artifact
description: The app_preview screenshot tool adds a fade gradient at the bottom of the captured frame; not a real CSS bug.
---

The `screenshot` tool (`type: app_preview`) renders a soft fade/wash over content sitting at the very bottom edge of the captured frame, signalling "more content continues below". Capture height is capped at 3000px per edge, so on a tall page any section near the bottom of the capture will look washed-out / low-contrast even when its CSS is clean.

**Why:** Spent significant time chasing a phantom "gradient overlay" on Prossi's Services cards. The cards always landed at the bottom of a ≤3000px capture, so they always looked faded. The component had no overlay div at all — it was the tool's edge fade.

**How to apply:** Before debugging a "faded section", confirm whether it sits at the bottom of the screenshot frame. If so, re-capture so the section is mid-frame (or trust the source code) rather than assuming a CSS bug. Can't offset the capture start — it's always top-anchored — so for sections beyond 3000px, verify via code/typecheck instead of screenshots.
