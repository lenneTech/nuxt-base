module.exports = function (grunt) {
  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sync');
  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Init Config
  grunt.initConfig({
    // NonGrunt watcher
    bgShell: {
      _defaults: {
        bg: true,
      },

      // Restart server
      pm2: {
        bg: false,
        cmd: 'npx pm2 startOrRestart pm2.config.js',
      },

      // Restart server
      pm2Prod: {
        bg: false,
        cmd: 'npx pm2 startOrRestart pm2.config.js --env production',
      },

      // Typescript compiler
      tsc: {
        bg: false,
        cmd: 'npx tsc -p tsconfig.build.json',
      },

      // Typescript compiler + watch
      tscWatch: {
        cmd: 'npx tsc -w -p tsconfig.build.json',
      },
    },

    // CleanUp build
    clean: {
      buildFolder: ['dist'],
    },

    pkg: grunt.file.readJSON('package.json'),

    // Copy files
    sync: {
      assets: {
        failOnError: true,
        files: [{ cwd: 'src/assets', dest: 'dist/assets/', src: ['**'] }],
        updateAndDelete: true,
        verbose: true,
      },
      meta: {
        files: [{ dest: 'dist/meta.json', src: './package.json' }],
      },
      templates: {
        failOnError: true,
        files: [{ cwd: 'src/assets/templates', dest: 'dist/assets/templates/', src: ['**'] }],
        updateAndDelete: true,
        verbose: true,
      },
    },

    // Watch for file changes
    watch: {
      templates: {
        files: 'src/assets/template/**/*',
        tasks: ['sync:assets'],
      },
    },
  });
  grunt.event.on('watch', function (action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  // Register tasks
  grunt.registerTask('default', [
    'clean:buildFolder',
    'bgShell:tsc',
    'sync:assets',
    'sync:meta',
    'bgShell:tscWatch',
    'bgShell:pm2',
    'watch',
  ]);
  grunt.registerTask('production', [
    'clean:buildFolder',
    'bgShell:tsc',
    'sync:assets',
    'sync:meta',
    'bgShell:tscWatch',
    'bgShell:pm2Prod',
    'watch',
  ]);
  grunt.registerTask('build', ['clean:buildFolder', 'sync:assets', 'sync:meta', 'bgShell:parsLocales', 'bgShell:tsc']);
};
