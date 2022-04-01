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

window.dapp.connectedInterval = 0;
window.dapp.currentHeight;

window.dapp.global = function() {
    window.dapp.connectedInterval--;
      
    if (document.getElementById("progress-bar")) {
        // progress-bar está visivel   
    }
    
    if (document.getElementById("bottom")) {
        
        let btn = document.querySelector("ons-bottom-toolbar>ons-row>ons-col>ons-toolbar-button"); // button    
        let span = document.querySelector("ons-bottom-toolbar>ons-row>ons-col>span"); // information
        
        if (window.aergo) {
            
            aergo.blockchain().then(blockchainState => {
                window.dapp.connectedInterval = 10;
                window.dapp.currentHeight = blockchainState.bestHeight;
                span.innerHTML = "Aergo&nbsp;"+window.account.chain+"&nbsp;<font style='color:green;'>&bull;</font>&nbsp;"+window.dapp.currentHeight;
            }, function(ex) {
                  span.innerHTML = "Aergo&nbsp;"+window.account.chain+"&nbsp;<font style='color:red;'>&bull;</font>&nbsp;"+window.dapp.currentHeight;
              });
            
            if (window.account) {
             
               btn.innerHTML = window.account.address.substr(0, 6)+"..."+window.account.address.substr(-3);
               btn.setAttribute("title", window.account.address);
                
            } else {
                
               btn.innerHTML = "Aergo Connect";
               btn.removeAttribute("title");
                
            }
            
            
        }
        
        
    }
    
    if (document.getElementById("claimable")) {
        // claimable está visivel   
        if (window.aergo) {
            if (window.account) {
                
                aergo.getState(window.account.address).then(state => {
                    document.getElementById("claimable").innerHTML = Number(state.balance).toFixed(5);
                    //console.log(state);
                })
                
            }            
        }
        
        
    }
    
    
    
    
    
};


window.dapp.aergoConnect = function() {
 
    if (window.account) {        
        window.dapp.aergoDisconnect();
    }
    
    
  window.postMessage({
    type: "AERGO_REQUEST",
    action:  "ACTIVE_ACCOUNT",
    data: {}
  });
    
   window.addEventListener("AERGO_ACTIVE_ACCOUNT", function(event) {

    if (event.detail.error) {
      return false;
    }
    
    let chain;
       
    if (event.detail.account.chainId == "aergo.io") {
        
       window.aergo = new AergoClient({}, new GrpcWebProvider({
        url: "https://mainnet-api-http.aergo.io"
       }));
      
   } else if (event.detail.account.chainId == "testnet.aergo.io") {
       
       window.aergo = new AergoClient({}, new GrpcWebProvider({
        url: "https://testnet-api-http.aergo.io"
       }));
       
    } else {
      return false;
    }
       
    window.account = {
      address: event.detail.account.address,
      chain: event.detail.account.chainId
    };

    }, {
    once: true
     });
   
    
}

window.dapp.aergoDisconnect = function() {
    window.account = undefined;
}


window.dapp.globalInterval = undefined;

window.dapp.switch_theme = function(checked, startup) {    

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

window.dapp.interfaceConnection = function(){
    
    if (window.account) {
        window.dapp.aergoDisconnect();
    } else {
        window.dapp.aergoConnect(); // show modal
    }
    
}

// onsenui configuration
ons.ready(function() {   

    window.AergoClient = herajs.AergoClient;
    window.GrpcWebProvider = herajs.GrpcWebProvider;
   
    window.dapp.globalInterval = setInterval(window.dapp.global, 2000);
    
    localforage.getItem('theme').then(function(value) {
        if(value == null) localforage.setItem('theme', false); 
        window.dapp.switch_theme(document.querySelector('#theme-switcher').checked = value, true);
    });
    
    
});




  window.dapp.open_menu = function() {
    document.getElementById('menu').open();
  };

  window.dapp.open_search = function() {
    document.getElementById('search').open();
  };

  window.dapp.hide_menu = function() {
    document.getElementById('menu').hide();
  };

  window.dapp.hide_search = function() {
    document.getElementById('search').hide();
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

window.dapp.showCaution = function(){
    ons.notification.toast('Before performing token trading, check the BOARDS token address corresponds to ONE1233454411545488815111', { timeout: 5000, animation: 'fall' });    
};
          
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
    
    //alert(page.id);

});



