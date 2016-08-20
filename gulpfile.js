var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html', 'src/*.css']
};
var webserver = require('gulp-webserver');
var awspublish = require('gulp-awspublish');
var parallelize = require("concurrent-transform");

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
    }, {
        cacheFileName: 'your-cache-location'
    });

    // define custom headers
    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
            // ...
    };

    return gulp.src('./dist/*')
        .pipe(parallelize(publisher.publish(), 10))
        .pipe(publisher.sync())
        // gzip, Set Content-Encoding headers and add .gz extension
        //.pipe(awspublish.gzip({
        //    ext: '.gz'
        //}))
        // publisher will add Content-Length, Content-Type and headers specified above
        // If not specified it will set x-amz-acl to public-read by default
        //.pipe(publisher.publish(headers))
        // create a cache file to speed up consecutive uploads
        //.pipe(publisher.cache())
        // print upload updates to console
        .pipe(awspublish.reporter());
});

gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            path: '/'
        }));
});

gulp.task('copy-html', function() {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

var watcher = gulp.watch(paths.pages, ['copy-html']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
}

gulp.task("default", ["copy-html", 'webserver'], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
