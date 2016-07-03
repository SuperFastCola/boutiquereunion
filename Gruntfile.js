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
        sass: {
            options: {
                sourcemap: 'none',
                trace: true,
                style: 'none'
            },
            compile: {
                files: {
                  'css/reunion.styles.css': 'css/src/reunion.styles.sass',
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
        watch: {
            css: {
                files: ['css/src/reunion.styles.sass'],
                tasks: ['sass']
            },
            scripts: {
                files: 'javascript/src/reunion.src.js',
                tasks: ['uglify','concat']
            }
        }

    });

    // Load required modules
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    // Default task(s).
    grunt.registerTask('default', ['uglify','sass','concat','watch']);
};