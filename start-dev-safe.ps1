# PowerShell script to start Angular dev server and suppress Watchpack errors
# This error is harmless and doesn't affect functionality

$env:CHOKIDAR_USEPOLLING = "true"
$env:WATCHPACK_POLLING = "true"

# Function to filter out Watchpack errors while preserving all other output
function Filter-WatchpackErrors {
    $input | ForEach-Object {
        $line = $_
        if ($line -is [string]) {
            # Filter out lines containing Watchpack error messages
            if ($line -notmatch "Watchpack Error" -and 
                $line -notmatch "System Volume Information" -and
                $line -notmatch "lstat.*System Volume" -and
                $line -notmatch "EINVAL.*invalid argument") {
                Write-Host $line
            }
        } else {
            Write-Host $line
        }
    }
}

# Start the server and filter errors from both stdout and stderr
npm run start-hmr 2>&1 | Filter-WatchpackErrors
