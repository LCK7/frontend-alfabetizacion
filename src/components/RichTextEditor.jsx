import { useRef, useEffect } from "react";
import "./RichTextEditor.css";

export default function RichTextEditor({ value = "", onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const current = ref.current.innerHTML || "";
    if (value !== current) ref.current.innerHTML = value;
  }, [value]);

  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    notifyChange();
  };

  const notifyChange = () => {
    if (!ref.current) return;
    onChange && onChange(ref.current.innerHTML);
  };

  const insertLink = () => {
    const url = prompt("Ingrese la URL:", "https://");
    if (url) exec("createLink", url);
  };

  return (
    <div className="rte-container">
      <div className="rte-toolbar">
        <button type="button" onClick={() => exec("bold")} aria-label="Negrita">B</button>
        <button type="button" onClick={() => exec("italic")} aria-label="Cursiva">I</button>
        <button type="button" onClick={() => exec("underline")} aria-label="Subrayado">U</button>
        <button type="button" onClick={() => exec("insertUnorderedList")} aria-label="Lista">•</button>
        <button type="button" onClick={insertLink} aria-label="Enlace">🔗</button>
      </div>
      <div
        ref={ref}
        className="rte-editable"
        contentEditable
        onInput={notifyChange}
        onBlur={notifyChange}
        role="textbox"
        aria-multiline="true"
        suppressContentEditableWarning
      />
    </div>
  );
}
