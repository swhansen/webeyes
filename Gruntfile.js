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
        'link-checker': {
            dev: {
                site: 'localhost',
                options: {
                    initialPort: 8080
                }
            }
        },
        cafemocha: {
            all: {
                src: 'qa/entry-test.js',
                options: {
                    ui: 'tdd'
                },
            }
        },
        //jshint: {
        //        app: ['meadowlark.js', 'public/js/**/*.js',
        //                'lib/**/*.js'],
        //        qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
        //},
        //exec: {
        //        linkchecker:
        //              { cmd: 'linkchecker http://localhost:8080' }
        //},
    });
    // register tasks
    grunt.registerTask('default', ['cafemocha', 'link-checker']);
};