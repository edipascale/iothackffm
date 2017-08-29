Smart contract for the PePaDe project at the Frankfurt Summer School on Blockchain and IoT.

The contract represents a decentralized agreement between a sender and a deliverer of a parcel.
In the current iteration, the sender specifies the intended recipient, the constraints on the shipment that he has (e.g. the maximum time the delivery can take since the contract creation or the maximum temperature the parcel should be exposed to), and the price he is willing to pay for this. He must also provide the funds to pay the fee, which are going to be stored in the contract. 
Deliverers can see the pending shipment requests and candidate themselves to carry them out. We intend to integrate uPort identities to enable reputation tracking, although at the moment this has not been implemented yet.
The sender selects a candidate deliverer; the contract is now agreed upon.
When the deliverer reaches the sender's place to collect the parcel, both the sender and the deliverer need to confirm that the package has changed hands. The state of the contract then moves to Shipping.
During the shipping phase, the iot sensor of the deliverer monitors the status of the parcel. If the temperature goes above the maximum threshold specified at the contract creation, the contract is notified of the Exception.
If no exception takes place, when the parcel reaches its destination the intended recipient (and only him) can confirm the correct delivery of the package. If the package was delivered within the established time constraints, the payment phase is unlocked and the deliverer is allowed to withdraw the fee from the contract funds.
