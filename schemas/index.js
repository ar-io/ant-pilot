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
module.exports = {
  evolveSchema: require('./evolve').evolveSchema,
  setControllerSchema: require('./setController').setControllerSchema,
  setTickerSchema: require('./setTicker').setTickerSchema,
  setNameSchema: require('./setName').setNameSchema,
  removeRecordSchema: require('./removeRecord').removeRecordSchema,
  setRecordSchema: require('./setRecord').setRecordSchema,
  removeControllerSchema: require('./removeController').removeControllerSchema,
  balanceSchema: require('./balance').balanceSchema,
  transferSchema: require('./transfer').transferSchema,
  mintSchema: require('./mint').mintSchema,
  setMintingPairSchema: require('./setMintingPair').setMintingPairSchema,
  buyRecordSchema: require('./buyRecord').buyRecordSchema,
  setReservedRecordsSchema: require('./setReservedRecords')
    .setReservedRecordsSchema,
  removeReservedRecordsSchema: require('./removeReservedRecords')
    .removeReservedRecordsSchema,
};
