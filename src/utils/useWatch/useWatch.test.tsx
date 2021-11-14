import { act, render } from '@testing-library/react';
import { FC } from 'react';
import useWatch, { Options } from './useWatch';

type UseWatchTestComponentType<T> = FC<{
  value: T;
  fn: (value: T, prev: T | null) => void;
  options?: Options<T>;
}>;

describe('useWatch', () => {
  const StringComponent: UseWatchTestComponentType<string> = ({
    value,
    fn,
    options,
  }) => {
    useWatch(value, fn, options);
    return null;
  };

  const StringArrayComponent: UseWatchTestComponentType<string[]> = ({
    value,
    fn,
    options,
  }) => {
    useWatch(value, fn, options);
    return null;
  };

  it('should revalidate when value change', () => {
    const mockFn = jest.fn();
    let rerender: (ui: React.ReactElement) => void;

    act(() => {
      rerender = render(<StringComponent value="1" fn={mockFn} />).rerender;
    });

    expect(mockFn).toBeCalledTimes(0);

    act(() => {
      rerender(<StringComponent value="1" fn={mockFn} />);
    });
    expect(mockFn).toBeCalledTimes(0);

    act(() => {
      rerender(<StringComponent value="2" fn={mockFn} />);
    });
    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toBeCalledWith('2', '1');
  });

  it('should revalidate on initialize when immediate option on', () => {
    const mockFn = jest.fn();
    let rerender: (ui: React.ReactElement) => void;

    act(() => {
      rerender = render(
        <StringComponent value="1" fn={mockFn} options={{ immediate: true }} />
      ).rerender;
    });

    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toBeCalledWith('1', null);

    act(() => {
      rerender(
        <StringComponent value="1" fn={mockFn} options={{ immediate: true }} />
      );
    });
    expect(mockFn).toBeCalledTimes(1);

    act(() => {
      rerender(
        <StringComponent value="2" fn={mockFn} options={{ immediate: true }} />
      );
    });
    expect(mockFn).toBeCalledTimes(2);
    expect(mockFn).toBeCalledWith('2', '1');
  });

  it('should revalidate when value change with isEqual function', () => {
    const mockFn = jest.fn();
    let rerender: (ui: React.ReactElement) => void;

    const isArrayEqual = (
      value: Array<string> | null,
      other: Array<string> | null
    ) => {
      if (value === other) {
        return true;
      }
      if (!value || !other) {
        return false;
      }
      return (
        value.length === other.length &&
        value.every((val: string, index: number) => val === other[index])
      );
    };

    act(() => {
      rerender = render(
        <StringArrayComponent
          value={['1']}
          fn={mockFn}
          options={{ isEqual: isArrayEqual }}
        />
      ).rerender;
    });

    expect(mockFn).toBeCalledTimes(0);

    act(() => {
      rerender(
        <StringArrayComponent
          value={['1']}
          fn={mockFn}
          options={{ isEqual: isArrayEqual }}
        />
      );
    });

    expect(mockFn).toBeCalledTimes(0);

    act(() => {
      rerender(
        <StringArrayComponent
          value={['1', '2']}
          fn={mockFn}
          options={{ isEqual: isArrayEqual }}
        />
      );
    });

    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toBeCalledWith(['1', '2'], ['1']);
  });
});
