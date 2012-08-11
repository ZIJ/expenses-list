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
            all: ['grunt.js', 'src/*.js', 'test/*.js']
        },
        jshint: {
            options: {
                browser: true
            }
        },
        concat: {
            app: {
                src: ['src/utils.js', 'src/eventEmitter.js', 'src/models.js', 'src/views.js'],
                dest: 'app.js'
            }
        },
        min: {
            app: {
                src: ['app.js'],
                dest: 'app.min.js'
            }
        }
    });

    // Default task.
    grunt.registerTask('default', 'lint concat min');

};