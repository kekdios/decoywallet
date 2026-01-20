# Fix Branch Protection to Allow Your Pushes

Your branch protection is currently blocking your pushes. Here's how to fix it so YOU can push directly while still protecting from others.

## The Problem

Branch protection is enabled with:
- ✅ Require verified signatures
- ✅ Require pull requests

This blocks even you (the owner) from pushing directly.

## The Solution

You need to allow administrators (you) to bypass these restrictions.

## Steps to Fix

### Option 1: Allow Administrators to Bypass (Recommended)

1. Go to **Settings → Code and automation → Branches**
2. Click on your **branch protection rule** for `main`
3. Scroll down to find: **"Include administrators"**
4. **UNCHECK** "Include administrators" 
   - This allows you (as admin) to bypass the restrictions
   - Others still can't push directly
5. Scroll down and click **"Save changes"**

### Option 2: Disable Specific Restrictions for Admins

If you want to keep "Include administrators" checked, you can:

1. In branch protection settings, find:
   - **"Require signed commits"** - Uncheck this (or allow admins to bypass)
   - **"Require a pull request before merging"** - Uncheck "Include administrators"

### Option 3: Temporarily Disable Branch Protection

If you need to push immediately:

1. Go to **Settings → Code and automation → Branches**
2. Click on your branch protection rule
3. Scroll to bottom and click **"Delete"**
4. Push your changes
5. Re-enable branch protection with "Include administrators" unchecked

## Recommended Settings for Solo Maintainer

**Branch Protection Rule for `main`:**

- ✅ Require a pull request before merging
  - ✅ Require approvals: `1`
  - ❌ **Include administrators** ← UNCHECK THIS
- ✅ Require signed commits (optional)
  - ❌ **Include administrators** ← UNCHECK THIS  
- ✅ Restrict who can push to matching branches: Only yourself
- ✅ Do not allow bypassing the above settings (for non-admins)

**Result:**
- ✅ You can push directly (as admin)
- ✅ Others must create PRs (which you approve)
- ✅ Others can't push directly

## After Fixing

Try pushing again:
```bash
git push origin main
```

If you still get errors, you may need to:
1. Sign your commits (if you want to keep that requirement)
2. Or disable "Require signed commits" entirely

## Quick Fix Command

If you want to push immediately and fix settings later:

1. Temporarily disable branch protection
2. Push your changes
3. Re-enable branch protection with "Include administrators" unchecked
