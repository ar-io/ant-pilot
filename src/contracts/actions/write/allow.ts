
declare const ContractError;
declare const SmartWeave;


export const allow = async (state, action) => {
    const target = action.input.target;
    const quantity = action.input.qty;
    const caller = action.caller;
    const balances = state.balances;
    const claimable = state.claimable;

if (!Number.isInteger(quantity) || quantity === undefined) {
      throw new ContractError(
        "Invalid value for quantity. Must be an integer."
      );
    }
    if (!target) {
      throw new ContractError("No target specified.");
    }
    if (quantity <= 0 || caller === target) {
      throw new ContractError("Invalid token transfer.");
    }
    if (balances[caller] < quantity) {
      throw new ContractError(
        "Caller balance not high enough to make claimable " +
        quantity +
        " token(s)."
      );
    }

    balances[caller] -= quantity;
    if (balances[caller] === null || balances[caller] === undefined) {
      balances[caller] = 0;
    }
    claimable.push({
      from: caller,
      to: target,
      qty: quantity,
      txID: SmartWeave.transaction.id,
    });

    state.balances = balances;
    state.claimable = claimable;

    return { state };
}