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
const removeRecordSchema = {
  $id: '#/definitions/removeRecord',
  type: 'object',
  properties: {
    function: {
      type: 'string',
      const: 'removeRecord',
    },
    subDomain: {
      type: 'string',
      pattern: '^([a-zA-Z0-9][a-zA-Z0-9-_]{0,59}[a-zA-Z0-9]|[a-zA-Z0-9]{1})$',
    },
  },
  required: ['subDomain'],
  additionalProperties: false,
};

module.exports = {
  removeRecordSchema,
};
