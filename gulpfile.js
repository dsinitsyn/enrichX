'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rigger = require('gulp-rigger'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'admin/',
        js: 'admin/js/',
        css: 'admin/css/',
        img: 'admin/img/',
        fonts: 'admin/fonts/'
    },
    dev: {
        html: 'dev/**/*.html',
        js: require('./dev/js/scripts.json'),
        mainJs: require('./dev/js/main.json'),
        componentsJs: require('./dev/js/components.json'),
        style: 'dev/styles/style.scss',
        img: 'dev/img/**/*.*',
        fonts: 'dev/fonts/**/*.*'
    },
    watch: {
        html: 'dev/**/*.html',
        jsComponents: require('./dev/js/components.json'),
        jsScripts: require('./dev/js/scripts.json'),
        jsMain: require('./dev/js/main.json'),
        jsAll : ['dev/js/components.json', 'dev/js/scripts.json', 'dev/js/main.json'],
        style: 'dev/styles/**/*.*',
        img: 'dev/img/**/*.*',
        fonts: 'dev/fonts/**/*.*'
    },
    clean: './admin/*'
};

var config = {
    server: {
        baseDir: "./admin"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "crash",
    notify: false,
    logSnippet: false,
    logConnections: false
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.dev.html) 
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js-components:build', function () {
    gulp.src(path.dev.componentsJs) 
        .pipe(sourcemaps.init()) 
        .pipe(concat('components.js'))
        .pipe(uglify().on('error', util.log))
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('js-scripts:build', function () {
    gulp.src(path.dev.js) 
        .pipe(sourcemaps.init()) 
        .pipe(concat('script.js'))
        .pipe(uglify().on('error', util.log))
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('js-main:build', function () {
    gulp.src(path.dev.mainJs)
        .pipe(sourcemaps.init()) 
        .pipe(concat('main.js'))
        .pipe(uglify().on('error', util.log))
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.dev.style)
        .pipe(compass({
            sourcemap : true,
            sass      : 'dev/styles',
            css       : path.build.css,
            style     : 'compressed',
            require   : 'sass-css-importer'
        }))
        .pipe(autoprefixer({browsers: ['last 3 versions']}))
        .pipe(gulp.dest('admin/css/min'))
        .pipe(watch('admin/css/**/*.css').on("change", reload));
});

gulp.task('image:build', function () {
    gulp.src(path.dev.img) 
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        // .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.dev.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js-components:build',
    'js-scripts:build',
    'js-main:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {0
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch(path.watch.jsScripts, function(event, cb) {
        gulp.start('js-scripts:build');
    });
    watch(path.watch.jsComponents, function(event, cb) {
        gulp.start('js-components:build');
    });
    watch(path.watch.jsMain, function(event, cb) {
        gulp.start('js-main:build');
    });
    watch(path.watch.jsAll, function(event, cb) {
        gulp.start(['js-components:build', 'js-scripts:build','js-main:build']);
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);