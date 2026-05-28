<!-- rtk-instructions v2 -->

# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:

```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Nx & Build Operations

```bash
rtk nx build <project>      # Build a specific project (docs, ui)
rtk nx run-many -t build    # Build all projects in the workspace
rtk nx lint <project>       # Run ESLint on a specific project (84%)
rtk nx run-many -t lint     # Run ESLint on all projects (84%)
rtk nx format:check         # Check formatting with Prettier (70%)
rtk nx format:write         # Format workspace files with Prettier
rtk tsc                     # TypeScript errors grouped by file/code (83%)
```

### Nx & Vitest Testing

```bash
rtk nx test <project>       # Run tests for a specific project (99.5%)
rtk nx run-many -t test     # Run all tests in the workspace (99.5%)
rtk vitest                  # Run Vitest directly (99.5%)
rtk test <cmd>              # Generic test wrapper - failures only
```

### Nx & Tooling

```bash
rtk nx serve <project>      # Start development server (docs)
rtk nx wrangler <project>   # Run Wrangler development server via Nx
rtk nx deploy <project>     # Deploy application via Wrangler
rtk nx graph                # View project dependency graph
rtk nx affected -t <target> # Run a target (build, test, lint) on affected projects
rtk nx reset                # Reset Nx workspace cache
```

### Git

```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub

```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### Package Management

```bash
rtk bun install         # Compact Bun install output (90%)
rtk bun run <script>    # Compact Bun script output
rtk bunx <cmd>          # Compact bunx command output
```

### Files & Search

```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%). Format flags (-c, -l, -L, -o, -Z) run raw.
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug

```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Meta Commands

```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

<!-- /rtk-instructions -->
