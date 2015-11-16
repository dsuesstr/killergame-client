// Install command
//npm install gulp-notify gulp-minify-css gulp-clean gulp-size jshint-stylish gulp-cache gulp-header gulp-load-plugins gulp-load-utils chalk dateformat minimist gulp-size gulp-ng-annotate gulp-angula r-templatecache glob gulp gulp-concat gulp-uglify gulp-if gulp-imagemin

/*
 * Create references
 */
var gulp = require('gulp');
var pkg = require('./package.json');
var common = require('./gulp/common.js');

/*
 * Auto load all gulp plugins
 */
var gulpLoadPlugins = require("gulp-load-plugins");
var plug = gulpLoadPlugins({
    rename: {
        'gulp-angular-templatecache': 'angularTemplateCache',
        'gulp-ng-annotate': 'ngAnnotate'
    }
});

/*
 * Load common utilities for gulp
 */
var gutil = plug.loadUtils(['colors', 'env', 'log', 'date']);

/*
 * Create comments for minified files
 */
var commentHeader = common.createComments(gutil);

/*
 * Compile Views and Localization Files into JavaScript
 */
gulp.task('views', function () {
    return gulp.src(['./app/**/*.html', './app/**/*.json'])
        .pipe(plug.angularTemplateCache({
            module: pkg.webapp,
            root: 'app'
        }))
        .pipe(gulp.dest(pkg.paths.dest.views));
});

/*
 * Minify and bundle the JavaScript
 */
gulp.task('bundlejs', ['views'], function () {
    var bundlefile = pkg.name + ".min.js";
    var opt = { newLine: ';\n' };

    return gulp.src(pkg.paths.source.js)
        .pipe(plug.size({ showFiles: true }))
        //.pipe(plug.uglify())
        .pipe(plug.ngAnnotate())        
        .pipe(plug.concat(bundlefile, opt))        
        .pipe(plug.header(commentHeader))        
        .pipe(plug.size({ showFiles: true }))
        .pipe(gulp.dest(pkg.paths.dest.js));
});

/*
 * Minify and bundle the CSS
 */
gulp.task('bundlecss', function () {
    return gulp.src(pkg.paths.source.css)
        .pipe(plug.size({ showFiles: true }))
        .pipe(plug.minifyCss({}))
        .pipe(plug.concat(pkg.name + ".min.css"))
        .pipe(plug.header(commentHeader))        
        .pipe(plug.size({ showFiles: true }))
        .pipe(gulp.dest(pkg.paths.dest.css));
});

/*
 * Compress images
 */
gulp.task('images', function () {
    return gulp.src(pkg.paths.source.images)
        //To use image optimization check required prerequisites
        //.pipe(plug.cache(plug.imagemin({ optimizationLevel: 3 })))
        .pipe(gulp.dest(pkg.paths.dest.images));
});

gulp.task('wp8', ['bundlejs', 'bundlecss', 'images'], function () {
    return gulp.src([pkg.dest + '**/*.js', pkg.dest + '**/*.css', pkg.dest + '**/*.png', pkg.dest + '**/*.jpg'])
        .pipe(gulp.dest(pkg.paths.dest.wp8))
        .pipe(gulp.dest(pkg.paths.dest.cordova));
});

/*
 * Bundle the JS, CSS, and compress images.
 * Then copy files to production and show a toast.
 */
//gulp.task('default', ['bundlejs', 'bundlecss', 'images'], function () {
//    // Copy the CSS to prod
//    return gulp.src(pkg.paths.dest.css + '/**/*')
//        .pipe(gulp.dest(pkg.paths.production + '/content/'))

//        // Copy the js files to prod
//        .pipe(gulp.src(pkg.paths.dest.js + '/*.js'))
//        .pipe(gulp.dest(pkg.paths.production + '/app/'))

//        // Notify we are done
//        .pipe(plug.notify({
//            onLast: true,
//            message: "linted, bundled, and images compressed!"
//        }));
//});

/*
 * Remove *.map, *.js files from the app folder
 */
gulp.task('cleanMapJs', function(){
    return gulp.src([
        './app/**/*.js',
        './app/**/*.map'])
        .pipe(plug.clean({force: true}))
});

// npm i --save-dev gulp-serve
gulp.task('serve', plug.serve()); // will be served at port :3000

gulp.task('default', ['bundlejs', 'bundlecss', 'images', 'wp8']);