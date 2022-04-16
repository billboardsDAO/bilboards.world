// object to insert global window functions of the dapp
var dapp = {};

window.Buffer = buffer.Buffer;

window.dapp.address = "AmhK9K9RMZxVDQuUqVQsipdNoWCeYhTcQLxP9wwr1airLVybuncS";

window.dapp.contract = undefined;
window.dapp.abi = undefined;

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
            aergo.queryContract(window.dapp.contract.user_applied_string()).then(function(value2){
               localforage.setItem('applied', Number(value2));             
            });
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
           window.dapp.abi = await aergo.getABI(window.dapp.address);
           window.dapp.contract = Contract.atAddress(window.dapp.address);
           window.dapp.contract.loadAbi(await aergo.getABI(window.dapp.address));
           
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
            document.getElementById("wallet-menu-disconnected").style.display = "none";
        } else {
            document.getElementById("wallet-menu-connected").style.display = "none";
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

                           let litems = document.getElementById("events-list");
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

window.dapp.get_nft_attr = function(nft_id) {
 
    if (Number.isInteger(nft_id+0)) {
        if (nft_id>0) {
            
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

        }
    }   
    
    return false;
    
}

window.dapp.buy_nft = function(nft_id_string) {
    
    alert("comprar "+nft_id_string);///////////////////////////////////////////////////////////////////////////////////
    
}

window.dapp.apply_nft = function(nft_id_string) {
    
    alert("apply "+nft_id_string);///////////////////////////////////////////////////////////////////////////////////
    
}

window.dapp.sell_nft = function(nft_id_string, price_value) { 
    
    // price value => converter virgular para pontos
    // converter aergo para aer
    
    alert("sell "+nft_id_string+"|"+price_value);///////////////////////////////////////////////////////////////////////////////////
    
}

window.dapp.create_nft_div = function(nft_id, container_el) {if(Number.isInteger(nft_id+0)) {if(nft_id>0){

  let extras = window.dapp.get_nft_attr(nft_id);
    
    function map(x, in_min, in_max, out_min, out_max) {
      return Math.floor((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
    }
    
    
  let adjective = undefined;
  let rarity = map(extras.extra_coupon_expires,1*3*60,16*3*60,0,100) + map(extras.extra_event_expires,1,16,0,100) + map(extras.extra_collectable,0,15,0,100);
   
   if      ((rarity==0)||(rarity==300)) adjective = [5990,"black","<b>Impossible!?</b>"];
   else if (rarity<10) adjective = [1500,"#e6de00","<b>Collectible!</b>"];
   else if (rarity<100) adjective = [600,"#b3b3b3","Very Common"];
   else if (rarity<160) adjective = [650,"#00cc00","Common"];
   else if (rarity<200) adjective = [750,"##ff6666","Rare"];
   else if (rarity<250) adjective = [900,"#ff0000","<b>Very Rare</b>"];
   else if (rarity<280) adjective = [1200,"#0000ff","<b>Epic</b>"];
   else adjective = [2000,"#5200cc","<b>Legendary</b>"];
    
  let div = document.createElement('div');
  div.className = "nft-div";
  div.innerHTML = `
 
    <table border=0 style="width:100%">
        <tr><!--title--> 
           <td colspan="2" style="text-align:left;color:${adjective[1]};">
                 ${adjective[2]}
            </td>
            <td colspan="1" style="text-align:right;">
                 <b>#${nft_id}</b>
            </td>        
        </tr>
        <tr><!--image--> 
            <td colspan="3">
                <img  alt="Loading" data-id="${nft_id}" data-price="${adjective[0]}" class="lazy" data-src="https://www.gravatar.com/avatar/${sha256('billboards'+nft_id).toLowerCase().slice(-32)}?s=60&r=g&d=robohash" style="width:60px;height:60px" />            
            </td>        
        </tr>
        <tr><!--attrs-->
            <td width="33%" style="text-align:center;">
                <div
                    id="extra_coupon_expires_${nft_id}"
                    data-preset="bubble"
                    class="ldBar"
                    data-value="0"
                    onClick="ons.notification.toast('Free extra minutes for each coupon on your billboards.<br>${Math.floor(extras.extra_coupon_expires/60)} minutes', {timeout: 2000,buttonLabel: "OK"});">
                </div>
            </td>
            <td width="33%" style="text-align:center;">
              <div
                  id="extra_event_expires_${nft_id}"
                  data-type="fill"
                  data-path="M10 10L90 10L90 90L10 90Z"
                  class="ldBar"
                  data-value="0"
                  data-fill="data:ldbar/res,
                  bubble(#248,#fff,50,1)"
                  onClick="ons.notification.toast('Free extra hours for your events:<br>${extras.extra_event_expires} hour${extras.extra_event_expires==1?"":"s"}', {timeout: 2000,buttonLabel: "OK"});">
                </div>
            </td>
            <td width="33%" style="text-align:center;">
               <div
                  id="extra_collectable_${nft_id}"
                  data-type="fill"
                  data-path="M45 10L45 10L80 90L10 90Z"
                  class="ldBar"
                  data-value="0"
                  data-fill="data:ldbar/res,
                  bubble(#3fc2b8,#fff,50,1)"
                  onClick="ons.notification.toast('Extra claimables for each billboard created:<b>${extras.extra_collectable}', {timeout: 2000,buttonLabel: "OK"});">
                </div>
            </td>          
        </tr>  
         <tr><!--options--> 
            <td colspan="3" style="text-align:right;" id="options_${nft_id}"></td>        
        </tr>    
    </table>

  
  `; 
    
   container_el.append(div);

    let extra_coupon_expires_$ = new ldBar("#extra_coupon_expires_"+nft_id);
    let extra_event_expires_$ = new ldBar("#extra_event_expires_"+nft_id);
    let extra_collectable_$ = new ldBar("#extra_collectable_"+nft_id);
    
    extra_coupon_expires_$.set(map(extras.extra_coupon_expires,1*3*60,16*3*60,0,100));
    extra_event_expires_$.set(map(extras.extra_event_expires,1,16,0,100));
    extra_collectable_$.set(map(extras.extra_collectable,0,15,0,100));

   lazyload.update();
   return true
    
}}return false}

window.dapp.executeLazyFunction = async function(element) {if ((window.aergo)&&(window.account)) {
    if (document.getElementById("options_"+element.dataset.id)) {
        if (document.getElementById("options_"+element.dataset.id).innerHTML=="") {
            const nft_table = await aergo.queryContract(window.dapp.contract.get_NFT_table(element.dataset.id.toString()));
            const applied = await localforage.getItem('applied');
            let applied_string = applied.toString();            
            if        ((window.account.address!=nft_table.owner_address)&&(Number(nft_table.value_ns) >0)&&(applied_string!=nft_table.id_string)) {
                //console.log("mostrar preco e botão comprar ");                
                document.getElementById("options_"+nft_table.id_string).innerHTML = `
                 <ons-button onclick="document.getElementById('popover_buy_card_${nft_table.id_string}').show(this);">Buy NFT ${(new herajs.Amount(nft_table.value_ns, "aer", "aergo")).toString().replace(/ aergo/, "").replace(/^(\d+[\.,]\d{5}).*$/, "$1")} aergo</ons-button>
                <ons-popover cancelable id="popover_buy_card_${nft_table.id_string}">
                  <div style="padding: 10px; text-align: center;">
                    <p>
                      Are you sure you want to buy this NFT?
                    </p>
                    <p>
                      <ons-button onclick="window.dapp.buy_nft('${nft_table.id_string}');">Yes I'm sure!</ons-button>
                    </p>
                  </div>
                </ons-popover>               
                `;
            } else if ((window.account.address==nft_table.owner_address)&&(Number(nft_table.value_ns)==0)&&(Number(applied_string)==0)) {
                //console.log("mostrar botão aplicar");
                document.getElementById("options_"+nft_table.id_string).innerHTML = `
                <ons-button onclick="window.dapp.apply_nft('${nft_table.id_string}');">Apply NFT</ons-button>                   
                `;
            } else if ((window.account.address==nft_table.owner_address)&&(Number(nft_table.value_ns)==0)&&(applied_string!=nft_table.id_string)) {
                //console.log("mostrar botão vender aplicar");
                document.getElementById("options_"+nft_table.id_string).innerHTML = `
                 <ons-button onclick="document.getElementById('popover_sell_card_${nft_table.id_string}').show(this);">Sell NFT</ons-button>&nbsp;or&nbsp;<ons-button onclick="window.dapp.apply_nft('${nft_table.id_string}');">Apply NFT</ons-button>
                <ons-popover cancelable id="popover_sell_card_${nft_table.id_string}">
                  <div style="padding: 10px; text-align: center;">
                    <p>
                      What value (in aergo) do you want to sell it?
                    </p>
                    <p>
                      <ons-input id="price_${nft_table.id_string}" modifier="underbar" placeholder="Price in Aergo" value="${element.dataset.price}" type="number" required min="1" style="width:120px;"></ons-input>&nbsp;aergo
                    </p>
                    <p>
                      <ons-button onclick="window.dapp.sell_nft('${nft_table.id_string}',document.getElementById('price_${nft_table.id_string}').value);">Confirm to marketplace</ons-button>
                    </p>
                  </div>
                </ons-popover>               
                `;
            } else if ((window.account.address==nft_table.owner_address)&&(Number(nft_table.value_ns)==0)&&(applied_string==nft_table.id_string)) {
                //console.log("mostrar aplicado");
                document.getElementById("options_"+nft_table.id_string).innerHTML = `
                    <ons-button modifier="large" disabled="true"><ons-icon icon="fa-check"></ons-icon>&nbsp;NFT currently applied</ons-button>
                `;
            } else if ((window.account.address==nft_table.owner_address)&&(Number(nft_table.value_ns) >0)&&(applied_string!=nft_table.id_string)) {
                 //console.log("mostrar set price e não vender mais");
                document.getElementById("options_"+nft_table.id_string).innerHTML = `
                 <ons-button onclick="document.getElementById('popover_setprice_card_${nft_table.id_string}').show(this);">Set price</ons-button>&nbsp;or&nbsp;<ons-button onclick="window.dapp.sell_nft('${nft_table.id_string}',0);">Cancel Sale</ons-button>
                <ons-popover cancelable id="popover_setprice_card_${nft_table.id_string}">
                  <div style="padding: 10px; text-align: center;">
                    <p>
                     What value (in aergo) do you want to change?
                    </p>
                    <p>
                      <ons-input id="setprice_${nft_table.id_string}" modifier="underbar" placeholder="Price in Aergo" value="${(new herajs.Amount(nft_table.value_ns, "aer", "aergo")).toString().replace(/ aergo/, "").replace(/^(\d+[\.,]\d{5}).*$/, "$1")}" type="number" required min="1" style="width:120px;"></ons-input>&nbsp;aergo
                    </p>
                    <p>
                      <ons-button onclick="window.dapp.sell_nft('${nft_table.id_string}',document.getElementById('setprice_${nft_table.id_string}').value);">Set new price!</ons-button>
                    </p>
                  </div>
                </ons-popover>               
                `;
            } else if ((window.account.address!=nft_table.owner_address)&&(Number(nft_table.value_ns)==0)&&(applied_string!=nft_table.id_string)) {
                 //console.log("mostrar não está a venda"); 
                 document.getElementById("options_"+nft_table.id_string).innerHTML = `
                    <ons-button modifier="large--quiet" disabled="true"><ons-icon icon="fa-store"></ons-icon>&nbsp;NOT FOR SALE!</ons-button>
                `;
            } else {
                //console.log("mostrar erro")   
                document.getElementById("options_"+nft_table.id_string).innerHTML = `
                    <ons-button modifier="large--quiet" disabled="true"><ons-icon icon="fa-bug"></ons-icon>&nbsp;not loaded...</ons-button>
                `;
            }

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
