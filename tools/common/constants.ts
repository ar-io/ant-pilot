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
import initialContractState from './initial-state.json';

export enum REGISTRATION_TYPES {
  LEASE = 'lease',
  BUY = 'permabuy',
}
export const MINIMUM_ALLOWED_EVOLUTION_DELAY = 4; // 4 blocks for testing purposes, but should be 720 * 7; // 720 blocks per day times 7 days
export const FOUNDATION_ACTION_PERIOD = 1;
export const FOUNDATION_STARTING_BALANCE = 10_000;
export const TRANSFER_AMOUNT = 5_000_000;
export const INTERACTION_COST = 20000;
export const ANT_CONTRACT_IDS = [
  'MSFTfeBVyaJ8s9n7GxIyJNNc62jEVCKD7lbL3fV8kzU',
  'xSFTfoBVyaJ8s9n7GxIyJNNc62jEVCKD7lbL3fV8kzU',
  'ySFTfrBVyaJ8s9n7GxIyJNNc62jEVCcD7lbL3fV8kzU',
];
export const SECONDS_IN_A_YEAR = 31_536_000;
export const WALLET_FUND_AMOUNT = 1_000_000_000_000_000;
export const INITIAL_STATE = initialContractState;
export const TRANSFER_QTY = 100_000;
export const CONTRACT_SETTINGS = {
  minLockLength: 5,
  maxLockLength: 720 * 365 * 3,
  minNetworkJoinStakeAmount: 5_000,
  minGatewayJoinLength: 2,
  gatewayLeaveLength: 2,
  operatorStakeWithdrawLength: 5,
};
