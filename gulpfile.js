var gulp = require('gulp');
var del = require('del');
var opn = require('opn');
var connect = require('gulp-connect');

function moveFile(){
    gulp.src('src/**')
        .pipe(gulp.dest('dist'));
    gulp.src('node_modules/backbone/backbone-min.js')
        .pipe(gulp.dest('dist/js/lib'));
    gulp.src('node_modules/underscore/underscore-min.js')
        .pipe(gulp.dest('dist/js/lib'));
    gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('dist/js/lib'));
    gulp.src('node_modules/json2/lib/JSON2.js')
        .pipe(gulp.dest('dist/js/lib'));
}

gulp.task('build', function(){
    del(['dist/!(.git)']).then(moveFile);
})

gulp.task('file', function(){
    moveFile();
    return null;
})

gulp.task('server', ['file'], function(){
    connect.server({
        root: 'dist',
        port: 8000,
        livereload: true
    })
    opn('http://127.0.0.1:8000');
})

gulp.task('watch', function(){
    gulp.watch(['src/**'], ['reload']);
})

gulp.task('reload', ['file'], function(){
    console.log('----------------reload server %s---------------------', new Date());
    gulp.src('dist/**').pipe(connect.reload());
})


gulp.task('show', ['server', 'watch'])

