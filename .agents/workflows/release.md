---
description: how to release a new version of STS
---

Follow these steps to release a new version of the Shift Tracking System (STS).

### 1. Update Version in package.json
// turbo
Update the `version` field in both the backend and frontend `package.json` files.
- `backend/package.json`
- `frontend/vite-project/package.json`

### 2. Update CHANGELOG.md
Add a new section for the version in the `CHANGELOG.md` file. Follow the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.
- Use the `## [x.y.z] - YYYY-MM-DD` header.
- List changes under `Added`, `Changed`, `Fixed`, or `Removed`.

### 3. Commit the Release
// turbo
Commit the version bump and changelog update.
```bash
git add .
git commit -m "chore: release v1.0.0-beta.1"
```

### 4. Create a Git Tag
// turbo
Create a tag and push it to the remote repository.
```bash
git tag v1.0.0-beta.1
git push origin main --tags
```

### 5. Deploy
Ensure your CI/CD pipeline (e.g., Render) picks up the new tag or the latest commit on `main`.
