import React from "react";
import { Icon } from "@iconify/react";

export default function Controls({ setTool, undo, redo, handleSave }) {
  return (
    <div className="flex gap-1 text-white items-center justify-center">
      <button
        className="p-3 hover:text-[#083c30]"
        title="Pencil"
        onClick={() => {
          setTool("pencil");
        }}
      >
        <Icon icon="mdi:pencil-outline" width={30} />
      </button>
      <button
        className="p-3 hover:text-[#083c30]"
        title="Line"
        onClick={() => {
          setTool("line");
        }}
      >
        <Icon icon="tabler:line" width={30} />
      </button>
      <button
        className="p-3 hover:text-[#083c30]"
        title="Rectangle"
        onClick={() => {
          setTool("rectangle");
        }}
      >
        <Icon icon="cil:rectangle" width={30} />
      </button>
      <button
        className="p-3 hover:text-[#083c30]"
        title="Circle"
        onClick={() => {
          setTool("circle");
        }}
      >
        <Icon icon="radix-icons:circle" width={30} />
      </button>
      <button
        className="p-3 hover:text-[#083c30]"
        title="Undo"
        onClick={() => {
          undo();
        }}
      >
        <Icon icon="material-symbols:undo" width={35} />
      </button>
      <button
        className="p-3 hover:text-[#083c30]"
        title="Redo"
        onClick={() => {
          redo();
        }}
      >
        <Icon icon="material-symbols:redo" width={35} />
      </button>
      <button
        className="p-3 hover:text-[#083c30]"
        title="Save"
        onClick={() => {
          handleSave();
        }}
      >
        <Icon icon="ic:baseline-save-all" width={35} />
      </button>
    </div>
  );
}
