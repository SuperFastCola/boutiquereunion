
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
        sass: {                              // Task
            dist: {                            // Target
                options: {                       // Target options
                    style: 'expanded'
                },
                files: {
                    'css/reunion.styles.css' : 'css/scss/reunion.styles.scss',
                    'css/legacy.styles.css' : 'css/scss/legacy.styles.scss'
                }
            }
        },
        // sass: {
        //     options: {
        //         implementation: sass,
        //         sourceMap: false
        //     },
        //     dist: {
        //         files: {
        //             'reunion.styles.css': 'css/scss/*.scss'
        //         }
        //     }
        // },
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
                files: ['css/scss/reunion.styles.scss','css/src/reunion.loading.css','css/scss/legacy.styles.scss'],
                tasks: ['sass']
            },
            scripts: {
                files: ['javascript/src/reunion.src.js','javascript/src/reunion.loader.js'],
                tasks: ['uglify','concat','inject']
            }
        }

    });

    // Load required modules
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-inject');
    grunt.loadNpmTasks('grunt-replace');
    
    // Default task(s).
    grunt.registerTask('default', ['inject', 'uglify','sass','replace','concat','watch']);
};