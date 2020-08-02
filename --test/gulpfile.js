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
    browserSync = require('browser-sync').create(), 
    fileinclude = require('gulp-file-include');

const updatePage = () => browserSync.init({
    server: {
        baseDir: './build/'
    },
}); 

// 
const build = (name, dirname = '') => ( 
    src(getPaths('development')[name])  
    .pipe(fileinclude())
    .pipe(dest(`build/${dirname}`)) 
    .pipe(src(getPaths(`build/${dirname ? `${dirname}/*.*` : ''}`)[name])) 
    .pipe(browserSync.stream()) 
    );


const getHtml = () => (
    build('html')
); 

const getImage = () => (
    build('image', 'image')
); 

const getFonts = () => (
    build('fonts', 'fonts')
); 

//Комбинации.  
gulp.watch(pathListWhichListen('development'), getHtml, getImage, getFonts);  
const defaultGulp = gulp.series(getHtml, getImage, getFonts, updatePage);

//module exports.arbitraryName = function/variable 
exports.default = defaultGulp; 