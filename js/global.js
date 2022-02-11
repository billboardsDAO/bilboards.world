// object to insert global functions of the dapp
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

// onsenui configuration
ons.ready(function () {
    
  ons.createElement('templates/connect.html', { append: true })
    .then(function (sheet) {
      dapp.showConnection = sheet.show.bind(sheet);
      dapp.hideConnection = sheet.hide.bind(sheet);
    });
    
});

setupContract();


