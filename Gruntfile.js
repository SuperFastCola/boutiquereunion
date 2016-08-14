module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'javascript/src/reunion.min.js': ["javascript/src/reunion.src.js"]
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'css/scss',
                    cssDir: 'css',
                    environment: 'development',
                    outputStyle: 'nested'
                }
            }
        },
        inject: {
          single: {
            scriptSrc: 'javascript/src/reunion.loader.js',
            files: {
              'index.html': 'src/index.html'
            }
          }
        },
        concat: {
            options: {
              separator: ';',
            },
            dist: {
              src: ['javascript/src/lib/angular.min.js','javascript/src/lib/angular-route.min.js','javascript/src/lib/angular-sanitize.min.js','javascript/src/reunion.min.js'],
              dest: 'javascript/reunion.js',
            },
        },
        replace: {
          dist: {
            options: {
              patterns: [
                {
                  match: 'includecss',
                  replacement: '<%= grunt.file.read("css/src/reunion.loading.css") %>'
                }
              ]
            },
            files: [
              {expand: true, flatten: true, src: ['./index.html'], dest: './'}
            ]
          }
        },
        watch: {
            html: {
                files: ['src/index.html'],
                tasks: ['inject']
            },
            css: {
                files: ['css/scss/reunion.styles.scss','css/src/reunion.loading.css'],
                tasks: ['compass']
            },
            scripts: {
                files: ['javascript/src/reunion.src.js','javascript/src/reunion.loader.js'],
                tasks: ['inject','uglify','concat']
            }
        }

    });

    // Load required modules
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-inject');
    grunt.loadNpmTasks('grunt-replace');
    
    // Default task(s).
    grunt.registerTask('default', ['inject', 'uglify','compass','replace','concat','watch']);
};