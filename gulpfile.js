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
        gulp.src(['./app/views/**/*.html'])
    .pipe(gulp.dest(pkg.paths.dest.views));
     gulp.src(['./app/views/**/*.html', './app/views/*.json'])
        .pipe(plug.angularTemplateCache({
            module: pkg.webapp,
            root: 'app'
        }))
        .pipe(gulp.dest(pkg.paths.dest.views));
});

gulp.task('data', function () {
    return gulp.src(['./app/data/*.json'])
        .pipe(gulp.dest(pkg.paths.dest.data));
});

gulp.task('fonts', function () {
    return gulp.src("bower_components/ionic/release/fonts/*")
        .pipe(gulp.dest(pkg.paths.dest.base + "/fonts"));
});

/*
 * Minify and bundle the JavaScript
 */
gulp.task('bundlejs', ['views'], function () {
    var bundlefile = pkg.name + ".min.js";
    var opt = { newLine: ';\n' };

    return gulp.src(pkg.paths.source.js)
        .pipe(plug.size({ showFiles: true }))
        .pipe(plug.ngAnnotate())
        .pipe(plug.uglify())
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
 * Bundle the JS, CSS, and compress images.
 * Then copy files to production and show a toast.
 */
gulp.task('default', ['bundlejs', 'bundlecss', 'images'], function () {
    // Copy the CSS to prod
    return plug.notify({
            onLast: true,
            message: "linted, bundled, and images compressed!"
        });
});

/*
 * Remove *.map, *.js files from the app folder
 */
gulp.task('cleanMapJs', function(){
    return gulp.src([
        './app/**/*.js',
        './app/**/*.map'])
        .pipe(plug.clean({force: true}))
});

gulp.task("cleanRelease", function() {
    return  gulp.src(pkg.paths.dest.base, {read:false})
        .pipe(plug.clean());
});

/*
* Create release (TS files must be compiled before)
*/
gulp.task("release", ['fonts', 'views', 'bundlecss', 'bundlejs', 'data'], function() {
    var target = gulp.src('index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['./build/dist/**/*.min.js', './build/dist/**/*.min.css'], {read: false});

    return target.pipe(plug.inject(sources, {ignorePath: 'build/dist/', addRootSlash: false }))
        .pipe(gulp.dest('./build/dist/'));
});

gulp.task('default', ['bundlejs', 'bundlecss', 'release']);