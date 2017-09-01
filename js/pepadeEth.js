// ********
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address


//import fs from 'fs';
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
//web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.1.120:8547'));

var accounts = web3.eth.accounts;
let pepadesource = '[{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"_originAddress","type":"string"},{"name":"_destAddress","type":"string"},{"name":"_maxTemp","type":"int256"},{"name":"_minTemp","type":"int256"},{"name":"_weightInKg","type":"uint256"},{"name":"_expirationTime","type":"uint256"}],"name":"createShipment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"shipment","type":"address"}],"name":"NewShipment","type":"event"}]';
let shipmentsource = '[{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"confirmCollection","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getData","outputs":[{"name":"_recipient","type":"address"},{"name":"_weight","type":"uint256"},{"name":"_origin","type":"string"},{"name":"_dest","type":"string"},{"name":"_maxTemp","type":"int256"},{"name":"_minTemp","type":"int256"},{"name":"_cTime","type":"uint256"},{"name":"_eTime","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"recipient","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deliverer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawPayment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"iotNode","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"confirmReception","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"temperature","type":"int256"}],"name":"notifyTempBreach","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_proposedFee","type":"uint256"},{"name":"_offerExpiration","type":"uint256"}],"name":"deliverCandidate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"garbageCollect","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"}],"name":"selectDeliverer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_sender","type":"address"},{"name":"_recipient","type":"address"},{"name":"_originAddress","type":"string"},{"name":"_destAddress","type":"string"},{"name":"_maxTemp","type":"int256"},{"name":"_minTemp","type":"int256"},{"name":"_weightInKg","type":"uint256"},{"name":"_expirationTime","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"index","type":"uint256"},{"indexed":false,"name":"deliverCandidate","type":"address"},{"indexed":false,"name":"proposedFee","type":"uint256"},{"indexed":false,"name":"offerExpiration","type":"uint256"}],"name":"NewCandidate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"selectedDeliverer","type":"address"},{"indexed":false,"name":"finalFee","type":"uint256"}],"name":"DelivererSelected","type":"event"},{"anonymous":false,"inputs":[],"name":"ContractFunded","type":"event"},{"anonymous":false,"inputs":[],"name":"ParcelShipped","type":"event"},{"anonymous":false,"inputs":[],"name":"ParcelDelivered","type":"event"},{"anonymous":false,"inputs":[],"name":"ParcelExpired","type":"event"},{"anonymous":false,"inputs":[],"name":"FeePaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"deficit","type":"uint256"}],"name":"InsufficientFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"temperature","type":"int256"}],"name":"TemperatureException","type":"event"},{"anonymous":false,"inputs":[],"name":"ContractDestroyed","type":"event"}]';
let pepadeabi = JSON.parse(pepadesource);
let shipmentabi = JSON.parse(shipmentsource);
var baseAddress = "0x87cD84Aaa41277f8BDa73ed603b50ddf346aDafF";
//var baseAddress = "0x904b9197d85ec25fd8a1ff0d28752f839f64bf86";
let PePaDe = web3.eth.contract(pepadeabi);
let Shipment = web3.eth.contract(shipmentabi);
//PePaDe.setProvider(web3.currentProvider);
var pepadeInstance = PePaDe.at(baseAddress);
console.log('web3 version: ', web3.version.api);

function createNewShipment() {
  // candidateName = $("#candidate").val();
  var recipient = document.getElementById("senderreceivername").value;
  var originAddress = document.getElementById("senderfromaddress").value;
  var destAddress = document.getElementById("sendertoaddress").value;
  var maxTemp = new BigNumber(document.getElementById("sendermaxtemperature").value);
  var minTemp = new BigNumber(document.getElementById("sendermintemperature").value);
  var weightInKg = new BigNumber(document.getElementById("senderparcelweight").value);
  var expirationTime = new BigNumber(document.getElementById("senderdeliverbydate").value);
  const tx = pepadeInstance.createShipment.sendTransaction(recipient, originAddress, destAddress,
                                maxTemp, minTemp, weightInKg, expirationTime,
                                {from: web3.eth.accounts[0], gas: 2000000});
  // console.log(tx);
  // var filter = web3.eth.filter('latest');
  var shipEvent = pepadeInstance.NewShipment({});
  shipEvent.watch(function(error, result){
    if (!error) {
      console.log("New Shipment contract: ", result.args.shipment);
      shipEvent.stopWatching();
    } else {
      console.log(error)
    }
  });
}

function submitBid() {
  var contractAddress = document.getElementById().value;
  var shipmentInstance = Shipment.at(contractAddress);
  var delivererAddress = document.getElementById().value;
  var proposedFee = new BigNumber(document.getElementById().value);
  var expirationTime = new BigNumber(document.getElementById().value);
  const tx =  shipmentInstance.deliverCandidate(proposedFee, expirationTime,
               {from: delivererAddress});
  console.log(tx);
}

function getData(shipmentAddress) {
  var shipmentInstance = Shipment.at(shipmentAddress);
  shipmentInstance.getData.call().then(function(data) {

  });
}
