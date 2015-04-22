module.exports = function (grunt) {
    [
        'grunt-cafe-mocha',
        'grunt-contrib-jshint',
        'grunt-exec',
        'grunt-link-checker',
    ].forEach(function(task) {
        grunt.loadNpmTasks(task);
    });
    // configure plugins
    grunt.initConfig({
        cafemocha: {
            all: {
                src: 'qa/entry-test.js',
                options: {
                    ui: 'tdd'
                },
            }
        },
        'link-checker': {
            dev: {
                site: 'localhost',
                options: {
                    initialPort: 5000
                }
            }
        }
        //jshint: {
        //        app: ['meadowlark.js', 'public/js/**/*.js',
        //                'lib/**/*.js'],
        //        qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
        //},
    });
    // register tasks
    grunt.registerTask('default', ['cafemocha', 'link-checker']);
};