import React, { Component } from "react";
import http from "../../services/httpService";
import { Form, Button, Header, Modal, Popup } from "semantic-ui-react";
import ImageUpload from "../imageUploader/imageUpload";
import { apiUrl } from "../../utils/api-config";
import { toast } from "react-toastify";
class CreateCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      name: "",
      subdomain: "",
      about_you: "",
      logo: ""
    };
  }
  componentDidMount() {
    if (this.props.company) {
      const { id, name, subdomain, about_you, logo } = this.props.company;
      this.setState({ id, name, subdomain, about_you, logo });
    }
  }
  onChange = e => {
    const { name, value } = e.target;
    if (name === "subdomain") {
      if (["www", "Admin"].includes(value)) {
        toast(`${value} cannot be use as subdomain`);
        this.setState({ subdomain: "" });
      } else if (!/^(\d|\w)+$/.test(value)) {
        this.setState({ subdomain: "" });
      }
    }
    this.setState({
      [name]: value
    });
  };

  uploadImage = url => {
    this.setState({ logo: url });
  };

  createCompany = () => {
    const { name, subdomain, about_you, logo } = this.state;
    toast(<h3>{name} Creating...</h3>, { autoClose: 2000 });
    this.handleClose();
    http
      .post(apiUrl + "/companies", { name, subdomain, about_you, logo })
      .then(response => {
        toast(<h3>{response.data["name"]} Created Successfully</h3>);
        this.setState({ name: "", subdomain: "", about_you: "", logo: "" });
        this.props.reload(this.props.lastPage);
      });
  };
  updateCompany = () => {
    const { id, name, subdomain, about_you, logo } = this.state;
    this.handleClose();
    http
      .put(apiUrl + `/companies/${id}`, { name, subdomain, about_you, logo })
      .then(response => {
        toast(<h3>{response.data["name"]} Updated Successfully</h3>);
        this.props.reload(this.props.current_page);
      })
      .catch(error => {
        console.log(error);
      });
  };
  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  render() {
    const { company } = this.props;
    return (
      <Modal
        trigger={
          <Button
            basic
            color="blue"
            icon="pencil"
            content={company ? "Edit" : "Create Company"}
            onClick={this.handleOpen}
          />
        }
        open={this.state.open}
        onClose={this.handleClose}
        dimmer="inverted"
        size="small"
      >
        <Header
          icon="building"
          content={company ? `Edit ${company.name}` : "Create New Company"}
        />
        <Modal.Content>
          <div className="padding-bottom-2vw">
            <Form onSubmit={company ? this.updateCompany : this.createCompany}>
              <Form.Input
                fluid
                label="Company name"
                placeholder="Enter company name"
                name="name"
                onChange={this.onChange}
                value={this.state.name}
                required
              />
              <Popup
                content="a Subdomain cannot contain any space or spical characters: \ / . : * ?"
                trigger={
                  <Form.Input
                    fluid
                    label="Domain name"
                    placeholder="Enter domain name"
                    name="subdomain"
                    onChange={this.onChange}
                    value={this.state.subdomain}
                    required
                  />
                }
              />
              <Form.TextArea
                label="About"
                placeholder="Tell us more about you..."
                name="about_you"
                onChange={this.onChange}
                value={this.state.about_you}
              />
              <ImageUpload imageURL={this.uploadImage} logo={this.state.logo} />
              <Button color="green" floated="right">
                {company ? "Update Company" : "Register Company"}
              </Button>
            </Form>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}
export default CreateCompany;
