export const MIN_TTL_LENGTH = 900; // 15 minutes
export const MAX_TTL_LENGTH = 2_592_000;  // 30 days
export const MAX_NAME_LENGTH = 20;
export const TX_ID_LENGTH = 43;
export const ARWEAVE_ID_REGEX = new RegExp("^[a-zA-Z0-9_-]{43}$");
export const UNDERNAME_REGEX = new RegExp("^[a-zA-Z0-9_-]+$");
export const INVALID_INPUT_MESSAGE = 'Invalid input for interaction';
export const NON_CONTRACT_OWNER_MESSAGE = `Caller is not the owner of the ANT!`;