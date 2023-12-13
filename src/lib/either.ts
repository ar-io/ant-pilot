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

/**
 * @typedef {Object} Either
 * @property {Boolean} isLeft
 * @property {Function} chain
 * @property {Function} ap
 * @property {Function} alt
 * @property {Function} extend
 * @property {Function} concat
 * @property {Function} traverse
 * @property {Function} map
 * @property {Function} toString
 * @property {Function} extract
 */
/**
 * @param {any} x
 * @returns {Either}
 */


/* eslint-disable @typescript-eslint/no-unused-vars */


export const Right = (x) => ({
  isLeft: false,
  chain: (f) => f(x),
  ap: (other) => other.map(x),
  alt: (other: any) => Right(x),
  extend: (f) => f(Right(x)),
  concat: (other) =>
    other.fold(
      (x) => other,
      (y) => Right(x.concat(y))
    ),
  traverse: (of, f) => f(x).map(Right),
  map: (f) => Right(f(x)),
  fold: (_, g) => g(x),
  toString: () => `Right(${x})`,
  extract: () => x,
});

/**
 * @param {any} x
 * @returns {Either}
 */
export const Left = (x) => ({
  isLeft: true,
  chain: (_) => Left(x),
  ap: (_) => Left(x),
  extend: (_) => Left(x),
  alt: (other) => other,
  concat: (_) => Left(x),
  traverse: (of, _) => of(Left(x)),
  map: (_) => Left(x),
  fold: (f, _) => f(x),
  toString: () => `Left(${x})`,
  extract: () => x,
});

/**
 * @param {any} x
 * @returns {Either}
 */
export const of = Right;

/**
 * @param {function} f
 * @returns {Either}
 */
export const tryCatch = (f) => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};

/**
 * @param {any} x
 * @returns {Either}
 */
export const fromNullable = (x) => (x != null ? Right(x) : Left(x));

export const Either = {
  Right,
  Left,
  of,
  tryCatch,
  fromNullable,
};

/* eslint-enable @typescript-eslint/no-unused-vars */

