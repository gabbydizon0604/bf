# PowerShell script to start Angular dev server with proper environment variables
$env:CHOKIDAR_USEPOLLING = "true"
$env:WATCHPACK_POLLING = "true"
$env:WATCHPACK_AGGREGATE_TIMEOUT = "300"
# Suppress watchpack errors
$env:NODE_OPTIONS = "--max-old-space-size=4096"
npm run start-hmr

