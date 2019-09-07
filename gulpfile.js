const gulp = require('gulp');
const pug = require('gulp-pug');
var spritesmith = require('gulp.spritesmith');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin'),
    imgCompress = require('imagemin-jpeg-recompress'),
    webp = require("imagemin-webp"),
    extReplace = require("gulp-ext-replace");

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/img/*.{png,jpg}').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));
    return spriteData.pipe(gulpif('*.png', gulp.dest('dist/img/'), gulp.dest('src/scss/')));
});

/* minify tinypng settings */
gulp.task('imagemin', function () {
    return gulp.src('src/img/**/*')
        .pipe(imagemin([
            imgCompress({
                loops: 4,
                min: 70,
                max: 80,
                quality: 'high'
            }),
            imagemin.gifsicle(),
            imagemin.optipng(),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('dist/img/'));
});

/* convert-to-webp.js */
gulp.task('webp', function () {
    return gulp.src('src/img/**/*.{jpg,png}')
        .pipe(imagemin([
            webp({
                quality: 90
            })
        ]))
        .pipe(extReplace(".webp"))
        .pipe(gulp.dest('dist/img/'));
});

gulp.task('pug', function () {
    return gulp.src(['src/pug/pages/**/*.pug', '!./node_modules/**'])
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['pug'], function () {
    gulp.watch('src/**/*', ['pug']);
});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);