Package.describe({
    summary: "Stealer UFRJ crawls data from UFRJ Intranet and SIGA"
});

Package.on_use(function(api) {

    api.use(['underscore', 'http-more' ], ['client', 'server']);
    api.add_files('stealer-ufrj.js', ['client', 'server']);
});


Package.on_test(function(api) {
    api.use(['tinytest', 'http-more', 'stealer-ufrj'], ['client', 'server']);
    api.add_files(['stealer-ufrj-tests.js'], ['client', 'server']);
});
