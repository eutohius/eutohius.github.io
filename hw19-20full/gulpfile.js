const gulp 		= require('gulp'),
    sass 		= require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat		= require('gulp-concat'),
    uglify		= require('gulp-uglify'),
    cssnano		= require('gulp-cssnano'),
    rename		= require('gulp-rename'),
    del 		= require('del'),
    imagemin	= require('gulp-imagemin'),
    pngquant	= require('imagemin-pngquant'),
    cache		= require('gulp-cache'),
    autoPrefixer= require('gulp-autoprefixer');


    gulp.task('sass', function() {
        return gulp.src('app/sass/**/*.scss')
            .pipe(sass({outputStyle: 'expanded', sourceComments: true}).on('error', sass.logError))
            .pipe(gulp.dest('app/css'));
    });

    gulp.task ('concat-libs', function() {
        return gulp.src([
            'app/libs/reset-css/reset.css',
            'app/libs/bootstrap/dist/css/bootstrap.min.css'
        ])
            .pipe(concat('libs.min.css'))
            .pipe(gulp.dest('app/css'));
    });

    gulp.task('css-libs', ['sass'], function() {
        return gulp.src('app/css/libs.css')
            .pipe(cssnano())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('app/css'));
    });

    gulp.task('libs', function() {

    });

    gulp.task('clean', function(){
        return del.sync('dist/**/*');
    });

    gulp.task('clear', function() {
        return cache.clearAll();
    });

    gulp.task('javascript', function() {
        gulp.src('app/js/*.js')
            .pipe(concat('scripts.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('app/js'));
        gulp.src([ 'app/libs/jquery/dist/jquery.min.js', 'app/js/scripts.min.js'])
            .pipe(concat('scriptsfile.min.js'))
            .pipe(gulp.dest('app/js'));
    });

    gulp.task('browser-sync', function() {
        browserSync({
            server: {
                baseDir: 'app'
            },
            notify: false
        });
    });

    gulp.task('watch', ['sass', 'browser-sync'], function() {
        gulp.watch('app/sass/**/*.scss', ['sass']);
        gulp.watch('app/css/**/*.css', browserSync.reload);
        gulp.watch('app/**/*.html', browserSync.reload);
        gulp.watch('app/**/*.js', browserSync.reload);
    });

    gulp.task('build', ['clean'], function() {
        gulp.src('app/index.html')
            .pipe(gulp.dest('dist'));
        gulp.src('app/css/*')
            .pipe(gulp.dest('dist/css'));
        gulp.src('app/js/scriptsfile.min.js')
            .pipe(gulp.dest('dist/js'));
        gulp.src('app/fonts/*')
            .pipe(gulp.dest('dist/fonts'));
        gulp.src(['app/img/carousel-caption.svg',
            'app/img/main-?.jpg',
            'app/img/services-*.jpg',
            'app/img/socials-sprite.png',
            'app/img/spritesheet.png',
            'app/img/article-[0-9].jpg'])
            .pipe(gulp.dest('dist/img'));
    });
