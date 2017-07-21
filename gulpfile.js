'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    webpack = require('webpack-stream'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    UglifyEsPlugin = require('uglify-es-webpack-plugin'),
    browserSync = require('browser-sync').create();

gulp.task('sass', function () {
    return gulp.src('./assets/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
});

gulp.task('sass-production', function () {
    return gulp.src('./assets/scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('webpack', function () {
    return gulp.src('./assets/js/app.js')
        .pipe(webpack({
            output: {
                filename: "app.js"
            },
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /(node_modules)/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2017']
                        }
                    }
                ]
            },
        }))
        .pipe(gulp.dest(__dirname + '/public/js'))
        .pipe(browserSync.stream());
});

gulp.task('webpack-production', function () {
    return gulp.src('./assets/js/app.js')
        .pipe(webpack({
            output: {
                filename: "app.js"
            },
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /(node_modules)/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2017']
                        }
                    }
                ]
            },
            plugins: [
                new UglifyEsPlugin({
                    compress: {
                        warnings: false
                    }
                })
            ]
        }))
        .pipe(gulp.dest(__dirname + '/public/js'));
});

gulp.task('watch', ['sass', 'webpack'], function () {
    browserSync.init({
        server: {
            baseDir: "./",
            index: './index.html'
        }
    });

    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch('./assets/scss/**/*.scss', ['sass']);
    gulp.watch('./assets/js/**/*.js', ['webpack']);
});

gulp.task('production', ['sass-production', 'webpack-production']);