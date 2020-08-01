const formats = '{img,svg,webp,jpg,png}';
//Получаем пути для чтения  объектов.
const getPaths = (root) => ({
    html: `${root}/*.html`,
    image: `${root}/image/**/*.${formats}`,
    fonts: `${root}/fonts/*.ttf`,
    styles: `${root}/styles/`,
    scripts: `${root}/scripts/`,

});

console.log(getPaths('development').html);

//Слушаем события типа stream.
function pathListWhichListen(root) {
    const lists = [
        `${root}/**/*.html`,
        `${root}/image/**/*.${formats}`,
        '${root}/**/*.css',
        '${root}/**/*.js',
    ]
    return lists;
}
//Удаления проекта из папки ways
function pathDelete(...ways) {
    return `./${ways}/`
}

//Подключаем  gulp.
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

//Моды для  html.
const getHtml = () => (
    src(getPaths('development').html)
    .pipe(dest(getPaths('build').html))
    .pipe(browserSync.stream())
);

//Комбинации.   
const defaultGulp = gulp.series(getHtml, updatePage);

//module exports.arbitraryName = function/variable 
exports.default = defaultGulp; 

/* За кулисами getHtml:  
object = { 
    key: getHtml   
    --оно--
    ======================================
    const getHtml = () => (
    src(getPaths('development').html)
    .pipe(dest(getPaths('build').html))
    .pipe(browserSync.stream())
);
);
    //CODE FUNCTION
    ======================================
);
}
*/