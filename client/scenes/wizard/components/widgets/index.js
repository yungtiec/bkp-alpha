import widgets from "@react-schema-form/bootstrap/lib/components/widgets";

import DependentSelectWidget from "./DependentSelectWidget";
import MarkdownRenderWidget from "./MarkdownRenderWidget";
import NonEditableTextWidget from "./NonEditableTextWidget";
import SelectWidget from "./SelectWidget";
import DependentTextEditorWidget from "./DependentTextEditorWidget";

widgets.DependentSelectWidget = DependentSelectWidget;
widgets.MarkdownRenderWidget = MarkdownRenderWidget;
widgets.NonEditableTextWidget = NonEditableTextWidget;
widgets.SelectWidget = SelectWidget;
//widgets.DependentTextEditor = TextEditorWidget;
widgets.TextEditorWidget = DependentTextEditorWidget;

export default widgets;
