pragma solidity ^0.4.4;

contract PePaDe {
  enum State {
    Proposed, Funded, WithOffer, Agreed, Shipping, Delivered, Paid, Expired, Exception
  }

  address public sender;
  address public deliverer;
  address public recipient;
  address public iotNode;
  uint weightInKg;
  string originAddress;
  string destAddress;
  State public state;
  int maxTemp;
  uint public fee;
  uint deposit;
  address[] candidates;
  uint candidateLen;
  uint creationTime;
  uint expirationTime;
  bool senderConfirmed;
  bool delivererConfirmed;

  event NewCandidate(address deliverCandidate, uint index);
  event DelivererSelected(address selectedDeliverer);
  event ParcelShipped();
  event ParcelDelivered();
  event ParcelExpired();
  event FeePaid();
  event InsufficientFunds(uint deficit);
  event TemperatureException(int temperature);

  modifier onlySender {
    require(msg.sender == sender);
    _;
  }

  modifier onlyRecipient {
    require(msg.sender == recipient);
    _;
  }

  modifier onlyDeliverer {
    require(msg.sender == deliverer);
    _;
  }

  modifier onlyIotNode{
    require(msg.sender == iotNode);
    _;
  }

  modifier shippingState {
    require(state == State.Shipping);
    _;
  }

  modifier deliveredState {
    require(state == State.Delivered);
    _;
  }

  modifier garbageCollectable {
    require(state == State.Paid || state == State.Expired || state == State.Exception);
    _;
  }

  function PePaDe(address _recipient, string _originAddress,
           string _destAddress, int _maxTemp, uint _fee, uint _weightInKg,
           uint _expirationTime) payable {
    sender = msg.sender;
    recipient = _recipient;
    weightInKg = _weightInKg;
    originAddress = _originAddress;
    destAddress = _destAddress;
    maxTemp = _maxTemp;
    fee = _fee;
    creationTime = now;
    expirationTime = _expirationTime;
    candidateLen = 0;
    if (msg.value >= fee)
      state = State.Funded;
    else
      state = State.Proposed;
  }

  // fallback function; also check if we have now enough funds to start the contract
  function () payable {
    if (state == State.Proposed && this.balance > fee)
      state = State.Funded;
  }

  // should we ask/check for deposit here?
  function deliverCandidate() public returns(uint) {
    require(state == State.Funded || state == State.WithOffer);
    uint index = candidateLen;
    candidates[index] = msg.sender;
    candidateLen += 1;
    NewCandidate(msg.sender, index);
    if (state == State.Funded)
      state = State.WithOffer;
    return index;
  }

  function selectDeliverer(uint index) onlySender public {
    require(state == State.WithOffer);
    require(index < candidateLen);
    deliverer = candidates[index];
    // this could be specified separately by another call to use a different address, right now it is useless
    iotNode = deliverer;
    delete candidates;
    state = State.Agreed;
    DelivererSelected(deliverer);
  }

  function confirmCollection() public {
    require(state == State.Agreed);
    if (msg.sender == sender)
      senderConfirmed = true;
    else if (msg.sender == deliverer)
      delivererConfirmed = true;
    if (senderConfirmed && delivererConfirmed) {
      state = State.Shipping;
      ParcelShipped();
    }
  }

  function confirmReception() onlyRecipient shippingState public {
    if (now - creationTime <= expirationTime) {
      state = State.Delivered;
      ParcelDelivered();
    } else {
      state = State.Expired;
      ParcelExpired();
    }
  }

  function withdrawPayment() onlyDeliverer deliveredState public {
    if (msg.sender.send(fee)) {
      state = State.Paid;
      FeePaid();
    } else {
      uint deficit = fee - this.balance;
      InsufficientFunds(deficit);
    }
  }

  function notifyTempBreach(int temperature) onlyIotNode public {
    require(temperature > maxTemp);
    state = State.Exception;
    TemperatureException(temperature);
  }

  function garbageCollect() onlySender garbageCollectable public {
    selfdestruct(sender);
  }

}
