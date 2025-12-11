// Custom webpack configuration to ignore system folders
module.exports = {
  watchOptions: {
    ignored: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.angular/**',
      '**/System Volume Information/**',
      '**/$RECYCLE.BIN/**',
      '**/System Volume Information',
      /System Volume Information/,
      /System Volume Information\/.*/,
      /.*System Volume Information.*/,
      // Windows system folders
      '**/pagefile.sys',
      '**/hiberfil.sys',
      '**/Thumbs.db',
      '**/.DS_Store'
    ],
    poll: 2000,
    aggregateTimeout: 300,
    followSymlinks: false
  }
};

