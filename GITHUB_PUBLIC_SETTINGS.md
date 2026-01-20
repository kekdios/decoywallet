# GitHub Settings for Public Repository (Solo Maintainer)

This guide helps you make your repository public while ensuring only you can make changes.

## Step 1: Protect the Main Branch

**Settings → Code and automation → Branches**

1. Click **"Add branch protection rule"**
2. **Branch name pattern**: `main`
3. **Enable these settings**:
   - ✅ **Require a pull request before merging**
     - ✅ Require approvals: `1` (yourself)
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ **Require status checks to pass before merging** (optional, but recommended)
   - ✅ **Require conversation resolution before merging**
   - ✅ **Require signed commits** (optional, adds extra security)
   - ✅ **Require linear history** (optional, keeps history clean)
   - ✅ **Include administrators** (applies rules to you too - you can bypass if needed)
   - ✅ **Do not allow bypassing the above settings**
   - ✅ **Restrict who can push to matching branches**: Only yourself
4. Click **"Create"**

**Result**: Even if someone forks your repo, they can't push directly to your main branch.

## Step 2: Disable Features That Allow Contributions

**Settings → General → Features**

### Disable Issues (Optional)
- ❌ **Uncheck "Issues"** - Prevents others from opening issues
- *Note: You can keep this enabled if you want bug reports, but disable if you want complete control*

### Disable Pull Requests (Recommended)
- Go to **Settings → General → Pull Requests**
- ❌ **Uncheck "Allow merge commits"** (or keep checked but require your approval)
- ❌ **Uncheck "Allow squash merging"**
- ❌ **Uncheck "Allow rebase merging"**
- ❌ **Uncheck "Allow auto-merge"**

**Better approach**: Keep PRs enabled but protect the branch (Step 1) so you must approve all PRs.

### Disable Discussions
- ❌ **Uncheck "Discussions"** - Prevents community discussions

### Disable Wikis
- ❌ **Uncheck "Wikis"** - Prevents others from editing wiki

## Step 3: Restrict Collaborators

**Settings → Access → Collaborators**

1. **Remove any existing collaborators** (if any)
2. **Don't add any new collaborators**
3. Only you should have write access

## Step 4: Disable Forking (Optional - Advanced)

**Note**: GitHub doesn't allow completely disabling forks, but you can:
- Add a notice in README asking people not to fork
- Use branch protection to prevent changes to your main branch

## Step 5: Enable Release Immutability

**Settings → General → Releases**

- ✅ **Check "Enable release immutability"**
- Prevents accidental modification of published releases

## Step 6: Make Repository Public

**Settings → General → Danger Zone**

1. Click **"Change visibility"**
2. Select **"Make public"**
3. Type the repository name to confirm
4. Click **"I understand, change repository visibility"**

## Recommended Settings Summary

### ✅ Enable (Keep On):
- **Issues**: ✅ (allows bug reports, but you control responses)
- **Pull Requests**: ✅ (but protect main branch - you must approve)
- **Projects**: ✅ (if you use them)
- **Release immutability**: ✅
- **Branch protection on main**: ✅ (REQUIRED)

### ❌ Disable (Turn Off):
- **Wikis**: ❌ (unless you want to maintain it yourself)
- **Discussions**: ❌
- **Sponsorships**: ❌ (unless you want them)

### 🔒 Protect:
- **Main branch**: Require PR approval (from you)
- **No collaborators**: Only you have write access

## What This Achieves

✅ **Repository is public** - Anyone can view and download  
✅ **Only you can push** - Branch protection prevents direct pushes  
✅ **You control all changes** - All PRs require your approval  
✅ **People can fork** - But can't affect your repository  
✅ **Releases are protected** - Can't be accidentally modified  

## Important Notes

1. **Forking is always allowed** - GitHub doesn't let you disable forks, but:
   - Forks don't affect your repository
   - People can't push to your repo without your approval
   - Branch protection ensures only you can merge

2. **Pull Requests** - Even if someone creates a PR:
   - You must approve it
   - You can close it without merging
   - You have full control

3. **Issues** - If enabled:
   - People can report bugs
   - You can close/ignore them
   - You're not obligated to fix them

## Quick Checklist

Before making public:
- [ ] Set up branch protection on `main`
- [ ] Remove any collaborators
- [ ] Enable release immutability
- [ ] Review and disable unwanted features (Wikis, Discussions)
- [ ] Make repository public
- [ ] Test by trying to push (should be blocked if protection works)

After making public:
- [ ] Monitor for any unwanted PRs/issues
- [ ] Close any PRs you don't want
- [ ] Remember: You control everything!
