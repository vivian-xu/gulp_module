var gulp = require('gulp'),

    sass = require('gulp-sass'),
    rubySass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),

    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),

    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),

    pug = require('gulp-pug'),
    htmlmin = require('gulp-htmlmin'),

    // concat = require('gulp-concat'), // 合并文件
    rename = require('gulp-rename'), //重命名文件
    connect = require('gulp-connect'),

    gulpif = require('gulp-if'),

    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    browserify = require('gulp-browserify'),
    handleErrors = require('./gulp/handleErrors');

    // sourcemaps = require('gulp-sourcemaps'),

var env = process.env.NODE_ENV || 'development';
var outputDir = 'builds/development';

var config = {};

if (env === "development") {
    config.map = 'sourcemaps.write()';
    config.outputStyle= '';
    config.outputdir = 'builds/development';
}

else if (env === "production") {
    config.map = '';
    config.outputStyle = '{outputStyle: "compressed"}';
    config.outputdir = 'builds/production';
}

// html 压缩重命名
gulp.task('html', function() {
    return gulp.src('src/templates/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(rename( function( path ) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(config.outputdir+'/html'))
        .pipe(connect.reload());
})

// pug 模版
gulp.task('pug', function() {
    return gulp.src('src/templates/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload());
});


// es6
gulp.task('es6', function() {
    return gulp.src('src/**/*.js', {base: 'src/**'})
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(outputDir + '/js'))
        .pipe(connect.reload());
});

// js
gulp.task('js', function() {
    return gulp.src('src/**/*.js' , {base: 'src/**'})
        .pipe(browserify({debug: env === 'development'}))
        .pipe(gulpif(env === 'production', uglify())) // 压缩js
        .pipe(gulp.dest(outputDir + '/js'))
        .pipe(connect.reload());
});


// gulp.task('sass', function() {
//     var config = {};

//     if (env === 'development') {
//         config.sourceComments = 'map';
//     }

//     if (env === 'production') {
//         config.outputStyle = 'compressed';
//     }

//     return gulp.src('src/sass/*.scss')
//         .pipe(sourcemaps.init())
//         .pipe(sass(config).on('error', sass.logError))
//          .pipe(autoprefixer())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(outputDir + '/css'))
//         .pipe(connect.reload());
// });


gulp.task('rubySass', function() {
    var rboutputStyle = '',
        rbrename = '';
    if (env === "development") {
        rboutputStyle = '';
        rbrename = "";
    }

    else if (env === "production") {
        rboutputStyle = 'compressed';
        rbrename = ".min";
    }

    return rubySass('src/sass/*.scss', { sourcemap: true ,compass: true, style: rboutputStyle})
        .on('error', rubySass.logError)
        .pipe(sourcemaps.write())

        .pipe(sourcemaps.write('maps', {
           includeContent: false,
           sourceRoot: 'source'
        }))
        .pipe(rename( function( path ) {
           path.basename += rbrename
        }))
        .pipe(gulp.dest(config.outputdir+ '/css'))
        .pipe(connect.reload());
});

gulp.task('image',function() {
    return gulp.src('src/images/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            svgoPlugins: [{removeViewBox: false}], //不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest(config.outputdir+'/images'))
        .pipe(connect.reload());
});

//  只压缩修改的图片,没有修改的图片直接从缓存文件读取
// .pipe(cache(imagemin({
//      progressive: true,
//      svgoPlugins: [{removeViewBox: false}],
//      use: [pngquant()]
//     })))
//


gulp.task('watch', function() {
    gulp.watch('src/templates/*.pug', ['pug']);
    gulp.watch('src/js/*.js', ['es6']);
    gulp.watch('src/sass/*.scss', ['sass']);
});

gulp.task('connect', function() {
    connect.server({
        root: [outputDir],
        port: 8000,
        livereload: true
    });
});

gulp.task('default', ['es6', 'pug', 'rubySass', 'watch', 'connect']);

