import widgets from "@react-schema-form/bootstrap/lib/components/widgets";

import MarkdownRenderWidget from "./MarkdownRenderWidget";
import NonEditableTextWidget from "./NonEditableTextWidget";
import SelectWidget from "./SelectWidget";
import DependentSelectWidget from "./DependentSelectWidget";
import DependentTextEditorWidget from "./DependentTextEditorWidget";
import ScoreWidget from "./ScoreWidget";

widgets.MarkdownRenderWidget = MarkdownRenderWidget;
widgets.NonEditableTextWidget = NonEditableTextWidget;
widgets.SelectWidget = SelectWidget;
widgets.ScoreWidget = ScoreWidget;

// Utilizes Redux Store
widgets.DependentSelectWidget = DependentSelectWidget;
widgets.DependentTextEditorWidget = DependentTextEditorWidget;

export default widgets;
