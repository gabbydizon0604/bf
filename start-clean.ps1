# Simple script to hide Watchpack errors - Alternative method
$env:CHOKIDAR_USEPOLLING = "true"
$env:WATCHPACK_POLLING = "true"

# Filter and display output without Watchpack errors
npm run start-hmr 2>&1 | Where-Object { 
    $_ -notmatch "Watchpack Error" -and 
    $_ -notmatch "System Volume Information" -and
    $_ -notmatch "EINVAL"
}

