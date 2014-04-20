if(Meteor.isServer) {
    var cheerio =  Meteor.require('cheerio');
    console.log("Server");

     login_ufrj= function(settings) {
        console.log("Stealer");

        // Default METHOD
        if(!settings.method)
            settings.method = 'GET';

        if(!settings.url)
            throw new Meteor.Error(500, "An URL must be given.");

        content = HTTP.call(settings.method, settings.url, settings.options).content;

        $ = cheerio.load(content);

        //console.log($("html").html());
    }

    settings =  {
        url: 'https://intranet.ufrj.br/Utilidades2006/Login.asp',
        options: {
            followAllRedirects: true,
            strictSSL: false,
            jar: true,
            params: {}
        }
    }

    //login_ufrj(settings);

    Meteor.methods({
        login_ufrj: function(username, password) {
            _.extend(settings.options.params, {usuario: username, senha: password});
            login_ufrj(settings)
            console.log(settings);
        }
    });
}

if(Meteor.isClient) {
    Meteor.call('login_ufrj', '***REMOVED***', '***REMOVED***', function(e,r) {

    });
}
