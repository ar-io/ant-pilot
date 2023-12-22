/**
 * Copyright (C) 2022-2024 Permanent Data Solutions, Inc. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export const MIN_TTL_LENGTH = 900; // 15 minutes
export const MAX_TTL_LENGTH = 2_592_000; // 30 days
export const MAX_NAME_LENGTH = 61;
export const TX_ID_LENGTH = 43;
export const ARWEAVE_ID_REGEX = new RegExp('^[a-zA-Z0-9_-]{43}$');
export const UNDERNAME_REGEX = new RegExp('^[a-zA-Z0-9_-]+$');
export const INVALID_INPUT_MESSAGE = 'Invalid input for interaction';
export const NON_CONTRACT_OWNER_MESSAGE = `Caller is not the owner of the ANT!`;
export const NON_CONTRACT_OWNER_CONTROLLER_MESSAGE = `Caller is not the owner or controller of the ANT!`;
export const SECONDS_IN_A_YEAR = 31_536_000;
export enum PAYMENT_TYPES {
  ARWEAVE = 'ARWEAVE',
  TOKEN = 'TOKEN',
}

export enum PURCHASE_TYPES {
  LEASE = 'LEASE',
  BUY = 'BUY',
}
