import React, { Component, Fragment } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import Modal from "react-modal";
import JsonSchemaForm from "../JsonSchemaForm";
import { hideModal } from "../../../../data/reducer";

class DependentSelectWidgetCreatableModal extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.setState({
      formData: this.props.formData
    });
  }

  handleChange(formData) {
    this.setState({
      formData
    });
  }

  handleSubmit() {
    // this.props.updateFormDataInStore(this.state.formData);
    this.props.hideModal();
  }

  render() {
    const {
      hideModal,
      schema,
      uiSchema,
      formData,
      formDataPath,
      version
    } = this.props;

    return (
      <Modal
        isOpen={true}
        onRequestClose={hideModal}
        contentLabel="DependentSelectWidgetCreatableModal"
      >
        <h5>List Disclosures Evalueated</h5>
        <JsonSchemaForm
          schema={schema}
          uiSchema={uiSchema}
          formData={formData}
          formDataPath={formDataPath}
          version={version}
          submit={{ label: "submit", handler: this.handleSubmit }}
          cancel={{ label: "cancel", handler: hideModal }}
        />
      </Modal>
    );
  }
}

const mapState = (state, ownProps) => ({ ...ownProps });

const actions = { hideModal };

export default connect(
  mapState,
  actions
)(DependentSelectWidgetCreatableModal);
