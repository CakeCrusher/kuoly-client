import React, { useEffect, useRef, useState } from "react";
import { useFieldEditing } from "../../../state/store";
import { ToggleEdit } from "../..";

type Props = {
  isEditing: boolean;
  handleSubmit: GenericEdit;
  value: string;
  fieldEditingProp: FieldEditing;
  validator?: (value: string) => boolean;
  placeholder?: string;
  className?: string;
};

const TextareaInput = ({
  isEditing,
  handleSubmit,
  value,
  fieldEditingProp,
  validator,
  placeholder,
  className,
}: Props) => {
  const textarea = useRef<HTMLTextAreaElement>();
  const [isValid, setIsValid] = useState(true);
  const [text, setText] = useState(value);
  const { setFieldEditing } = useFieldEditing();
  useEffect(() => {
    setText(value);
  }, [value]);

  const handleBlur = (evt: FocusEvent) => {
    if (!evt.currentTarget) {
      throw new Error("no current target");
    }
    const currentTarget = evt.currentTarget as HTMLTextAreaElement;
    const currentlyIsValid = !validator || validator(currentTarget.value);
    setIsValid(currentlyIsValid);
    const { value } = currentTarget;

    if (currentlyIsValid) {
      setFieldEditing(null);
      handleSubmit(value, fieldEditingProp.key);
    }
  };
  const handleFocus = () => {
    setFieldEditing(fieldEditingProp);
  };
  useEffect(() => {
    if (textarea.current) {
      textarea.current.addEventListener("focus", handleFocus);
      textarea.current.addEventListener("blur", handleBlur);
    }
  }, [textarea]);

  useEffect(() => {
    const tx = document.getElementById(
      fieldEditingProp.typename + fieldEditingProp.key
    );
    if (tx) {
      tx.setAttribute(
        "style",
        "height:" + tx.scrollHeight + "px;overflow-y:hidden;"
      );
      tx.addEventListener("input", OnInput, false);
      // @ts-ignore
      function OnInput() {
        if (tx) {
          tx.style.height = "auto";
          tx.style.height = tx.scrollHeight + "px";
        }
      }
    }
  }, [isEditing]);

  return (
    <ToggleEdit isEditing={isEditing}>
      <div className="toggle-input aligned-parent">
        <label className="aligned-label" htmlFor={fieldEditingProp.key}>
          {placeholder}
        </label>
        <textarea
          // @ts-ignore
          ref={textarea}
          id={fieldEditingProp.typename + fieldEditingProp.key}
          autoFocus={false}
          className={`toggle-input standard-text-input ${
            isValid ? "" : "invalid_input"
          } ${className || ""}`}
          onChange={(e) => setText(e.target.value)}
          name={fieldEditingProp.typename + fieldEditingProp.key}
          value={text}
          placeholder={placeholder || ""}
        />
      </div>
      <div
        className={`toggle-display standard-text-display ${
          (value && className) || ""
        }`}
      >
        {value}
      </div>
    </ToggleEdit>
  );
};

export default TextareaInput;
