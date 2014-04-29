if(Meteor.isServer) {
    var cheerio =  Meteor.require('cheerio');
    var request =  Meteor.require('request');


    var sigaStealer = function(requestedUrl, settings) {

    if(!_.isObject(settings))
        settings = {};

    if(!requestedUrl || !_.isString(requestedUrl))
        throw new Meteor.Error(400, "requestUrl not found or is not a string");

    // Our cookie jar
    jar = request.jar();

    settings = _.defaults(settings, {
        url: 'https://intranet.ufrj.br/Utilidades2006/Login.asp',
        method: 'POST',
        followAllRedirects: true,
        strictSSL: false,
        rejectUnauthorized: false,
        jar: jar,
        form: {
            usuario: '***REMOVED***',
            senha: '***REMOVED***'
        }
    });

    var reqIntranet = Async.runSync(function(done) {
        request(settings, function(err, res, body) {
            done(err, res);
        });
    });

    $ = cheerio.load(reqIntranet.result.body);
    var sigaURL = $('table:nth-child(1) tr:nth-child(2) strong a').attr('href');


    var reqSIGA = Async.runSync(function(done) {
        request( _.extend(settings, {url: sigaURL}), function(err, res) {

            request( _.extend(settings, {
                url: requestedUrl}),
                function(err, res) {
                    done(err, res);
            });
        });
    });


    console.log(reqSIGA.result.body);

    }

    sigaStealer('https://siga.ufrj.br//sira/Service/cridAluno', []);
}

