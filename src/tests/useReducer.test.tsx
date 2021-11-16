import { act, render } from '@testing-library/react';
import { FC, Reducer, useReducer } from 'react';

describe('useReducer unstable 값 업데이트', () => {
  // 복합 값을 사용할 때에 reducer 사용 권장
  // https://ko.reactjs.org/docs/hooks-reference.html#usereducer
  type ReduceState = { a: number; b: number; sum: number };
  type ActionType = { type: string; value: number };
  type ActionCallback = (action: ActionType) => void;

  const reducer = (state: ReduceState, action: ActionType) => {
    switch (action.type) {
      case 'addA':
        return {
          ...state,
          a: state.a + action.value,
        };
      case 'addB':
        return {
          ...state,
          b: state.b + action.value,
        };
      case 'sum':
        return {
          ...state,
          sum: state.a + state.b + action.value,
        };
      default:
        throw new Error('정의되지 않은 함수');
    }
  };

  const Component: FC<{
    callback: (state: ReduceState, setState: ActionCallback) => void;
  }> = ({ callback }) => {
    const [state, setState] = useReducer<Reducer<ReduceState, ActionType>>(
      reducer,
      { a: 1, b: 1, sum: 0 }
    );

    callback(state, setState);
    return null;
  };

  it('sum을 호출해도 state가 변하지는 않음', () => {
    let first = true;
    const testCallback = (state: ReduceState, setState: ActionCallback) => {
      first && setState({ type: 'sum', value: 0 });
      expect(state.sum).toBe(first ? 0 : 2);
      first = false;
    };
    act(() => {
      render(<Component callback={testCallback} />);
    });
  });

  it('sum을 호출해도 state가 변하지는 않음', () => {
    let first = true;
    const mockFn = jest.fn();
    const testCallback = (state: ReduceState, setState: ActionCallback) => {
      first && setState({ type: 'addA', value: 2 });
      first && setState({ type: 'addA', value: 3 });
      first && setState({ type: 'addB', value: 3 });
      first && setState({ type: 'sum', value: 0 });
      expect(state.sum).toBe(first ? 0 : 10);
      mockFn();
      first = false;
    };
    act(() => {
      render(<Component callback={testCallback} />);
    });

    expect(mockFn).toBeCalledTimes(2);
  });
});
