# Scripts Directory

This directory contains utility scripts to help maintain your project.

## Dependency Sync Scripts

### Windows (PowerShell)
```powershell
npm run sync-deps
```

### Linux/Mac (Bash)
```bash
chmod +x scripts/sync-deps.sh
./scripts/sync-deps.sh
```

## When to Use

Run these scripts when you encounter:
- `npm ci` errors about missing packages
- Lock file sync issues
- Dependency installation problems

## What They Do

1. Remove the existing `package-lock.json`
2. Remove the `node_modules` directory
3. Run `npm install` to regenerate everything
4. Ensure your lock file matches your `package.json`

## After Running

1. Test that everything works: `npm run test`
2. Commit the updated `package-lock.json`
3. Push to trigger CI/CD pipeline
