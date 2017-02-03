const gulp         = require("gulp"),
      sass         = require("gulp-sass"),
      plumber      = require("gulp-plumber"),
      babel        = require("gulp-babel"),
      del          = require("del"),
      runSequence  = require("run-sequence"),
      postcss      = require("gulp-postcss"),
      precss       = require("precss"),
      autoprefixer = require("gulp-autoprefixer"),
      browserSync  = require("browser-sync");

gulp.task("css", function () {

    return gulp.src("src/scss/app.scss")
        .pipe(plumber())
        .pipe(sass.sync({outputStyle: "expanded"}))
        .pipe( postcss([ precss, autoprefixer ]) )
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream())
});

gulp.task("bootstrap", function () {
    return gulp.src([
        "node_modules/gsap/src/uncompressed/TweenMax.js",
        "node_modules/bootstrap/dist/js/bootstrap.js",
        "node_modules/jquery/dist/jquery.js",
        "node_modules/tether/dist/js/tether.js"])
        .pipe(gulp.dest("src/js/"))
});

gulp.task("server", function () {
    browserSync.init({
        server: "src/"
    })
});

gulp.task("watch", function () {
    gulp.watch("src/scss/**/*.scss", ["css"]);
    gulp.watch(["src/*.html", "src/js/**/*.js"], browserSync.reload);
});

gulp.task("html", function () {
    return gulp.src("src/*.html", {
        base: "src/"
    })
        .pipe(gulp.dest("dist"))
});

gulp.task("js", function () {
    return gulp.src("src/js/**/*.js", {
        base: "src/"
    })
        .pipe(babel())
        .pipe(gulp.dest("dist"))
});

gulp.task("clean", function () {
    return del("dist/")
});

gulp.task("in-progress", function () {
    runSequence("css", "bootstrap", "server", "watch")
});

gulp.task("default", ["in-progress"]);