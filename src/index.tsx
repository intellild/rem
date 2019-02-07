import * as React from "react";
import {
  useReducer,
  useCallback,
  createContext,
  useContext,
  useEffect
} from "react";

export type Updater<T> = (value: T) => T;

type IAction<T> = {
  type: "UPDATE";
  updater: Updater<T>;
};

type Dic = {
  [key: string]: unknown;
};

function reducer<T>(state: T, { updater }: IAction<T>): T {
  return updater(state);
}

export function useModel<T extends {}>(defaultValue: T) {
  const [state, dispatch] = useReducer<(state: T, action: IAction<T>) => T>(
    reducer,
    defaultValue
  );
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

const Context = createContext<IContext<Dic>>({
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

export function useField<T>(name: string, defaultValue: T) {
  const { value: ctxValue, onChange: ctxOnChange } = useContext(Context);
  const value = ctxValue[name] || defaultValue;
  useEffect(() => {
    if (Object.prototype.hasOwnProperty.call(ctxValue, name)) {
      return;
    }
    ctxOnChange(v => ({
      ...v,
      [name]: defaultValue
    }));
  }, [ctxValue, ctxOnChange, defaultValue, name]);
  const onChange = useCallback(
    v => {
      ctxOnChange(p => ({
        ...p,
        [name]: v
      }));
    },
    [ctxOnChange, name]
  );
  return [value, onChange];
}

export type IFieldSetProps<T extends {} = Dic> = {
  name: string;
  defaultValue?: T;
  children?: React.ReactNode;
};

function isPlainObject(value: unknown): boolean {
  if (value === null) {
    return false;
  }
  if (typeof value !== "object") {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}

export function FieldSet<T extends {}>({
  name,
  defaultValue = {} as any,
  children
}: IFieldSetProps<T>) {
  const { value: ctxValue, onChange: ctxOnChange } = useContext(Context);
  const value = (ctxValue[name] || defaultValue) as Dic;
  useEffect(() => {
    const fieldset = value;
    if (isPlainObject(fieldset)) {
      return;
    }
    ctxOnChange(v => ({
      ...v,
      [name]: defaultValue
    }));
  }, [value, ctxOnChange, defaultValue]);
  const onChange = useCallback(
    (u: Updater<Dic>) => {
      ctxOnChange(p => ({
        ...p,
        [name]: u(p[name] as any)
      }));
    },
    [ctxOnChange, name]
  );
  if (!isPlainObject(value)) {
    return null;
  }
  return (
    <Context.Provider
      value={{
        value,
        onChange
      }}
    >
      {children}
    </Context.Provider>
  );
}
