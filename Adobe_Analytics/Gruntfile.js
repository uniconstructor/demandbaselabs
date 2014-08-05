module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            default: {
                options: { livereload: true },
                files: [
                    'Gruntfile.js',
                    '**\/*.js',
                    '**\/*.html'
                ],
                tasks: [
                ],
                options: {
                    spawn: true,
                    reload: true,
                    livereload: true
                }
            }
        },
        open: {
            default: {
                path: 'http://localhost:3111/specs/asyncSpec.html'
            }
        },
        server: {
            port: 3111,
            base: '/Users/mdowns/Dropbox/github/demandbaselabs/Adobe_Analytics/specs/'
        },
        qunit: {
            all: ['specs/**/*.html']
        }
    });//end grunt.initConfig

    // load all grunt tasks matching the `grunt-*` pattern
    // Note: can use broader pattern, if new plugs require
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['connect', 'open', 'watch']);

    //setup node server for testing:
    var connect = require('connect'),
        http = require('http'),
        serveStatic = require('serve-static'),
        directory = require('serve-index'),
        bodyParser = require('body-parser'),
        app = connect()
              .use(bodyParser.urlencoded({extended: true}))
              .use(directory('/Users/mdowns/Dropbox/github/demandbaselabs/Adobe_Analytics/'))
              .use( serveStatic('/Users/mdowns/Dropbox/github/demandbaselabs/Adobe_Analytics/'))
              .use(require('connect-livereload')({ port: 35729 }));

    // Define a "connect" task that starts a webserver, using connect:
    grunt.registerTask('connect', 'Start a web server.', function() {
      grunt.log.writeln('Starting web server on port 3111...');
      http.createServer(app).listen(3111);
    });

    grunt.event.on('watch', function(action, filepath, target) {
      grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

}; //end module.exports