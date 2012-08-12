/**
 * Created with JetBrains WebStorm.
 * Author: Igor Zalutsky
 * Date: 11.08.12
 * Time: 22:56
 */

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        lint: {
            all: ['grunt.js', 'src/**/*.js', 'test/tests/*.js']
        },
        jshint: {
            options: {
                browser: true
            }
        },
        concat: {
            app: {
                src: ['src/utils/*.js', 'src/models/*.js', 'src/views/*.js', 'src/controllers/*.js', 'src/*.js'],
                dest: 'elist.js'
            },
            test: {
                src: ['test/tests/*.js'],
                dest: 'test/tests.js'
            }
        },
        min: {
            all: {
                src: ['elist.js'],
                dest: 'elist.min.js'
            }
        }
    });

    // Default task.
    grunt.registerTask('default', 'lint concat:app min concat:test');

};