import { act, render } from '@testing-library/react';
import assert from 'assert';
import { FC, useState } from 'react';

describe('useState 1 + 1 = 1 Test', () => {
  const Component = () => {
    const [count, setCount] = useState(1);
    setCount(count + 1);
    assert(count === 1, '1 + 1은 1');
    return null;
  };

  it('has error', () => {
    expect(() => render(<Component />)).toThrow('1 + 1은 1');
  });
});

describe('setState 여러번 호출 시에도 1번만 rendering', () => {
  type CountState = [number, (value: number) => void];
  type Props = {
    callback: (countState1: CountState, countState2: CountState) => void;
  };
  const Component: FC<Props> = ({ callback }) => {
    const countState1 = useState<number>(0);
    const countState2 = useState<number>(0);
    callback(countState1, countState2);
    return null;
  };

  let first = true;
  const mockFn = jest.fn();
  const fn = (countState1: CountState, countState2: CountState) => {
    first && countState1[1](1);
    first && countState1[1](2);
    first && countState2[1](1);
    first && countState2[1](2);

    expect(countState1[0]).toBe(first ? 0 : 2);
    expect(countState2[0]).toBe(first ? 0 : 2);
    first = false;
    mockFn();
  };

  act(() => {
    render(<Component callback={fn} />);
  });

  expect(mockFn).toBeCalledTimes(2);
});
