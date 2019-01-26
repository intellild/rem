import * as React from "react";
import { useReducer, useCallback, createContext } from "react";

export type Updater<T> = (value: T) => T;

type IAction<T> = {
  type: "UPDATE";
  updater: Updater<T>;
};

function reducer<T>(state: T, { updater }: IAction<T>): T {
  return updater(state);
}

export function useModel<T extends {}>(defaultValue: T) {
  const [state, dispatch] = useReducer<T, IAction<T>>(reducer, defaultValue);
  const onChange = useCallback(
    (updater: (value: T) => T) => {
      dispatch({
        type: "UPDATE",
        updater
      });
    },
    [dispatch]
  );
  return [state, onChange];
}

type IContext<T> = {
  onChange(updater: Updater<T>): void;
  value: T;
};

const Context = createContext<IContext<unknown>>({
  onChange() {},
  value: {}
});

export type IRemProps<T> = {
  onChange(updater: Updater<T>): void;
  value: T;
};

export function Rem<T>({
  children,
  value,
  onChange
}: IRemProps<T> & { children?: React.ReactNode }) {
  return (
    <Context.Provider value={{ value, onChange }}>{children}</Context.Provider>
  );
}
