# Laundry Connect – AI Workflow

## Tool Roles
- **Claude Code** → planning, reasoning, architecture, validation
- **Gemini CLI** → directory-scoped scanning, bulk analysis, cross-file execution

## When to Delegate to Gemini CLI
Always delegate to Gemini CLI when:
- Scanning any directory for patterns or inconsistencies
- Auditing code across multiple files
- Bulk refactoring across more than 3 files
- Any task that involves reading more than one file at a time

## Gemini CLI Commands

```bash
# Scan services directory (scoped to avoid memory issues)
gemini -p "@src/services/ [your task here]" > output.md
```

> Never use `--allfiles` or scan large directories — will run out of memory on this machine.
> Do not use `2>&1 &` background syntax on Windows — run commands directly.

## Workflow Pattern
1. **Plan** with Claude Code — define structure, flag edge cases
2. **Execute** with Gemini CLI — always use Gemini CLI for any scan or audit of `@src/services/`, then immediately refactor at scale without waiting for confirmation
3. **Validate** with Claude Code — confirm consistency before committing
