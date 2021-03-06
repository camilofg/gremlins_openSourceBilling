function loadScript(callback) {
	var s = document.createElement('script');
	s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';
	if(s.addEventListener) { 
		s.addEventListener('load',callback,false);
	} else if(s.readyState) {
		s.onreadystatechange = callback;
	}
	document.body.appendChild(s);
}

function unleashGremlins(ttl, callback) {
    function stop() {
        horde.stop();
        callback();
    }

    var horde = window.gremlins.createHorde()
    .gremlin(gremlins.species.clicker().clickTypes(['click'])
      .canClick(function(element){
        return (element.tagName.toLowerCase() == ('button' || 'a') && element.innerHTML != undefined);
      })
    )
    .gremlin(gremlins.species.formFiller()
      .canFillElement(function(element){
        return (element.tagName.toLowerCase() == 'input' && element.innerHTML != 'undefined');
      })
    )
    .gremlin(gremlins.species.toucher()
      .canTouch(function(element){
        return element.innerHTML != undefined;
      })
    )
    .gremlin(gremlins.species.scroller())
    .gremlin(gremlins.species.typer());

    horde.strategy(gremlins.strategies.distribution()
    .delay(50) 
    .distribution([0.5, 0.2, 0.1, 0.1, 0.1]) 
    );
    horde.seed(1234);

    horde.after(callback);
    window.onbeforeunload = stop;
    setTimeout(stop, ttl);
    horde.unleash();
}

// describe('1.) los estudiantes login ', function() {
//   it('should visit los estudiantes and log in succesfully', function () {
//     browser.url('http://demo.opensourcebilling.org');  
//     browser.pause(40000);

//       var mailInput = browser.element('.user_email');
//       console.log('entra en el login');
//       mailInput.click();
//       mailInput.setValue('');
//       mailInput.setValue('demo@osb.com');

//       browser.waitForVisible('input[id="login_pswd"]', 5000);
//       var passwordInput = browser.element('input[id="login_pswd"]');

//       passwordInput.click();
//       passwordInput.setValue('');
//       passwordInput.setValue('osbdemo123');

//       //browser.click('button=Sign in');

//       var loginBox = browser.element('log_btm');
//       loginBox.$('input').click();
      
      
//       expect(browser.getUrl()).toBe('http://demo.opensourcebilling.org/en/dashboard');
//   });
// });

describe('Monkey testing with gremlins ', function () {
  browser.url('http://demo.opensourcebilling.org');  
  browser.pause(40000);
  
      var loginBox = browser.element('.log_btm');
      loginBox.$('input').click();
      it('it should not raise any error', function () {
        
        browser.timeoutsAsyncScript(60000);
        browser.executeAsync(loadScript);
      
        browser.timeoutsAsyncScript(60000);
        browser.executeAsync(unleashGremlins, 60000);
      });

      afterAll(function() {
        browser.log('browser').value.forEach(function(log) { 
          browser.logger.info(log.message);//.split(' ')[2]);
        });
      });
});
