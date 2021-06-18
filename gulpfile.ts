import * as fs from 'fs';
import * as gulp from 'gulp';
import * as clean from 'gulp-clean';
import * as include from 'gulp-include';
import * as rename from 'gulp-rename';
import {ParsedPath} from 'gulp-rename';
import * as zip from 'gulp-zip';
import * as ts from 'gulp-typescript';
import * as gfile from 'gulp-file'
import conventionalRecommendedBump from "conventional-recommended-bump";
import conventionalGithubReleaser from "conventional-github-releaser";
import * as execa from "execa";
import * as dotenv from "dotenv";
import replace = require("gulp-replace");
import {promisify} from "util";
import * as fsprom from 'fs/promises';

// load environment variables
const result = dotenv.config();

if (result.error) {
    throw result.error;
}
// Conventional Changelog preset
const preset = 'angular';
// print output of commands into the terminal
const stdio = 'inherit';

async function bumpVersion() {
    // get recommended version bump based on commits
    const {releaseType} = await promisify(conventionalRecommendedBump)({preset});
    // bump version without committing and tagging
    await execa('npm', ['version', releaseType, '--no-git-tag-version'], {
        stdio,
    });
}

async function changelog() {
    await execa(
        'npx',
        [
            'conventional-changelog',
            '--preset',
            preset,
            '--infile',
            'CHANGELOG.md',
            '--same-file',
        ],
        {stdio}
    );
}

async function commitTagPush() {
    // even though we could get away with "require" in this case, we're taking the safe route
    // because "require" caches the value, so if we happen to use "require" again somewhere else
    // we wouldn't get the current value, but the value of the last time we called "require"
    const {version} = JSON.parse(await fsprom.readFile('package.json', {encoding: "utf8"}));
    const commitMsg = `chore: release ${version}`;
    await execa('git', ['add', '.'], {stdio});
    await execa('git', ['commit', '--message', commitMsg], {stdio});
    await execa('git', ['tag', `v${version}`], {stdio});
    await execa('git', ['push', '--follow-tags'], {stdio});
}
function githubRelease(done) {
    conventionalGithubReleaser(
        { type: 'oauth', token: process.env.GH_TOKEN },
        { preset },
        done
    );
}

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

gulp.task('release', ReleaseTask);

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

exports.default = gulp.series('build','release')