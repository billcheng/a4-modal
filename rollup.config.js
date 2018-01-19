export default {
    entry: './index.js',
    dest: 'bundles/a4-modal.umd.js',
    sourceMap: false,
    format: 'umd',
    moduleName: 'a4-modal',
    external: [
        '@angular/core',
        '@angular/forms',
        '@angular/animations',
        '@angular/common',
        '@angular/router',
        '@angular/platform-browser/animations',
        'rxjs/add/operator/filter',
        'a4-overlay'
    ],
    globals: {
        '@angular/core': 'ng-core',
        '@angular/forms': 'ng-forms',
        '@angular/animations': 'ng-animations',
        '@angular/common': 'ng-common',
        '@angular/router': 'ng-router',
        '@angular/platform-browser/animations': 'ng-platform-browser-animations',
        'rxjs/add/operator/filter': 'rxjs-filter',
        'a4-overlay': 'a4-overlay'
    }
}