import * as fs from 'fs';
import * as gulp from 'gulp';
import * as clean from 'gulp-clean';
import * as include from 'gulp-include';
import * as rename from 'gulp-rename';
import {ParsedPath} from 'gulp-rename';
import * as zip from 'gulp-zip';
import * as ts from 'gulp-typescript';
import * as gfile from 'gulp-file';
import replace = require("gulp-replace");
import {promisify} from "util";
import * as fsprom from 'fs/promises';

function getFormattedDate(date: Date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return `${month}/${day}/${year}`;
}

gulp.task('clean', CleanFunction);

function CleanFunction() {
    return gulp.src(['dist', 'InsectPatch'], {read: false, allowEmpty: true})
        .pipe(clean());
}

gulp.task('build', gulp.series('clean', ApplyChanges));

function FinalizeInsectRemovalMod() {
    let InsectRTSettings = {
        module: "es2020",
        target: "es2020",
        sourceMap: true,
        moduleResolution: "Node",
        allowSyntheticDefaultImports: true
    };
    let InsectJs = gulp.src("src/InsectPatch/InsectRemoval.ts").pipe(ts(InsectRTSettings))
        .pipe(replace("export {};", ""))
        .pipe(gulp.dest("dist/InsectPatch/"))
    let Modulecode = JSON.stringify({
        "id": "InsectReplacement",
        "name": "Insect Replacement",
        "author": "Noah Gooder",
        "version": "1.1",
        "released": `${getFormattedDate(new Date())}`,
        "updated": `${getFormattedDate(new Date())}`,
        "description": "Insect Replacer",
        "moduleLoader": "UPF"
    });
    let ModulePart = gfile("module.json", Modulecode, {src: true}).pipe(gulp.dest("dist/InsectPatch/"))
    return [InsectJs, ModulePart]
}

function ApplyChanges() {
    let values = []
    let values2 = [

        gulp.src('index.js')
            .pipe(include())
            .on('error', console.log)
            .pipe(gulp.dest('dist')),
        gulp.src('partials/*.html')
            .pipe(gulp.dest('dist/partials')),

        gulp.src('docs/*.html')
            .pipe(gulp.dest('dist/docs')),

        gulp.src('module.json')
            .pipe(gulp.dest('dist')),

        gulp.src('LICENSE')
            .pipe(gulp.dest('dist')),

        gulp.src('README.md')
            .pipe(gulp.dest('dist'))
    ];

    values.push(FinalizeInsectRemovalMod())
    return Promise.all(values);
}



function ReleaseTask() {
    let moduleInfo = JSON.parse(fs.readFileSync('module.json', {encoding: "utf8"})),
        moduleId = moduleInfo.id,
        moduleVersion = moduleInfo.version,
        zipFileName = `${moduleId}-v${moduleVersion}.zip`;

    console.log(`Packaging ${zipFileName}`);

    return gulp.src('dist/**/*', {base: 'dist/'})
        .pipe(rename(ParsePathing))
        .pipe(zip(zipFileName))
        .pipe(gulp.dest('.'));

    function ParsePathing(path: ParsedPath) {
        path.dirname = `${moduleId}/${path.dirname}`;
        return path
    }
}
gulp.task('release', gulp.series(ReleaseTask));
exports.default = gulp.series('build','release')