var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html', 'src/*.css']
};
var webserver = require('gulp-webserver');
var awspublish = require('gulp-awspublish');
var parallelize = require('concurrent-transform');
var del = require('del');

/**
 * Publish files to S3
 */
gulp.task('publish', function() {
    // create a new publisher using S3 options
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
    var publisher = awspublish.create({
        region: 'us-west-2',
        params: {
            Bucket: 'three-ts.selby.io'
        },
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    return gulp.src('./dist/*')
        // process in parallelize with concurrency 10
        .pipe(parallelize(publisher.publish(), 10))
        // sync instead of just posting
        .pipe(publisher.sync())
        // print upload updates to console
        .pipe(awspublish.reporter());
});

/**
 * Start webserver with live reload
 */
gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            path: '/'
        }));
});

/**
 * Copy asset files
 */
gulp.task('copy-assets', function() {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

/**
 * Build and bundle TypeScript, then remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('build-ts', ['bundle'], function(cb) {
    var typeScriptGenFiles = [
        'src/**/*.js', // path to all JS files auto gen'd by editor
        'src/**/*.js.map', // path to all sourcemap files auto gen'd by editor
        '!src/lib'
    ];

    // Clean up leftover js files
    del(typeScriptGenFiles, cb);
});

/**
 * Bundle JavaScript files generated from TypeScript compilation.
 */
gulp.task('bundle', function() {
    return browserify({
            basedir: '.',
            debug: true,
            entries: ['src/main.ts'],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

/**
 * Watch source files for changes to update dist files
 */
function watch() {
    // Watch our assets
    var assetWatcher = gulp.watch(paths.pages, ['copy-html']);
    assetWatcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    // Watch our ts
    var tsWatcher = gulp.watch('src/**/*.ts', ['build-ts']);
    tsWatcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
}

gulp.task('build', ['copy-html', 'build-ts']);
gulp.task('default', ['copy-html', 'webserver', 'build-ts'], watch);
