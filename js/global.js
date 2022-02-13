// object to insert global window functions of the dapp
var dapp = {};

// localforage configuration
localforage.config({    
    name: 'billboardsDAO',
    description: 'billboardsDAO database'  
});

/*
billboardsDAO keys:

billboards_count (=> uint) number of billboards in database syncronized

1 
2
3 
... (=> billboard hash)

-------------------

lat;long 


*/

// interval
window.dapp.global = function() {
    
    
    
};
window.dapp.globalIterval = undefined;

window.dapp.switch_theme = function(checked, startup) {    
    alert("chamou");
    var oldlink = document.getElementsByTagName("link").item(0);

    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", "onsenui/extras/themes/"+(checked?'night':'day')+".css");

    document.getElementsByTagName("head").item(0).appendChild(newlink);
    
    if (!startup) {
        setTimeout(function(ol){document.getElementsByTagName("head").item(0).removeChild(ol)},50,oldlink);
        localforage.setItem('theme', checked);
    }

}

// onsenui configuration
ons.ready(function() {
    
  ons.createElement('templates/connect.html', { append: true })
    .then(function(sheet) {
      window.dapp.showConnection = sheet.show.bind(sheet);
      window.dapp.hideConnection = sheet.hide.bind(sheet);
    });   
    
    window.dapp.globalInterval = setInterval(window.dapp.global, 1000);
    
    alert(localforage.getItem('theme') == null);
    
    if (localforage.getItem('theme') == null) window.dapp.switch_theme(false, true); else window.dapp.switch_theme(true, true);

});



  window.dapp.open_menu = function() {
    document.getElementById('menu').open();
  };

  window.dapp.open_search = function() {
    document.getElementById('search').open();
  };

  window.dapp.load = function(page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content.load(page).then(menu.close.bind(menu));
  };

  window.dapp.share = function() {

      try {
        navigator.share({
          title: 'MDN',
          text: 'Learn web development on MDN!',
          url: 'https://developer.mozilla.org'
        })
      } catch(err) {}

  }
          
document.addEventListener('init', function(event) {   

    var page = event.target;

    // Creating map options

    // check element exists
    if (page.querySelector('#map')) {                

      var mapOptions = {
        center: [17.385044, 78.486671],
        zoom: 10
      }

      // Creating a map object
      var map = new L.map('map', mapOptions);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

    };

    if (page.querySelector('#share-btn')) {
        if (!navigator.share) page.querySelector('#share-btn').style.display = "none";            
    }

});



setupContract(); // METAMASK MODULE


