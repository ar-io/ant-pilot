import { AddPair, CancelOrder, CreateOrder, Halt } from "@verto/flex";
import {
  StateInterface,
  ActionInterface,
  BalanceInterface,
  ForeignCallInterface,
} from "./faces";

export async function handle(
  state: StateInterface,
  action: ActionInterface
): Promise<{ state: StateInterface } | { result: BalanceInterface }> {
  const balances = state.balances;
  const claimable = state.claimable;
  const claims = state.claims;
  const input = action.input;
  const caller = action.caller;

  if (input.function === "transfer") {
    const target = input.target;
    const quantity = input.qty;

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
        "Caller balance not high enough to send " + quantity + " token(s)."
      );
    }

    balances[caller] -= quantity;
    if (target in balances) {
      balances[target] += quantity;
    } else {
      balances[target] = quantity;
    }

    return { state };
  }

  if (input.function === "balance") {
    let target;
    if (!input.target) {
      target = caller;
    } else {
      target = input.target;
    }
    const ticker = state.ticker;

    if (typeof target !== "string") {
      throw new ContractError("Must specify target to get balance for.");
    }
    if (typeof balances[target] !== "number") {
      throw new ContractError("Cannot get balance; target does not exist.");
    }

    return {
      result: {
        target,
        ticker,
        balance: balances[target],
      },
    };
  }

  if (input.function === "allow") {
    const target = input.target;
    const quantity = input.qty;

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

    return { state };
  }

  if (input.function === "claim") {
    // Claim input: txID
    const txID = input.txID;
    // Claim qty
    const qty = input.qty;

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

    return { state };
  }

  if (input.function === "addPair") {
    const _ = await AddPair(state, action)
    return { state: _.state };
  }

  if (input.function === "cancelOrder") {
    const _ = await CancelOrder(state, action)
    return { state: _.state };
  }

  if (input.function === "createOrder") {
    const _ = await CreateOrder(state, action);
    return { state: _.state }
  }

  if (input.function === "halt") {
    const _ = await Halt(state, action);
    return { state: _.state };
  }
}