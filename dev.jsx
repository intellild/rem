import React from "react";
import ReactDOM from "react-dom";

import { useModel, Rem, useField, FieldSet } from "./src";

const InputField = ({ name }) => {
  const [value, onChange] = useField(name, "");
  return <input value={value} onChange={e => onChange(e.target.value)} />;
};

const App = () => {
  const [value, onChange] = useModel({});
  console.log(value)
  return (
    <Rem value={value} onChange={onChange}>
      <InputField name="input" />
      <FieldSet name="fieldset">
        <InputField name="field1" />
        <InputField name="field2" />
      </FieldSet>
    </Rem>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
