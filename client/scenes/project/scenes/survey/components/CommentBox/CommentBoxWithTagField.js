import React, { Component } from "react";
import autoBind from "react-autobind";
import CommentBox from "./index";
import Select from "react-select";
import { TagChip } from "../../../../../../components";

export default class CommentBoxWithTagField extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      tags: this.props.tags,
      selectedTags: this.props.selectedTags
    };
  }

  handleTagOnChange(selected) {
    selected = selected[0].name
      ? selected[0]
      : { ...selected[0], name: selected[0].value };
    if (
      this.state.selectedTags.map(tag => tag.name).indexOf(selected.value) ===
      -1
    ) {
      this.setState(prevState => ({
        selectedTags: [...prevState.selectedTags, selected]
      }));
    }
  }

  handleTagCloseIconOnClick(index) {
    this.setState({
      selectedTags: this.state.selectedTags.filter((tag, i) => i !== index)
    });
  }

  handleSubmitEditedCommentAndTag(argObj) {
    const { onSubmit } = this.props;
    const newArgObj = { ...argObj, tags: this.state.selectedTags };
    onSubmit(newArgObj);
  }

  render() {
    const { onSubmit, tags, ...otherProps } = this.props;
    return (
      <div>
        <Select.Creatable
          multi={true}
          placeholder="add tag(s)"
          options={this.state.tags.map(tag => ({
            ...tag,
            value: tag.name,
            label: tag.name
          }))}
          onChange={this.handleTagOnChange}
          value={[]}
        />
        <div className="annotation-item__tags mt-2  mb-4">
          {this.state.selectedTags && this.state.selectedTags.length
            ? this.state.selectedTags.map((tag, index) => (
                <TagChip
                  containerClassname="annotation-item__tag"
                  containerKey={`annotation-tag__${tag.name}`}
                  tagValue={tag.name}
                  closeIconOnClick={() => this.handleTagCloseIconOnClick(index)}
                />
              ))
            : ""}
        </div>
        <CommentBox
          {...otherProps}
          onSubmit={this.handleSubmitEditedCommentAndTag}
        />
      </div>
    );
  }
}
