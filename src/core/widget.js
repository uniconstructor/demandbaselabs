var Demandbase = {
  init: function() {
    Demandbase.jQuery = jQuery.noConflict(true);
    Demandbase.Widget.init();
  }
};

Demandbase.Widget = {
  container: null,
  greeting_container: null,
  suggest_correction_container: null,
  suggest_correction_form: null,
  
  init: function() {
    // if user has already submitted suggestion (based on cookie), just return
    if (Demandbase.Widget.read_cookie("demandbase_widget_suggested_correction")) { return true; }
    
    Demandbase.Widget.container = Demandbase.jQuery('#demandbase_widget_container');
    
    // create the greeting portion
    Demandbase.Widget.container.append('<div id="demandbase_widget_greeting"></div>');
    Demandbase.Widget.greeting_container = Demandbase.jQuery('#demandbase_widget_greeting');
    Demandbase.Widget.greeting_container.hide();
    
    // create the suggest_correction portion
    Demandbase.Widget.container.append('<div id="demandbase_widget_suggest_correction"></div>');
    Demandbase.Widget.suggest_correction_container = Demandbase.jQuery('#demandbase_widget_suggest_correction');
    Demandbase.Widget.suggest_correction_container.hide();
    // Demandbase.Widget.suggest_correction_container.css('position', "absolute");
    
    // render the respective contents of each
    Demandbase.Widget.render_suggest_correction_form();
    Demandbase.Widget.render_greeting();
    
    // include the query string IP if present
    var optional_ip = ''; pairs = window.location.search.substr(1).split('&');
    for(pair in pairs) if(pairs[pair].match(/query=[\d\.]+/)) optional_ip = pairs[pair];
    
    // load the Demandbase data for the IP
    Demandbase.jQuery.getJSON("http://api.demandbase.com/api/v1/ip.json?token=widget&"+optional_ip+"&callback=?", function(data) {
      var greeting_company_name, greeting_location;
      if(data.company_name) && (data.city && data.state)) {
        greeting_company_name = data.company_name;
        greeting_area = data.city + ", " + data.state;
        greeting_location = data.zip;
        
        Demandbase.jQuery('#demandbase_widget_company_name').html(greeting_company_name);
        Demandbase.jQuery('#demandbase_widget_area').html(greeting_area);
        Demandbase.jQuery('#demandbase_widget_location').html(greeting_location);
        
        Demandbase.jQuery('#demandbase_widget_suggested_correction_ip').val(data.ip);
        
        Demandbase.jQuery('#demandbase_widget_suggested_correction_suggested_company_name').val(greeting_company_name);
        Demandbase.jQuery('#demandbase_widget_suggested_correction_corrected_company_name').val(greeting_company_name);
        
        Demandbase.jQuery('#demandbase_widget_suggested_correction_suggested_location').val(greeting_location);
        
        // TODO: append the dash only if greeting_location is not null and it doesn't already have a dash
        Demandbase.jQuery('#demandbase_widget_suggested_correction_corrected_location').val(greeting_location);
        
        Demandbase.Widget.greeting_container.show();
      }
    });
  },
  
  /**
   * Put a cookie on the user's browser.
   *
   * @param {String} name Cookie name.
   * @param {String} value Value to store.
   * @param {Int} days Optional - how long until it expires.
   */
  create_cookie: function(name, value, days) {
    
    // if a number of days has been included in the call, calculate the expiration,
    // otherwise no expiration.
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      var expires = "; expires=" + date.toGMTString();
    } else {
      var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  },
  
  /**
   * Looks for param name in browser cookies and returns value if present; null if not.
   *
   * @param {String} name Key to value to return.
   * @returns {String} or {null} Depending on success
   */
  read_cookie: function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') {
        c = c.substring(1,c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length,c.length);
      }
    }
    return null;
  },
  
  /**
   * Erases a cookie by nullifying it.
   *
   * @param {String} name Key to value to erase.
   */  
  erase_cookie: function(name) {
    Demandbase.Widget.create_cookie(name,"",-1);
  },
  
  render_container: function() {
    document.write('<div id="demandbase_widget_container"></div>');
  },
  
  render_greeting: function() {
    Demandbase.Widget.greeting_container.append('<img src="http://api.demandbase.com/widget.png" /> &nbsp;');
    Demandbase.Widget.greeting_container.append('Welcome <span id="demandbase_widget_company_name"></span> - <span id="demandbase_widget_area"></span> <span id="demandbase_widget_location"></span>');
    Demandbase.Widget.greeting_container.append('&nbsp;&nbsp;&larr;&nbsp;<a href="#" id="demandbase_widget_not_you_link">Not your company?</a>');
    Demandbase.jQuery('#demandbase_widget_not_you_link').bind('click', function() {
      Demandbase.Widget.greeting_container.hide();
      Demandbase.Widget.suggest_correction_container.show();
      Demandbase.jQuery('#demandbase_widget_suggested_correction_corrected_company_name').focus().select();
    });
  },
  
  fade_out_container: function() {
    setTimeout(function() { Demandbase.Widget.container.fadeOut('slow'); }, 1000);
  },
  
  render_suggest_correction_form: function() {
    // Demandbase.Widget.suggest_correction_container.append('<span>Suggest a correction</span>');
    
    Demandbase.Widget.suggest_correction_container.append('<form id="demandbase_widget_suggest_correction_form" action="http://api-admin.demandbase.com/suggested_corrections/submit" method="POST"></form>');
    Demandbase.Widget.suggest_correction_form = Demandbase.jQuery('#demandbase_widget_suggest_correction_form');
    Demandbase.Widget.suggest_correction_form.append('<input type="hidden" name="suggested_correction[ip]" value="" id="demandbase_widget_suggested_correction_ip" />');
    Demandbase.Widget.suggest_correction_form.append('<input type="hidden" name="suggested_correction[time_zone]" value="" id="demandbase_widget_suggested_correction_time_zone" />');
    Demandbase.Widget.suggest_correction_form.append('<input type="hidden" name="suggested_correction[location]" value="" id="demandbase_widget_suggested_correction_location" />');
    
    Demandbase.Widget.suggest_correction_form.append('<img src="http://api.demandbase.com/widget.png" /> &nbsp;');
    Demandbase.Widget.suggest_correction_form.append('<label for="demandbase_widget_suggested_correction_corrected_company_name">Your Company</strong></label>&nbsp;');
    Demandbase.Widget.suggest_correction_form.append('<input type="hidden" name="suggested_correction[suggested_company_name]" value="" id="demandbase_widget_suggested_correction_suggested_company_name" />');
    Demandbase.Widget.suggest_correction_form.append('<input type="text" name="suggested_correction[corrected_company_name]" value="" id="demandbase_widget_suggested_correction_corrected_company_name" />');
    Demandbase.Widget.suggest_correction_form.append('&nbsp; &nbsp;');
    
    Demandbase.Widget.suggest_correction_form.append('<label for="demandbase_widget_suggested_correction_corrected_location">Zip</label>&nbsp;');
    Demandbase.Widget.suggest_correction_form.append('<input type="hidden" name="suggested_correction[suggested_location]" value="" id="demandbase_widget_suggested_correction_suggested_location" />');
    Demandbase.Widget.suggest_correction_form.append('<input type="text" name="suggested_correction[corrected_location]" value="" id="demandbase_widget_suggested_correction_corrected_location" size="10" />');
    Demandbase.Widget.suggest_correction_form.append('&nbsp;');
    
    Demandbase.Widget.suggest_correction_form.append('<input type="submit" name="create" value="Save" />');
    Demandbase.Widget.suggest_correction_form.append('&nbsp; or <a href="#" id="demandbase_widget_cancel_suggestion_link">Cancel</a>');
    Demandbase.jQuery('#demandbase_widget_cancel_suggestion_link').bind('click', function() {
      Demandbase.Widget.suggest_correction_container.hide();
      Demandbase.Widget.greeting_container.show();
    });
    
    Demandbase.Widget.suggest_correction_form.bind('submit', function(event) {
      // set time zone and location
      Demandbase.jQuery('#demandbase_widget_suggested_correction_time_zone').val(new String((new Date).getTimezoneOffset()/-60));
      Demandbase.jQuery('#demandbase_widget_suggested_correction_location').val(window.location.href);
      
      // submit data
      Demandbase.jQuery.getJSON(event.target.action+'.json?'+Demandbase.Widget.suggest_correction_form.serialize()+'&callback=?', function(data) {
        Demandbase.Widget.container.html('Thank you for your submission!');
        Demandbase.Widget.fade_out_container();
        // set cookie so it will not show up again for 10 days
        Demandbase.Widget.create_cookie("demandbase_widget_suggested_correction", true, 10)
      });
      
      return false;
    });
  },
  
};

var jquery_node = document.createElement('script');
jquery_node.type = 'text/javascript';
jquery_node.src  = "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js";
if(jquery_node.addEventListener) {
  jquery_node.addEventListener("load", Demandbase.init, false);
} else if("onreadystatechange" in jquery_node) {
  jquery_node.onreadystatechange = function() {
    if(this.readyState == 'complete' || this.readyState == 'loaded') {
      Demandbase.init();
    }
  };
}
document.getElementsByTagName('head')[0].appendChild(jquery_node);
Demandbase.Widget.render_container();
