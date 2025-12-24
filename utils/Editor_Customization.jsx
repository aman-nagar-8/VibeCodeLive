import Editor from "@monaco-editor/react";

function beforeMount(monaco) {
  monaco.editor.defineTheme("custom-bg", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#262626" // 👈 your color
    }
  });
}
export {beforeMount}
