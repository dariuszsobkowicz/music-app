const gulp         = require("gulp"),
      sass         = require("gulp-sass"),
      plumber      = require("gulp-plumber"),
      runSequence  = require("run-sequence"),
      postcss      = require("gulp-postcss"),
      precss       = require("precss"),
      autoprefixer = require("gulp-autoprefixer"),
      browserSync  = require("browser-sync"),
      rollup       = require("rollup"),
      useref       = require("gulp-useref"),
      del          = require("del");

gulp.task("css", function () {
    return gulp.src("src/**/*.scss", {
        base: "src/scss"
    })
        .pipe(plumber())
        .pipe(sass.sync({outputStyle: "expanded"}))
        .pipe(postcss([precss, autoprefixer]))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream())
});

gulp.task("html", function () {
    return gulp.src("src/*.html", {
        base: "src/"
    })
        .pipe(useref())
        .pipe(gulp.dest("dist"))
});
gulp.task("fa", function () {
    return gulp.src("./node_modules/font-awesome/fonts/*", {
        base: "node_modules/font-awesome/"
    })
        .pipe(gulp.dest("dist"))
});

gulp.task("html:fa", ["html", "fa"]);

gulp.task('js', function () {
    return rollup.rollup({
        entry: "./src/js/app.js",
    })
        .then(function (bundle) {
            bundle.write({
                format:     "iife",
                moduleName: "app",
                dest:       "dist/js/app.js",
                sourceMap:  false,
            });
        })
});

gulp.task("server", function () {
    browserSync.init({
        server: "dist/"
    })
});

gulp.task("watch", function () {
    gulp.watch("src/**/*.scss", ["css"]);
    gulp.watch("src/*.html", ["html", browserSync.reload]);
    gulp.watch("src/**/*.js", ["js", browserSync.reload]);
});

gulp.task("libs", function () {
    return gulp.src([
        "node_modules/gsap/src/uncompressed/TweenMax.js",
        "node_modules/bootstrap/dist/js/bootstrap.js",
        "node_modules/jquery/dist/jquery.js",
        "node_modules/tether/dist/js/tether.js"])
        .pipe(gulp.dest("src/js/libraries"))
});

gulp.task("clean", function () {
   return del("dist/");
});

gulp.task("build", function () {
    runSequence("clean", "css", "libs", "html:fa", "js", "server", "watch")
});

gulp.task("default", ["build"]);
