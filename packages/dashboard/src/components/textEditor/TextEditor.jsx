import { useEffect, useState } from "react";

const TextEditor = ({ value, onChange }) => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [content, setContent] = useState(value || "");

  useEffect(() => {
    // جلوگیری از چندین بار لود `tinymce`
    if (window.tinymce) {
      setEditorLoaded(true);
      location.reload();

      return;
    }

    const script = document.createElement("script");
    script.src = "/tinymce/tinymce.min.js"; // مسیر لوکال
    script.onload = () => {
      setEditorLoaded(true);
    };

    document?.body?.appendChild(script);
    return () => {
      document?.body?.removeChild(script);
    };
  }, []);

  useEffect(() => {
    setContent(value);
  }, [setContent, value]);

  useEffect(() => {
    if (!editorLoaded) return;

    window?.tinymce?.init({
      selector: "#editor",
      height: 400,
      language: "fa",
      menubar: true,
      branding: false,
      plugins: [
        "advlist autolink lists link image charmap print anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table paste code help wordcount",
        "emoticons hr autosave",
      ],
      toolbar:
        "undo redo | image link emoticons hr | formatselect | bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat print restoredraft wordcount code",
      mobile: {
        theme: "mobile",
        plugins: "autosave lists link image charmap",
        toolbar: "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist",
      },
      setup: (editor) => {
        if (value) editor.setContent(value); // مقداردهی اولیه برای ویرایش مقاله

        editor.on("change", () => {
          const newContent = editor.getContent();
          setContent(newContent);
          onChange(newContent); // مقدار را به والد بفرست
        });
      },
    });

    return () => {
      window.tinymce.remove("#editor");
    };
  }, [editorLoaded, onChange]);

  return <textarea id="editor" defaultValue={content} />;
};

export default TextEditor;
