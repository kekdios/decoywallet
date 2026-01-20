# Git Tags Explained

## What are Git Tags?

Git tags are **labels** that mark specific points in your repository's history. Think of them as bookmarks for important commits (like releases).

## Types of Tags

### 1. **Lightweight Tags**
- Just a pointer to a specific commit
- No additional information stored
- Example: `v1.0.0`

### 2. **Annotated Tags** (Recommended for Releases)
- Store extra information (author, date, message)
- Recommended for releases
- Example: `v1.0.0` with a message

## How Tags Work with GitHub Releases

When you create a GitHub Release, you can:

1. **Create a new tag** - GitHub will create the tag for you
2. **Use an existing tag** - If you already created a tag
3. **Point to a specific commit** - Tag a particular version of your code

## Tag Naming Conventions

Common patterns:
- `v1.0.0` - Semantic versioning (most common)
- `1.0.0` - Without the 'v' prefix
- `release-1.0.0` - With prefix
- `v1.0` - Shorter version

**Recommended**: Use `v1.0.0` format (with 'v' prefix)

## Creating Tags

### Option 1: Create Tag via GitHub (Easiest)
When creating a release on GitHub:
- Select "Create new tag: v1.0.0" 
- GitHub creates the tag automatically

### Option 2: Create Tag via Command Line
```bash
# Create an annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push the tag to GitHub
git push origin v1.0.0
```

## For Your First Release (v1.0.0)

**Simplest approach**: When creating the GitHub release:
1. In the "Choose a tag" dropdown, type: `v1.0.0`
2. Select "Create new tag: v1.0.0 on publish"
3. GitHub will create the tag automatically when you publish

## What Tag Should You Use?

For version 1.0.0, use: **`v1.0.0`**

This follows semantic versioning:
- `v1.0.0` = Major.Minor.Patch
- Future releases: `v1.0.1`, `v1.1.0`, `v2.0.0`, etc.

## Viewing Tags

```bash
# List all tags
git tag

# View tag details
git show v1.0.0
```

## Summary

- **Tag** = A label/name for a specific version (like `v1.0.0`)
- **Release** = GitHub's way to package that tag with files (APK) and release notes
- **For your first release**: Use tag `v1.0.0` - GitHub can create it for you automatically
