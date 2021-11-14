import { useEffect, useRef } from 'react';

export interface Options<T> {
  immediate?: boolean;
  isEqual?: (value: T | null, other: T | null) => boolean;
}

export default function useWatch<T>(
  value: T,
  fn: (value: T, prev: T | null) => void,
  options: Options<T> = {}
) {
  options = Object.assign(
    {
      isEqual: (value: T | null, other: T | null) => value === other,
    },
    options
  );
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (options.isEqual!(ref.current, value)) {
      return;
    }
    if (options?.immediate || ref.current) {
      fn(value, ref.current);
    }

    ref.current = value;
  }, [value, fn]);
}
