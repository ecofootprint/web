/*
A minimal Web Bluetooth connection example

created 6 Aug 2018
by Tom Igoe
*/
var myDevice;
var myService = 0xffb0;        // fill in a service you're looking for here
var myCharacteristic = 0xffb2;   // fill in a characteristic from the service here

function cr(){
  localStorage.removeItem("list");
  gd();
}

function storge() {
  if (typeof(Storage) !== "undefined") {
    if (localStorage.list) {
    localStorage.list = localStorage.list + document.getElementById("rn").value + "|";
  } else {
    localStorage.setItem("list",  document.getElementById("rn").value + "|");
  }
    alert("You have store the data!");
  } else {
    alert("Sorry, your browser does not support web storage...");
  }
}

function cd(){
  let lt = localStorage.list
  if (lt === undefined){
    return
  }
  let t2 = lt.replace( document.getElementById("demo").value +"|" ,"")
  localStorage.list = t2
  alert("Already delete!!");
  gd();
}
  
function gd(){
  const lt = localStorage.list;
  if (lt === undefined){
    document.getElementById("demo").innerHTML = "";
    return
  }
  const s2 = lt.split("|");
  let size = s2.length;
  let text = "";
  for (let i = 0; i < s2.length - 1; i++) {
    text += '<option value="';
    text += s2[i];
    text += '">';
    text += s2[i];
    text += "</option>";
  }
  document.getElementById("demo").innerHTML = text;
}

function connect(){
  navigator.bluetooth.requestDevice({
    // filters: [myFilters]       // you can't use filters and acceptAllDevices together
    optionalServices: [myService],
    acceptAllDevices: true
  })
  .then(function(device) {
    // save the device returned so you can disconnect later:
    myDevice = device;
    console.log(device);
    // connect to the device once you find it:
    return device.gatt.connect();
  })
  .then(function(server) {
    // get the primary service:
    return server.getPrimaryService(myService);
  })
  .then(function(service) {
    // get the  characteristic:
    return service.getCharacteristics();
  })
  .then(function(characteristics) {
    // subscribe to the characteristic:
    for (c in characteristics) {
      characteristics[c].startNotifications()
      .then(subscribeToChanges);
    }
  })
  .catch(function(error) {
    // catch any errors:
    console.error('Connection failed!', error);
  });
}

// subscribe to changes from the meter:
function subscribeToChanges(characteristic) {
  characteristic.oncharacteristicvaluechanged = handleData;
}

// handle incoming data:
function handleData(event) {
  // get the data buffer from the meter:
  var buf = new Uint8Array(event.target.value);
  console.log(buf);
}

// disconnect function:
function disconnect() {
  if (myDevice) {
    // disconnect:
    myDevice.gatt.disconnect();
  }
}



