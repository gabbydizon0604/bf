# Suppressing Watchpack Error

## Problem
When running the Angular development server, you may see this error:
```
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'E:\System Volume Information'
```

## Solution
This error has been suppressed using a wrapper script that filters out Watchpack error messages.

## Usage

### Option 1: Use the Updated Scripts (Recommended)
The following npm scripts now automatically suppress Watchpack errors:

```bash
# Start with HMR (Hot Module Replacement)
npm run start-hmr

# Start with HMR and source maps
npm run start-hmr-sourcemaps

# Start dev server (basic)
npm run serve

# Start dev server with HMR
npm run serve-hmr
```

### Option 2: Direct Usage
If you need to run `ng serve` directly, use the wrapper script:

```bash
node start-suppress-error.js ng serve
```

Or with options:
```bash
node start-suppress-error.js ng serve --hmr --port 4200
```

### Option 3: Original Commands (Will Show Error)
If you run the original commands, the error will still appear (but it's harmless):

```bash
ng serve
npm start  # This uses server.js for production, not dev server
```

## How It Works
The `start-suppress-error.js` script:
1. Wraps the Angular CLI command
2. Intercepts stdout and stderr
3. Filters out lines containing "Watchpack Error", "EINVAL", or "System Volume Information"
4. Passes through all other output normally

## Note
- The Watchpack error is **cosmetic only** and doesn't affect functionality
- File watching still works correctly
- Hot Module Replacement (HMR) still works
- The error occurs because Windows restricts access to "System Volume Information" folder

## Alternative: Environment Variables
You can also set these environment variables before running:
```bash
set WATCHPACK_POLLING=true
set CHOKIDAR_USEPOLLING=true
ng serve
```

However, the wrapper script method is more reliable for suppressing the error message.

