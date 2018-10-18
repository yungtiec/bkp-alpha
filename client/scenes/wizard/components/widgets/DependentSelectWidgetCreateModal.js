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
      formData: this.props.formDataPath
    });
  }

  handleChange(formData) {
    this.setState({
      formData
    });
  }

  handleSubmit({ formData }) {
    this.props.updateFormDataInStore(formData);
    this.props.hideModal();
  }

  render() {
    const { hideModal, schema, uiSchema, formData, formDataPath } = this.props;

    return (
      <Fragment>
        <h5>List Disclosures Evalueated</h5>
        <Modal
          isOpen={true}
          onRequestClose={hideModal}
          contentLabel="DependentSelectWidgetCreatableModal"
        >
          <JsonSchemaForm
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            formDataPath={formDataPath}
            onChange={this.handleChange}
            submit={{ label: "submit", handler: this.handleSubmit }}
            cancel={{ label: "cancel", handler: hideModal }}
          />
        </Modal>
      </Fragment>
    );
  }
}

const mapState = (state, ownProps) => ({ ...ownProps });

const actions = { hideModal };

export default connect(
  mapState,
  actions
)(DependentSelectWidgetCreatableModal);
