import { readFileSync, writeFileSync } from 'fs';
import pkg from 'cheerio';
const { load } = pkg;
let index = readFileSync('./build/index.html', { encoding: 'utf8' });
const $ = load(index);
$('script').each(
    function () {
        $(this).attr('nomodule', '');
    }
);
$('head').append('<script type="module" src="/_dist_/index.js"></script><link rel="modulepreload" href="/_dist_/shortlink.js"><link rel="modulepreload" href="/web_modules/mdui.js">');
index = $.html();
writeFileSync('./build/index.html', index, { encoding: 'utf8' });