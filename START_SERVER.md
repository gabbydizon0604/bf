# How to Start the Development Server

## Option 1: Hide Watchpack Errors (Recommended)

Use the enhanced script that filters out Watchpack error messages:

```powershell
cd frontend
.\start-dev-safe.ps1
```

This will:
- ✅ Hide Watchpack error messages
- ✅ Show all other output normally
- ✅ Enable polling mode automatically

## Option 2: Simple Filter Script

Alternative script with simpler filtering:

```powershell
cd frontend
.\start-clean.ps1
```

## Option 3: Standard Start (Shows All Errors)

If you want to see all output including errors:

```powershell
cd frontend
npm run start-hmr
```

## What Are Watchpack Errors?

The "Watchpack Error" messages are harmless warnings that occur on Windows when the file watcher tries to access system folders. They don't affect:
- Application functionality
- Hot Module Replacement (HMR)
- File watching capabilities
- Build process

## Troubleshooting

If scripts don't work, check:
1. Execution policy: Run PowerShell as Administrator and execute:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. Make sure you're in the `frontend` directory:
   ```powershell
   cd frontend
   ```

3. Verify npm scripts work:
   ```powershell
   npm run start-hmr
   ```

