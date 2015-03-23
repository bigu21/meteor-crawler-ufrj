Package.describe({
    summary: "Crawl data from UFRJ Intranet and SIGA"
});

Package.on_use(function(api) {
    api.use(['underscore', 'npm', 'reachable'], 'server');
    api.add_files('crawler-ufrj.js', ['client', 'server']);
});


Package.on_test(function(api) {
    api.use(['tinytest', 'crawler-ufrj'], ['client', 'server']);
    api.add_files(['crawler-ufrj-tests.js'], ['client', 'server']);
});
