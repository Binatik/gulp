const formats = '{img,svg,webp,jpg,png}';
//Получаем пути для чтения  объектов.
const getPaths = (root) => ({
    html: [`${root}/*.html`, `!${root}/+*.html`],
    image: `${root}/image/**/*.${formats}`,
    fonts: `${root}/fonts/*.ttf`,
    styles: [`${root}/styles/*.css`, `!${root}/styles/+*.css`],
    scripts: [`${root}/scripts/*.js`, `!${root}/scripts/+*.js`],

});

//Удаления проекта из папки ways
function pathDelete(ways) {
    return `./${ways}/`
}

function compressPhoto(level) {
    return imagemin({
        progressive: true,
        interlaced: true,
        optimizationLevel: level,
    })
}

//Выполняем task 
function getTask(task) {
    if (task === 'html') {
        return src(getPaths('development').html)
            .pipe(fileinclude({ 
                prefix: '-',
            }))
            .pipe(webpHTML())
    }

    if (task === 'image') {
        return src(getPaths('development').image)
            .pipe(compressPhoto(3))
            .pipe(dest(`build/image/`))
            .pipe(webp({
                quality: 75,
            }))
            .pipe(compressPhoto(3))
    }

    if (task === 'fonts') {
        return src(getPaths('development').fonts)
    }

    if (task === 'styles') {
        return src(getPaths('development').styles)
            .pipe(fileinclude({ 
                prefix: '@',
            }))
            .pipe(autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            }))
            .pipe(dest(`build/styles/`))
            .pipe(gcmq())
            .pipe(cleanCSS({
                compatibility: 'ie8'
            }))
            .pipe(rename({
                extname: '.min.css'
            }))
    }
    if (task === 'scripts') {
        return src(getPaths('development').scripts)
            .pipe(fileinclude({ 
                prefix: '-',
            }))
            .pipe(dest(`build/scripts/`))
            .pipe(babel({
                presets: ['@babel/env'], 
                plugins: ['transform-react-jsx']
            }))
            .pipe(uglify())
            .pipe(rename({
                extname: '.min.js'
            }))

    }
}

//Подключаем  gulp.
const {
    src,
    dest
} = require('gulp'),

    gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq = require('gulp-group-css-media-queries'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webpHTML = require('gulp-webp-html'),
    del = require('del');

function updatePage() {
    browserSync.init({
        server: {
            baseDir: './build/'
        },
    })

    gulp.watch(`development/**/*.html`, getHtml);
    gulp.watch(`development/image/**/*.${formats}`, getImage);
    gulp.watch(`development/**/*.css`, getStyles);
    gulp.watch(`development/**/*.js`, getScripts);
}





//Методы
const delite = () => del(pathDelete('build'));

function build(func = '', name, dirname = '', ) {
    return func()
        .pipe(dest(`build/${dirname}`))
        .pipe(src(getPaths(`build/${dirname ? `${dirname}/*.*` : ''}`)[name]))
        .pipe(browserSync.stream())
}


function getHtml() {
    return build(() => getTask('html'), 'html');
}

function getImage() {
    return build(() => getTask('image'), 'image', 'image');
}

function getFonts() {
    return build(() => getTask('fonts'), 'fonts', 'fonts');
}

function getStyles() {
    return build(() => getTask('styles'), 'styles', 'styles');
}

function getScripts() {
    return build(() => getTask('scripts'), 'scripts', 'scripts');
}





//Комбинации.  
const defaultGulp = gulp.series(delite, getHtml, getImage, getFonts, getStyles, getScripts, updatePage);

//module exports.arbitraryName = function/variable 
exports.default = defaultGulp;