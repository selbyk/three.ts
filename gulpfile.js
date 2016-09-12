'use strict';
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const webserver = require('gulp-webserver');
const awspublish = require('gulp-awspublish');
const parallelize = require('concurrent-transform');
const del = require('del');

let paths = {
    pages: ['src/*.html', 'src/*.css', 'src/*.png']
};

let watching = false;

function handleError(err) {
    console.error(err.toString());
    if (watching) {
        this.emit('end'); // jshint ignore:line
    } else {
        // if you want to be really specific
        process.exit(1);
    }
}

/**
 * Start webserver with live reload
 */
gulp.task('webserver', () => {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            path: '/'
        }))
        .on('error', handleError);
});

/**
 * Copy asset files
 */
gulp.task('copy-assets', () => {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'))
        .on('error', handleError);
});

/**
 * Bundle JavaScript files generated from TypeScript compilation.
 */
gulp.task('bundle', () => {
    return browserify({
            basedir: '.',
            debug: true,
            entries: ['src/main.ts'],
            cache: {},
            packageCache: {}
        })
        .on('error', handleError)
        .plugin(tsify)
        .on('error', handleError)
        .bundle()
        .on('error', handleError)
        .pipe(source('bundle.js'))
        .on('error', handleError)
        .pipe(buffer())
        .on('error', handleError)
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .on('error', handleError)
        .pipe(sourcemaps.write('./'))
        .on('error', handleError)
        .pipe(gulp.dest('dist'))
        .on('error', handleError);
});

/**
 * Build and bundle TypeScript, then remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('build', ['bundle', 'copy-assets'], (cb) => {
    let typeScriptGenFiles = [
        'src/**/*.js', // path to all JS files auto gen'd by editor
        'src/**/*.js.map', // path to all sourcemap files auto gen'd by editor
        '!src/lib'
    ];

    // Clean up leftover js files
    return del(typeScriptGenFiles, cb);
});

/**
 * Publish files to S3
 */
gulp.task('publish', ['build'], () => {
    // create a new publisher using S3 options
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
    let publisher = awspublish.create({
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

gulp.task('watch', () => {
    // Watch our assets
    watching = true;
    let assetWatcher = gulp.watch(paths.pages, ['copy-assets']);
    assetWatcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    // Watch our ts
    let tsWatcher = gulp.watch('src/**/*.ts', ['build']);
    tsWatcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['watch', 'copy-assets', 'webserver', 'build'], () => {
    console.log('Started default command');
});
