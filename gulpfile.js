let gulp       = require('gulp');
let uglify     = require('gulp-uglify');
let concat     = require('gulp-concat');
let ts         = require('gulp-typescript');
let htmlmin    = require('gulp-htmlmin');
let browserify = require('browserify');
let source     = require('vinyl-source-stream');
let tsify      = require('tsify');
let sass       = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./web/css'));
});

gulp.task('images', function () {
//    gulp.src('./images/**/*')
//        .pipe(imagemin())
//        .pipe(gulp.dest('./public/images'))

});

gulp.task('html', function () {
    return gulp.src('assets/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('web'));
});

let serverProject = ts.createProject('tsconfig.json', { noImplicitAny: false });

gulp.task('client', function () {
    return browserify({
        basedir     : '.',
        debug       : true,
        entries     : ['src/client.ts'],
        cache       : {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('web/js'));
});

gulp.task('server', function () {
//    return gulp.src('src/**/*.ts')
//        .pipe(ts({
////        noImplicitAny: true,
//            module          : 'commonjs',
//            target          : 'ES6',
//            moduleResolution: 'node',
//            outFile         : 'index.js'
//        }))
//        .pipe(gulp.dest('dist'));

    var tsResult = gulp.src("src/**/*.ts") // or tsProject.src()
        .pipe(serverProject());

    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('compile', ['client', 'server'], () => true);

gulp.task('build', ['compile', 'sass', 'images', 'html'], function () {

});

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/*', ['compile']);
    gulp.watch('./assets/*.html', ['html']);
    gulp.watch('./assets/sass/*', ['sass']);
    gulp.watch('./assets/images/*', ['images']);
});
