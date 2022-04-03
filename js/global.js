// object to insert global window functions of the dapp
var dapp = {};

window.Buffer = buffer.Buffer;

window.dapp.address = "Amhr6GDNoq57vkEtQ3AKowka3GiGYDbZMhWvNPpfkehV7hKPoezG";

window.dapp.contract = undefined;
window.dapp.abi = undefined;

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
                window.dapp.connectedInterval = 5;
                window.dapp.currentHeight = blockchainState.bestHeight;
                span.innerHTML = window.account.chain+"&nbsp;<font style='color:green;'>&bull;</font>&nbsp;"+window.dapp.currentHeight;
            }, function(ex) {
                document.querySelector("ons-bottom-toolbar>ons-row>ons-col>span>font").style.color = "red";
              });
            
            if (window.account) {
             
               btn.innerHTML = window.account.address.substr(0, 6)+"..."+window.account.address.substr(-3);
               btn.setAttribute("title", window.account.address);
                
            } else {
                
               btn.innerHTML = "Aergo Connect";
               btn.removeAttribute("title");
               span.innerHTML = span.getAttribute("data-placeholder");
                
            }
            
        } else {
            span.innerHTML = span.getAttribute("data-placeholder");
        }
        
        
    }
    
    if (document.getElementById("claimable")) {
  
        if ((window.aergo)&&(window.account)) {
                
                aergo.getState(window.account.address).then(state => {                    
                    localforage.getItem('claimable').then(function(value) {
                        if(value == null) localforage.setItem('claimable', 0);
                        
                        if (!document.querySelector("#claimable>span")) {
                            document.querySelector("#claimable").innerHTML = "<img alt='Aergo' width='20px' draggable='false' src='img/aergo_logomark.svg'>&nbsp;<span>&nbsp;</span>"
                        }
                        document.querySelector("#claimable>span").innerHTML = (new herajs.Amount(state.balance.value.toString(), "aer", "aergo")).toString().replace(/ aergo/, "").replace(/^(\d+[\.,]\d{5}).*$/, "$1") +
                        "&nbsp;<b>CLAIMABLE</b>:&nbsp;" + ((value == null)?"0":value.toString()); 
                                              
                    });
                })
       
        } else {
            
            document.getElementById("claimable").innerHTML = document.getElementById("claimable").getAttribute("data-placeholder");
            
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

    if (window.dapp.extensionPopoverTimeout) clearTimeout(window.dapp.extensionPopoverTimeout);
    document.getElementById('browser-extension-popover').hide();
       
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
       
       var load_contract = async function() {
           window.dapp.abi = await aergo.getABI(window.dapp.address);
           window.dapp.contract = Contract.atAddress(window.dapp.address);
           window.dapp.contract.loadAbi(await aergo.getABI(window.dapp.address));
       }
       load_contract();      

    }, {
    once: true
     });
   
    
}

window.dapp.aergoDisconnect = function() {
    window.account = undefined;
    window.dapp.abi = undefined;
    window.dapp.contract = undefined;
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


window.dapp.extensionPopoverTimeout = undefined;
window.dapp.interfaceConnection = function(){
    
    if (window.account) {
        
          ons.openActionSheet({
            title: 'Aergo Connect',
            cancelable: true,
            buttons: [
              { //0
                label: 'Disconnect',
                modifier: 'destructive',
                icon: 'fa-ban'
              },
              { //1
                label: 'Cancel',
                icon: 'md-close'
              }
            ]
         }).then(function (index) { 
        
            if (index == 0) {
                window.dapp.aergoDisconnect();        
            }        
        
        });        
        
    } else {
                
        ons.openActionSheet({
            title: 'Aergo Connect',
            cancelable: true,
            buttons: [
              { //0
                label: 'Aergo Web Node',
                modifier: 'destructive',
                icon: 'fa-network-wired'
              },
              { //1
                label: 'Cancel',
                icon: 'md-close'
              }
            ]
         }).then(function (index) { 
        
            if (index == 0) {
                window.dapp.aergoConnect();            
                
               window.dapp.extensionPopoverTimeout = setTimeout(function() {
                  window.dapp.extensionPopoverTimeout = undefined;
                  document.getElementById('browser-extension-popover').show(document.getElementById('search-menu'));
               }, 1500);
                
                
            }        
        
        });

    }
    
}

// onsenui configuration
ons.ready(function() {   

    window.AergoClient = herajs.AergoClient;
    window.GrpcWebProvider = herajs.GrpcWebProvider;
    window.Contract = herajs.Contract;
   
    window.dapp.globalInterval = setInterval(window.dapp.global, 5000);
    
    localforage.getItem('theme').then(function(value) {
        if(value == null) localforage.setItem('theme', false); 
        window.dapp.switch_theme(document.querySelector('#theme-switcher').checked = value, true);
    });
    
    document.querySelector('#search').addEventListener('preclose', function() {
        document.getElementById("events-list").innerHTML = '<ons-list-header class="list-header">Current Events</ons-list-header>';
    });
    
    
});




  window.dapp.open_menu = function() {
    document.getElementById('menu').open();
  };

  window.dapp.open_search = function() {
    document.getElementById('search').open();
      
    if (window.dapp.contract) {
        
        var query_events = async function() {
            const events_list = await aergo.queryContract(window.dapp.contract.get_events_list());
            
            document.getElementById("events-list").innerHTML = '<ons-list-header class="list-header">Current Events</ons-list-header>';
            
            for(i=0;i<events_list.length;i++) {
                
              fetch('https://en.wikipedia.org/w/api.php?'+window.encodeQueryData({"action":"parse","format":"json","origin":"*","prop":"text","formatversion":2,"page":decodeURIComponent(escape(window.atob(events_list[i].media_base64)))}))
              .then(function(response) {
                return response.json();
              })
              .then(function(myJson) {
                  
                  document.getElementById("events-list").innerHTML += `<ons-list-item modifier="longdivider" tappable>
                  <div class="left">
                    <img class="list-item__thumbnail" src="img/wikipedia_w.svg" height="32" width="32">
                  </div>
                  <div class="center">
                    <span class="list-item__title">${window.escapeHtml(myJson.parse.title)}</span><span class="list-item__subtitle">From Wikipedia</span>
                  </div>
                </ons-list-item>`;
                  
              });                
                
            }

        };
        query_events();
        
    }
      
      
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



window.encodeQueryData = function(data) {
   const ret = [];
   for (let d in data)
     ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
   return ret.join('&');
}
window.escapeHtml = function(unsafe)
{
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
