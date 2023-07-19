import YbTheme from "./themes/YbTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";

export default function EditorRead({content}) {

  const editorConfig = {
    editorState: content,
    readOnly: true,
    editable: false,
    theme: YbTheme,
    onError(error) {
      throw error;
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode
    ]
  };

  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container-read">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input-read" />}
              ErrorBoundary={LexicalErrorBoundary}
            />
        </div>
      </LexicalComposer>
    </>
  );
}
