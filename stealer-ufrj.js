if(Meteor.isServer) {
    var cheerio =  Meteor.require('cheerio');
    var request =  Meteor.require('request');

    var stealerUFRJ = function(requestedUrl, settings) {

        if(!_.isObject(settings))
            throw new Meteor.Error(400, "settings must be of object type");

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
            timeout: 2000,
            jar: jar,
            form: {
                usuario: settings.username,
                senha: settings.password
            }
        });

        var reqIntranet = Async.runSync(function(done) {
            request(settings, function(err, res, body) {
                done(err, res);
            });
        });

        console.log(reqIntranet.result.body);
        $ = cheerio.load(reqIntranet.result.body);

        // Cheerio selector for SIGA from href attr at Intranet Services page
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

        jar = request.jar();
        console.log(reqSIGA.result.body);
        return reqSIGA.result.body;
    }

    console.log(stealerUFRJ('https://siga.ufrj.br//sira/Service/cridAluno', {username: '***REMOVED***', password: '***REMOVED***'}));
    console.log("dadadsadsa");
}
