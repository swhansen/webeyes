module.exports = function( grunt ) {
    [

        //'grunt-cafe-mocha',

        'grunt-contrib-jshint'

       // 'grunt-exec',
       // 'grunt-link-checker',

    ].forEach( function( task ) {
        grunt.loadNpmTasks( task );
    } );

    grunt.initConfig( {

       //cafemocha: {
       //    all: {
       //        src: 'qa/entry-test.js',
       //        options: {
       //            ui: 'tdd'
       //        },
       //    }
       //},
       //'link-checker': {
       //    dev: {
       //        site: 'localhost',
       //        options: {
       //            initialPort: 5000
       //        }
       //    }
       //}

        jshint: {
                files: [ 'public/javascript/*.js' ],
                options: {
                  globals: {
                    jQuery: true
                  }
                }
        }
    } );
    grunt.registerTask( 'default', [ 'jshint' ] );
};
