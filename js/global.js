// object to insert global window functions of the dapp
var dapp = {};

window.Buffer = buffer.Buffer;

window.dapp.address = "AmgPu5uYBSh7m7n6kiaA81y7HfuE4jDyBhz5Sn8yV1mgsMnk7bYC";
window.dapp.abi = `{"version":"0.2","language":"lua","functions":[{"name":"get_NFT_table","view":true,"arguments":[{"name":"NFT_string"},{"name":"json_boolean"}]},{"name":"user_exists","view":true,"arguments":[{"name":"user_address"}]},{"name":"event_create","payable":true,"arguments":[{"name":"geopos_base64"},{"name":"media_base64"},{"name":"hours_string"},{"name":"provider_address"}]},{"name":"NFT_buy","payable":true,"arguments":[{"name":"NFT_string"},{"name":"referer_address"}]},{"name":"get_events_list","view":true,"arguments":[{"name":"json_boolean"}]},{"name":"user_applied_string","view":true,"arguments":[{"name":"user_address"}]},{"name":"commit","arguments":[{"name":"billboard_hash"},{"name":"secret_hash"},{"name":"index_string"}]},{"name":"get_user_data","view":true,"arguments":[{"name":"user_address"},{"name":"json_boolean"}]},{"name":"NFT_mint","arguments":[]},{"name":"get_marketplace_list","view":true,"arguments":[{"name":"from_string"},{"name":"size_number"},{"name":"json_boolean"}]},{"name":"get_billboards_list","view":true,"arguments":[{"name":"from_string"},{"name":"size_number"},{"name":"json_boolean"}]},{"name":"constructor","arguments":[{"name":"marketing_address"}]},{"name":"get_factor_string","view":true,"arguments":[]},{"name":"NFT_apply","arguments":[{"name":"NFT_string"}]},{"name":"reveal","arguments":[{"name":"billboard_hash"},{"name":"coupon_hash"},{"name":"event_string"}]},{"name":"get_reveal_differences_ts","view":true,"arguments":[{"name":"billboard_hash"}]},{"name":"get_factor_list","view":true,"arguments":[{"name":"from_string"},{"name":"size_number"},{"name":"json_boolean"}]},{"name":"get_user_captcha_ts","view":true,"arguments":[{"name":"user_address"}]},{"name":"NFT_set_price","arguments":[{"name":"NFT_string"},{"name":"price_string"}]},{"name":"NFT_claim_envelope","arguments":[]},{"name":"get_contract_stats","view":true,"arguments":[]},{"name":"get_NFT_attrhash","view":true,"arguments":[{"name":"NFT_string"}]},{"name":"get_marketing_address","view":true,"arguments":[]},{"name":"billboard_create","payable":true,"arguments":[{"name":"media_base64"},{"name":"billboard_hash"},{"name":"arg_0_string"},{"name":"..."}]}],"state_variables":[{"name":"__since_ts","type":"value"},{"name":"NUMBER_1e18_bignum","type":"value"},{"name":"__NFT_sales_ns","type":"value"},{"name":"EVENT_MIN_HOURS_bignum","type":"value"},{"name":"COUPONS_MAX_PER_BILLBOARD_number","type":"value"},{"name":"COLLECTED_INITIAL_REFERENCE_bignum","type":"value"},{"name":"__paid_ns","type":"value"},{"name":"__billboard_map","type":"map"},{"name":"NFT_INITIAL_MINT_COUNT_number","type":"value"},{"name":"__factor_indexes_map","type":"map"},{"name":"__user_map2","type":"map","dimension":2},{"name":"__v_collected_ns","type":"value"},{"name":"__billboard_coupons_map2","type":"map","dimension":2},{"name":"NFT_MILESTONE_COLLECTABLE_bignum","type":"value"},{"name":"__c_collected_ns","type":"value"},{"name":"NFT_INITIAL_PRICE_bignum","type":"value"},{"name":"__billboard_list_map","type":"map"},{"name":"__NFT_applied_map","type":"map"},{"name":"BILLBOARD_INCREMENTAL_EXPIRATION_bignum","type":"value"},{"name":"__marketplace_map","type":"map"},{"name":"__billboard_hashes_map2","type":"map","dimension":2},{"name":"__event_older_ns","type":"value"},{"name":"COUPON_HASH_SIZE_number","type":"value"},{"name":"BILLBOARD_USER_TIMELOCK_bignum","type":"value"},{"name":"__timelock_map","type":"map"},{"name":"__NFT_map","type":"map"},{"name":"__factor_subts_map","type":"map"},{"name":"__hashes_avaliable_map2","type":"map","dimension":2},{"name":"EVENT_MAX_CONCURRENT_number","type":"value"},{"name":"EVENT_MAX_HOURS_bignum","type":"value"},{"name":"BILLBOARD_MIN_VALUE_DIVISOR_bignum","type":"value"},{"name":"BILLBOARD_MIN_EXPIRATION_bignum","type":"value"},{"name":"__envelopes_ns","type":"value"},{"name":"COUPONS_MIN_PER_BILLBOARD_number","type":"value"},{"name":"__marketing_address","type":"value"},{"name":"__event_map2","type":"map","dimension":2}]}`;

window.dapp.contract = undefined;


window.dapp.homepage = "https://google.com"

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
   
    if ((window.aergo)&&(window.account)) {
        localforage.getItem('applied').then(function(value) {
            if(value == null) localforage.setItem('applied', 0);
            try {
                aergo.queryContract(window.dapp.contract.user_applied_string(window.account.address)).then(function(value2){
                   localforage.setItem('applied', Number(value2));             
                });
            } catch(ex){}
        });
    }
      
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
           //window.dapp.contract = Contract.atAddress(window.dapp.address);
           //window.dapp.contract.loadAbi(await aergo.getABI(window.dapp.address));
           window.dapp.contract = Contract.fromAbi(window.dapp.abi).setAddress(window.dapp.address);
           
           localforage.setItem('marketing_address', await aergo.queryContract(window.dapp.contract.get_marketing_address()));           
           
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
        document.getElementById("events-list").innerHTML = '<ons-list-header class="list-header">Current Events</ons-list-header><ons-progress-circular indeterminate></ons-progress-circular>';
    });    
           
    document.querySelector('#menu').addEventListener('preopen', function() {

        if (window.account) {
            document.getElementById("wallet-menu-connected").style.display = "block";
            document.getElementById("marketpĺace-connected").style.display = "block";
            document.getElementById("wallet-menu-disconnected").style.display = "none";
        } else {
            document.getElementById("wallet-menu-connected").style.display = "none";
            document.getElementById("marketpĺace-connected").style.display = "none";
            document.getElementById("wallet-menu-disconnected").style.display = "block";           
        }

    });
    
    document.querySelector('#search').addEventListener('preopen', function() {        

        if (window.dapp.contract) {

            var query_events = async function() {
                const events_list = await aergo.queryContract(window.dapp.contract.get_events_list());

                document.getElementById("events-list").innerHTML = '<ons-list-header class="list-header">Current Events</ons-list-header>';

                if (events_list.length>0) {

                    for(i=0;i<events_list.length;i++) {

                         const resp = await fetch('https://en.wikipedia.org/w/api.php?'+window.encodeQueryData({"action":"parse","format":"json","origin":"*","prop":"text","formatversion":2,"page":decodeURIComponent(escape(window.atob(events_list[i].media_base64)))}));
                         const respjson = await resp.json();

                        try {

                          var litem = document.createElement('ons-list-item');
                          litem.setAttribute("tappable", "tappable");
                          litem.setAttribute("modifier", "longdivider");
                          litem.setAttribute("style", "text-overflow:ellipsis;width:226px;overflow:hidden;");
                          litem.setAttribute("data-value_per_hour", events_list[i].value_per_hour_ns.toString());
                          litem.innerHTML = `Wikipedia:&nbsp;${window.escapeHtml(respjson.parse.title)}`;

                           document.getElementById("events-list").insertBefore(litem);

                           let litemx = document.getElementById("events-list").querySelectorAll("ons-list-item");

                            let sorted = Array.from(litemx).sort(function(a, b){return b.dataset.value_per_hour-a.dataset.value_per_hour});

                            document.getElementById("events-list").innerHTML = '<ons-list-header class="list-header">Current Events</ons-list-header>';
                            sorted.forEach(e => document.getElementById("events-list").appendChild(e));

                         } catch(ex){console.log("invalid wikipedia article")}        

                    }

                } else {

                  var litem = document.createElement('ons-list-item');
                  litem.innerHTML = `<div class="center">
                    <span class="list-item__title">All events have expired!</span>
                  </div>`;

                  document.getElementById("events-list").insertBefore(litem);

                }       

            };
            query_events();

        }  

    });
    
    
    
});




  window.dapp.open_menu = function() {
    document.getElementById('menu').open();
  };

  window.dapp.open_search = function() {
    document.getElementById('search').open();  
  };

  window.dapp.hide_menu = function() {
    document.getElementById('menu').close();
  };

  window.dapp.hide_search = function() {
    document.getElementById('search').close();
  };

  window.dapp.exit = function() {
    
      if (window.account) {
        
          ons.openActionSheet({
            title: 'Aergo Connect',
            cancelable: true,
            buttons: [
              { //0
                label: 'Disconnect and Exit DApp',
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
                location.href = window.dapp.homepage;
            } else document.getElementById('menu').open();
        
        });        
        
    } else { 
        
        location.href = window.dapp.homepage;
        
    }
      
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
        center: [-23.6266, -46.5638],
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

window.dapp.get_nft_attr = function(nft_id) {
 
    if(Number.isInteger(Number(nft_id))) {if(Number(nft_id)>0){
            
            let hashed = sha256('billboards'+nft_id).toLowerCase().split('');
            
            hashed[0] = 04 + (hashed[0].charCodeAt() - (hashed[0].charCodeAt() <= 57 ? 47 : 86)); // 04 + 16 = 20
            hashed[1] = 06 + (hashed[1].charCodeAt() - (hashed[1].charCodeAt() <= 57 ? 47 : 86)); // 06 + 16 = 22
            hashed[2] = 08 + (hashed[2].charCodeAt() - (hashed[2].charCodeAt() <= 57 ? 47 : 86)); // 08 + 16 = 24
            hashed[3] = 11 + (hashed[3].charCodeAt() - (hashed[3].charCodeAt() <= 57 ? 47 : 86)); // 11 + 16 = 27
            hashed[4] = 15 + (hashed[4].charCodeAt() - (hashed[4].charCodeAt() <= 57 ? 47 : 86)); // 15 + 16 = 31

            return {
                extra_coupon_expires: 60 *
                ((hashed[hashed[0]].charCodeAt() - (hashed[hashed[0]].charCodeAt() <= 57 ? 47 : 86)) +
                (hashed[hashed[1]].charCodeAt() - (hashed[hashed[1]].charCodeAt() <= 57 ? 47 : 86)) + 
                (hashed[hashed[2]].charCodeAt() - (hashed[hashed[2]].charCodeAt() <= 57 ? 47 : 86))),                
                extra_event_expires: hashed[hashed[3]].charCodeAt() - (hashed[hashed[3]].charCodeAt() <= 57 ? 47 : 86),                
                extra_collectable: (hashed[hashed[4]].charCodeAt() - (hashed[hashed[4]].charCodeAt() <= 57 ? 47 : 86)) - 1 
            }
        
    }} 
    
    return false;
    
}

window.dapp.buy_nft = function(nft_id_string, aer_amount) {
    
    window.postMessage({
      type: 'AERGO_REQUEST',
      action: "SEND_TX",
      data: {
        from: window.account.address,
        to: window.dapp.address,
        amount: aer_amount + ' aer',
        payload_json: { "Name": "NFT_buy", "Args": (location.hash.replace("#","")==""?[nft_id_string]:[nft_id_string,location.hash.replace("#","")])}
      }
    });
    
    window.addEventListener("AERGO_SEND_TX_RESULT", function(event) {
      window.dapp.load('templates/my_nfts.html');
    }, { once: true });
    
}

window.dapp.apply_nft = function(nft_id_string) {
    
    window.postMessage({
      type: 'AERGO_REQUEST',
      action: "SEND_TX",
      data: {
        from: window.account.address,
        to: window.dapp.address,
        amount: '0 aer',
        payload_json: { "Name": "NFT_apply", "Args": [nft_id_string]}
      }
    });
    
    window.addEventListener("AERGO_SEND_TX_RESULT", function(event) {
      if ('error' in event.detail) {
         ons.notification.toast('Opss... Aergo Connection failed! Try again!', { timeout: 5000, animation: 'fall' });
         window.dapp.load('templates/my_nfts.html');
      } else {
        setTimeout(function(h){
            aergo.getTransactionReceipt(h).then(txInfo => {
                if (txInfo.status == "SUCCESS") {
                  const tx = JSON.parse(txInfo.result.toString());
                  if (!isNaN(tx)) {
                      ons.notification.toast('SUCCESS! NFT #'+tx+' has been applied successfully!', { timeout: 5000, animation: 'fall' });
                      localforage.setItem('applied', Number(tx));  
                  } else {
                      ons.notification.toast('FAIL! Transaction failed... Try again!', { timeout: 5000, animation: 'ascend' });
                  }
                } else {
                   ons.notification.toast('Opss... Transaction failed!<br/>'+tx.toString(), { timeout: 5000, animation: 'ascend' });
                }
                setTimeout(function(){window.dapp.load('templates/my_nfts.html')}, 400);
            });            
        }, 3500, event.detail.hash);
      }      
    }, { once: true });
    
}

window.dapp.sell_nft = function(nft_id_string, price_value) {     

    window.postMessage({
      type: 'AERGO_REQUEST',
      action: "SEND_TX",
      amount: '0 aer',
      data: {
        from: window.account.address,
        to: window.dapp.address,
        amount: '0 aer',
        payload_json: { "Name": "NFT_set_price", "Args": [nft_id_string, (new herajs.Amount(price_value.replace(",","."), "aergo", "aer")).toString().replace(/ aer/, "")]}
      }
    });
    
    window.addEventListener("AERGO_SEND_TX_RESULT", function(event) {
      window.dapp.load('templates/my_nfts.html');
    }, { once: true });    
    
}

window.dapp.mint_nft = function(nft_id_string, price_value) {     

    window.postMessage({
      type: 'AERGO_REQUEST',
      action: "SEND_TX",
      amount: '0 aer',
      data: {
        from: window.account.address,
        to: window.dapp.address,
        amount: '0 aer',
        payload_json: { "Name": "NFT_mint", "Args": []}
      }
    });
    
    window.addEventListener("AERGO_SEND_TX_RESULT", function(event) {
      if ('error' in event.detail) {
         ons.notification.toast('Opss... Aergo Connection failed! Try again!', { timeout: 5000, animation: 'fall' });
         window.dapp.load('templates/my_nfts.html');
      } else {
        setTimeout(function(h){
            aergo.getTransactionReceipt(h).then(txInfo => {
                if (txInfo.status == "SUCCESS") {
                  const tx = JSON.parse(txInfo.result.toString());
                  if (tx.toString().toLowerCase()=="false") {
                      ons.notification.toast('FAIL! Transaction failed... Try again!', { timeout: 5000, animation: 'ascend' });  
                  } else if (!isNaN(tx.toString())) {
                      ons.notification.toast('SUCCESS! You generated NFT #'+tx.toString(), { timeout: 5000, animation: 'fall' });                      
                  } else {
                      ons.notification.toast('FAIL!<br/>'+tx.toString(), { timeout: 5000, animation: 'ascend' }); 
                  }
                } else {
                   ons.notification.toast('Opss... Transaction failed!<br/>'+tx.toString(), { timeout: 5000, animation: 'ascend' });
                }
                window.dapp.load('templates/my_nfts.html');
            });            
        }, 3500, event.detail.hash);
      }      
    }, { once: true });    
    
}

window.dapp.create_envelope_div = function(container_el) {
  let div = document.createElement('div');
  div.className = "envelope-item";
  div.style.border = "solid 4px rgb(255, 204, 102)";
  div.dataset.aer="0"; // 0 is envelope
  div.innerHTML = `
     <table border=0 style="width:100%">
        <tr><!--title-->
            <td style="text-align:right;width:1%;">
                <ons-icon icon="fa-envelope"></ons-icon>
            </td>
            <td style="text-align:left;width:1%;" nowrap>
                 <b style="color:rgb(255, 204, 102);">Closed Envelope</b>
            </td>
            <td style="text-align:right;width:98%;">
              <ons-button onmouseup="window.dapp.mint_nft();">Open</ons-button>   
            </td>
        </tr>
    </table> 
  `; 
    
   //container_el.appendChild(div);    
   container_el.insertBefore(div, container_el.lastElementChild);
    
return false}

window.dapp.create_nft_div = function(nft_id, container_el, ac) {if(Number.isInteger(Number(nft_id))) {if(Number(nft_id)>0){

  let extras = window.dapp.get_nft_attr(nft_id);
    
    function map(x, in_min, in_max, out_min, out_max) {
      return Math.floor((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
    }
        
  let adjective = undefined;
  let rarity = map(extras.extra_coupon_expires,1*3*60,16*3*60,0,100) + map(extras.extra_event_expires,1,16,0,100) + map(extras.extra_collectable,0,15,0,100);
    
   if      ((rarity==0)||(rarity==300)) adjective = [5990,"black","<b>Impossible!?</b>","rgba(0, 0, 0, 0.2)"];
   else if (rarity<10) adjective = [1500,"#e6de00","<b>Collectible!</b>","rgba(230, 222, 0, 0.2)"];
   else if (rarity<200) adjective = [650,"rgb(138, 138, 138)","<b>Common</b>","rgba(138, 138, 138,0.2)"];
   else if (rarity<250) adjective = [750,"#ff6666","<b>Rare</b>","rgba(255, 102, 102,0.2)"];
   else if (rarity<265) adjective = [900,"#ff0000","<b>Very Rare</b>","rgba(255, 0, 0,0.2)"];
   else if (rarity<285) adjective = [1200,"#0000ff","<b>Epic</b>","rgba(0, 0, 255,0.2)"];
   else adjective = [2000,"#5200cc","<b>Legendary</b>","rgba(82, 0, 204,0.2)"];
    
  let div = document.createElement('div');
  div.className = "nft-item";
  div.style.border = "solid 4px "+adjective[1];
  div.dataset.aer="1"; // 0 is envelope
  div.id = "nft-"+nft_id;
  div.innerHTML = `
     <table border=0 style="width:100%">
        <tr><!--title-->
            <td style="text-align:right;width:1%;">
                <img  alt="Loading" data-id="${nft_id}" data-price="${adjective[0]}" class="lazy" data-src="https://www.gravatar.com/avatar/${sha256('billboards'+nft_id).toLowerCase().slice(-32)}?s=60&r=g&d=robohash" style="width:60px;height:60px" /> 
            </td>
            <td style="text-align:left;width:1%;" nowrap>
                 <b>#${nft_id}</b></br>
                 <span style="color:${adjective[1]};">${adjective[2]}<span>   
            </td>
            <td style="text-align:right;width:98%;" id="options_${nft_id}"></td>  
        </tr>
        <tr><!--attrs-->
            <td colspan="3">
                <canvas id="canvas_${nft_id}" width="390" height="250" onclick="ons.notification.alert('<p><b>EXTRA COUPON MINUTES:</b>&nbsp;Free extra minutes for each coupon on your billboards:&nbsp;<b>${Math.floor(extras.extra_coupon_expires/60)} minutes</b></p><p><b>EXTRA EVENT HOURS:</b>&nbsp;Free extra hours for each new event:&nbsp;<b>${extras.extra_event_expires} hour${extras.extra_event_expires==1?"":"s"}</b></p><p><b>EXTRA CLAIMABLES:</b>&nbsp;Free extra claimables for each new billboard:&nbsp;<b>${extras.extra_collectable}</b></p>', {title:'NFT #${nft_id}'});"></canvas>
            </td>          
        </tr>
    </table> 
  `; 

   //container_el.appendChild(div);    
   container_el.insertBefore(div, container_el.lastElementChild);
    
    setTimeout(async function(a,b,c,d,e,f){
        lazyload.update();
        let ds = [{
                    label: 'NFT #'+d,
                    data: [a, b, c],
                    fill: true,
                    backgroundColor: e[3],
                    borderColor: e[1],
                    pointBackgroundColor: e[1],
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: e[1]
                  }];
        
        if (f) ds.push(f);
        
        new Chart(document.getElementById('canvas_'+d), {
            type: 'radar',
            data: {
                  labels: [
                    'EXTRA COUPON MINUTES %',
                    'EXTRA EVENT HOURS %',
                    'EXTRA CLAIMABLES %'
                  ],
                datasets: ds
            },
            options: {
                scales: {
                    r: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                          ticks: {
                            display: false
                          },
                          pointLabels: {
                            display: false
                          }
                    }
                }
            }
        });        
    }, 500, map(extras.extra_coupon_expires,1*3*60,16*3*60,0,100), map(extras.extra_event_expires,1,16,0,100), map(extras.extra_collectable,0,15,0,100), nft_id, adjective, ac)
   return true
    
}}return false}

window.dapp.executeLazyFunction = async function(element) {if ((window.aergo)&&(window.account)) {
    if (document.getElementById("options_"+element.dataset.id)) {
        if (document.getElementById("options_"+element.dataset.id).innerHTML=="") {
            const nft_table = await aergo.queryContract(window.dapp.contract.get_NFT_table(element.dataset.id.toString()));
            const applied = await localforage.getItem('applied');
            let applied_string = applied.toString();
            if (document.getElementById("options_"+element.dataset.id)) { // checking after promise
                if ((window.account.address!=nft_table.owner_address)&&(Number(nft_table.value_ns) >0)&&(applied_string!=nft_table.id_string)) {
                    document.getElementById("options_"+nft_table.id_string).innerHTML = `
                     <ons-button onmouseup="window.dapp.buy_nft('${nft_table.id_string}', '${nft_table.value_ns}');">Buy ${(new herajs.Amount(nft_table.value_ns, "aer", "aergo")).toString().replace(/ aergo/, "").replace(/^(\d+[\.,]\d{5}).*$/, "$1")} aergo</ons-button>  
                    `;
                } else if ((window.account.address==nft_table.owner_address)&&(Number(nft_table.value_ns)==0)&&(Number(applied_string)==0)) {
                    document.getElementById("options_"+nft_table.id_string).innerHTML = `
                    <ons-button onmouseup="window.dapp.apply_nft('${nft_table.id_string}');">Apply</ons-button>                   
                    `;
                } else if ((window.account.address==nft_table.owner_address)&&(Number(nft_table.value_ns)==0)&&(applied_string!=nft_table.id_string)) {
                    document.getElementById("options_"+nft_table.id_string).innerHTML = `
                     <ons-button onmouseup="ons.notification.prompt('Enter the Aergo amount you want to sell:', {
                        cancelable: true,
                        defaultValue: ${element.dataset.price},
                        inputType: 'number',
                        buttonLabels: ['Sell NFT #${nft_table.id_string}']
                     }).then(function(input) {    
                        if (input) {
                            if(Number.isInteger(Number(input))) {if(Number(input)>0){            
                                window.dapp.sell_nft('${nft_table.id_string}',input);
                                return;
                            }}
                            ons.notification.alert('Invalid value, the operation was cancelled.');
                        }
                     });">Sell</ons-button>&nbsp;<ons-button onclick="window.dapp.apply_nft('${nft_table.id_string}');">Apply</ons-button>
                    `;
                } else if ((window.account.address==nft_table.owner_address)&&(Number(nft_table.value_ns)==0)&&(applied_string==nft_table.id_string)) {
                    document.getElementById("options_"+nft_table.id_string).innerHTML = `
                        <ons-button modifier="large--quiet" disabled="true"><ons-icon icon="fa-check"></ons-icon>&nbsp;Currently applied</ons-button>
                    `;
                } else if ((window.account.address==nft_table.owner_address)&&(Number(nft_table.value_ns) >0)&&(applied_string!=nft_table.id_string)) {
                    document.getElementById("options_"+nft_table.id_string).innerHTML = `
                     <ons-button onmouseup="ons.notification.prompt('Enter the Aergo amount you want to set the new price:', {
                        cancelable: true,
                        defaultValue: ${(new herajs.Amount(nft_table.value_ns, "aer", "aergo")).toString().replace(/ aergo/, "").replace(/^(\d+[\.,]\d{5}).*$/, "$1")},
                        inputType: 'number',
                        buttonLabels: ['Set price NFT #${nft_table.id_string}']
                     }).then(function(input) {    
                        if (input) {
                            if(Number.isInteger(Number(input))) {if(Number(input)>0){            
                                window.dapp.sell_nft('${nft_table.id_string}',input);
                                return;
                            }}
                            ons.notification.alert('Invalid value, the operation was cancelled.');
                        }
                     });">Set Price</ons-button>&nbsp;<ons-button onclick="window.dapp.sell_nft('${nft_table.id_string}','0');">Cancel Sale</ons-button>
                    `;
                } else if ((window.account.address!=nft_table.owner_address)&&(Number(nft_table.value_ns)==0)&&(applied_string!=nft_table.id_string)) {
                     document.getElementById("options_"+nft_table.id_string).innerHTML = `
                        <ons-button modifier="large--quiet" disabled="true"><ons-icon icon="fa-store"></ons-icon>&nbsp;NOT FOR SALE!</ons-button>
                    `;
                } else {
                    document.getElementById("options_"+nft_table.id_string).innerHTML = `
                        <ons-button modifier="large--quiet" disabled="true"><ons-icon icon="fa-bug"></ons-icon>&nbsp;not loaded...</ons-button>
                    `;
                }
                 element.dataset.aer = Number(nft_table.value_ns)==0?"1":nft_table.value_ns;
            }
            /*let itemp = element.parentNode;
            let sorted = Array.from(itemp.childNodes).sort(function(a, b){return Number(a.dataset.aer)-Number(b.dataset.aer)});
            itemp.innerHTML = '';
            sorted.forEach(e => itemp.appendChild(e));*/
        } 
    }
}}

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
