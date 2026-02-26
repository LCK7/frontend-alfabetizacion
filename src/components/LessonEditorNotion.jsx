import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import "./LessonEditorNotion.css";

export default function LessonEditorNotion({ value, onChange }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value || "",
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            console.log('Contenido actualizado en editor:', html);
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: "notion-editor",
            },
        },
    });

    // Sincronizar editor cuando cambia el value (edición)
    useEffect(() => {
        if (editor && value && editor.getHTML() !== value) {
            editor.commands.setContent(value);
            console.log('Editor sincronizado con:', value);
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className="notion-editor-container">
            <div className="notion-toolbar">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    B
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    I
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    • List
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                >
                    H1
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    H2
                </button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
