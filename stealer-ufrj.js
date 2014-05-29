(function() {

  if(Meteor.isServer) {
      var cheerio =  Meteor.require('cheerio');
      var request =  Meteor.require('request');
      var wrappedRequest = Async.wrap(request);
  }


  Meteor.methods({
      stealerUFRJ: function(requestedUrl, settings) {

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
              iterationLoop: 1,
              rejectUnauthorized: false,
              timeout: 6000,
              jar: jar
          });

      
          var reqIntranet = wrappedRequest(settings);

          var $ = cheerio.load(reqIntranet.body);

          // Cheerio selector for SIGA from href attr at Intranet Services page
          var sigaURL = $('table:nth-child(1) tr:nth-child(2) strong a').attr('href');

          var reqSIGA = wrappedRequest( _.extend(settings, {url: sigaURL} ));

          var mainReq;

          for(var i = 0; i < settings.iterationLoop; i++) {
            mainReq = wrappedRequest( _.extend(settings, {url: requestedUrl}) );
          }

          wrappedRequest( _.extend(settings, {
            method: 'GET',
            url: 'https://siga.ufrj.br/sira/intranet/LogoutSiga.jsp'
          }));
          jar = request.jar();

          return mainReq.body;
      }, 
      ufrjCep: function(settings) {
        try {
          cep = Meteor.call(
            'stealerUFRJ',
            'https://siga.ufrj.br/sira/Service/hercules/cadastroDadosPessoaisHercules',
            _.extend(settings, { 
              iterationLoop: 3
            }
          ));

          var $ = cheerio.load(cep);
          cep = $('.textField').val();


          console.log(cep);
        } catch(e) {
          console.log(e);
        }

          return cep;
      }
  });


  //if(Meteor.isServer) {
    //var churros = Meteor.call('ufrjCep', {
      //form: {
        //usuario: '***REMOVED***', 
        //senha: '***REMOVED***',
        //PessoanextCard: 'PessoanextCard'
      //}
    //});
  //}

}());
