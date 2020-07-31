const formats = '{img,svg,webp,jpg,png}';
//Вспомогательные функции.
function getCompile(src) {
    const compile = [
        `${src}/*.html`,
        `${src}/image/**/*.${formats}`,
        `${src}/fonts/*.ttf`,
        `${src}/styles/`,
        `${src}/scripts/`,
    ] 
    return compile; 
}

function listenWatch(src) {
    const watchHtml = `${src}/**/*.html`;
    const watchImage = `${src}/image/**/*.${formats}`;
    const watchStyles = '${src}/**/*.css';
    const watchScripts = '${src}/**/*.js';
}

function getClean(src) {
    const delCommand = `./${src}/`
}

//Gulp
const {
    src,
    dest
} = require('gulp'),
    gulp = require('gulp'),
    browserSync = require('browser-sync').create();

const updatePage = () => browserSync.init({
    server: {
        baseDir: './build/'
    },
});

const html = () => (
    src(getCompile('development'))
    .pipe(dest(getCompile('build')))
    .pipe(browserSync.stream())
);

const method = gulp.series(html);
const watch = gulp.parallel(method, updatePage);
exports.default = watch;
exports.watch = watch;
exports.method = method;
exports.html = html;