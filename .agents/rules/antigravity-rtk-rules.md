# RTK - Rust Token Killer (Google Antigravity)

**Usage**: Token-optimized CLI proxy for shell commands.

## Rule

Always prefix shell commands with `rtk` to minimize token consumption.

Examples:

```bash
# Nx & Workspace Operations
rtk nx build docs            # Build project (docs, ui)
rtk nx serve docs            # Run dev server
rtk nx test docs             # Run tests via Vitest
rtk nx lint docs             # Run ESLint on project
rtk nx run-many -t build     # Build all projects in workspace
rtk nx run-many -t test      # Run all tests in workspace
rtk nx format:write          # Format workspace files with Prettier
rtk nx affected -t test      # Run tests on affected projects
rtk nx reset                 # Reset Nx workspace cache

# Package Management (Bun)
rtk bun install              # Compact install dependencies
rtk bun run <script>         # Run workspace scripts

# Git
rtk git status               # Compact git status
rtk git diff                 # Compact git diff

# Files & Search
rtk ls apps/                 # Compact tree view of directory
rtk grep "pattern" libs/     # Search codebase by pattern
rtk find "*.ts" .            # Find files by pattern
```

## Meta Commands

```bash
rtk gain              # Show token savings
rtk gain --history    # Command history with savings
rtk discover          # Find missed RTK opportunities
rtk proxy <cmd>       # Run raw (no filtering, for debugging)
```

## Why

RTK filters and compresses command output before it reaches the LLM context, saving 60-90% tokens on common operations. Always use `rtk <cmd>` instead of raw commands.
