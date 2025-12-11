# Watchpack Error - Known Issue

## About the Error

If you see this error periodically:
```
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'E:\System Volume Information'
```

**This is a harmless warning** that occurs on Windows systems. It does NOT affect:
- Application functionality
- Hot Module Replacement (HMR)
- Development server performance
- File watching capabilities

## Why It Happens

The Angular development server's file watcher (Watchpack) attempts to scan all files in the project directory and sometimes encounters Windows system folders like "System Volume Information" that have restricted access. This causes the warning, but the watcher continues to work normally.

## Solutions

### Option 1: Ignore It (Recommended)
This error is cosmetic and can be safely ignored. Your application will work perfectly fine.

### Option 2: Use Polling Mode (Already Configured)
The project is already configured with polling mode which should minimize these errors. If you still see them, they're harmless.

### Option 3: Use the Safe Start Script
Use the `start-dev-safe.ps1` script which filters out these warnings:
```powershell
.\start-dev-safe.ps1
```

### Option 4: Suppress in Console
If using PowerShell, you can suppress the error output:
```powershell
npm run start-hmr 2>$null
```

## Current Configuration

The project is configured with:
- Polling mode enabled (`poll: 2000`)
- Environment variables for polling (`CHOKIDAR_USEPOLLING=true`)
- Watchpack polling enabled (`WATCHPACK_POLLING=true`)

If you still see the error occasionally, it's completely normal and safe to ignore.

## References

- [Angular CLI Issue #18888](https://github.com/angular/angular-cli/issues/18888)
- [Webpack Watchpack Known Issues](https://github.com/webpack/watchpack)

