

declare const ContractError;
declare const SmartWeave;


export const claim = async (state, action) => {
    const caller = action.caller;
    const balances = state.balances;
    const claimable = state.claimable;
    const claims = state.claims;
 // Claim input: txID
    const txID = action.input.txID;
 // Claim qty
    const qty = action.input.qty;

 if (!claimable.length) {
   throw new ContractError("Contract has no claims available");
 }
 // Search for txID inside of `claimable`
 let obj, index;
 for (let i = 0; i < claimable.length; i++) {
   if (claimable[i].txID === txID) {
     index = i;
     obj = claimable[i];
   }
 }
 if (obj === undefined) {
   throw new ContractError("Unable to find claim");
 }
 if (obj.to !== caller) {
   throw new ContractError("Claim not addressed to caller");
 }
 if (obj.qty !== qty) {
   throw new ContractError("Claiming incorrect quantity of tokens");
 }
 // Check to make sure it hasn't been claimed already
 for (let i = 0; i < claims.length; i++) {
   if (claims[i] === txID) {
     throw new ContractError("This claim has already been made");
   }
 }
 // Not already claimed --> can claim
 balances[caller] += obj.qty;

 // remove from claimable
 claimable.splice(index, 1);

 // add txID to `claims`
 claims.push(txID);

 state.balances = balances;
    state.claimable = claimable;
    state.claims = claims;


 return { state };


}