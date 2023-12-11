import { INVALID_INPUT_MESSAGE } from '../../constants';
import { ANTState } from '../../types';
import { evolve } from './evolve';

const baselineAntState: ANTState = {
  owner: 'test',
  evolve: 'test',
  controllers: ['test'],
  balances: {
    test: 1,
  },
  name: 'test',
  records: {},
  ticker: 'ANT-TEST',
};

describe('evolve', () => {
  it.each([
    {
      value: 'test',
    },
    {
      value: 1,
    },
    {
      value: true,
    },
    {
      value: undefined,
    },
    {
      random: 'test',
    },
  ])('should throw an error on bad input', async (badInput: { value: any }) => {
    const error: any = await evolve(baselineAntState, {
      caller: 'test',
      input: {
        function: 'evolve',
        ...badInput,
      },
    }).catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toEqual(
      expect.stringContaining(INVALID_INPUT_MESSAGE),
    );
  });
});
