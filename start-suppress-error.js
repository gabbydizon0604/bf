/**
 * Wrapper script to suppress Watchpack errors when running Angular dev server
 * Filters out "Watchpack Error" messages from both stdout and stderr
 */

const { spawn } = require('child_process');
const path = require('path');

// Get the command and arguments
const args = process.argv.slice(2);
const command = args[0] || 'ng';
const commandArgs = args.slice(1);

// Start the Angular CLI process
const ngProcess = spawn(command, commandArgs, {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
  cwd: __dirname
});

// Function to filter Watchpack errors
function shouldFilterOutput(output) {
  const lowerOutput = output.toLowerCase();
  return lowerOutput.includes('watchpack error') ||
         lowerOutput.includes('einval: invalid argument') ||
         lowerOutput.includes('system volume information') ||
         lowerOutput.includes('lstat \'e:\\system volume information\'');
}

// Filter stdout to remove Watchpack errors
ngProcess.stdout.on('data', (data) => {
  const output = data.toString();
  
  // Split by lines to filter more accurately
  const lines = output.split('\n');
  const filteredLines = lines.filter(line => !shouldFilterOutput(line));
  
  if (filteredLines.length > 0) {
    process.stdout.write(filteredLines.join('\n'));
  }
});

// Filter stderr to remove Watchpack errors
ngProcess.stderr.on('data', (data) => {
  const output = data.toString();
  
  // Split by lines to filter more accurately
  const lines = output.split('\n');
  const filteredLines = lines.filter(line => !shouldFilterOutput(line));
  
  if (filteredLines.length > 0) {
    process.stderr.write(filteredLines.join('\n'));
  }
});

// Handle process exit
ngProcess.on('exit', (code) => {
  process.exit(code || 0);
});

// Handle errors
ngProcess.on('error', (error) => {
  console.error('Error starting Angular CLI:', error);
  process.exit(1);
});

