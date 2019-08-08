import React, { Component } from "react";
import http from "../../services/httpService";
import { Form, Button, Header, Modal } from "semantic-ui-react";
import ImageUpload from "../imageUploader/imageUpload";
import { apiUrl } from "../../utils/api-config";
import { toast } from "react-toastify";
class CreateCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        toast(`Invaild value for subdomain`);
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
    toast(<h3>{name} Creating...</h3>);
    http
      .post(apiUrl + "/companies", { name, subdomain, about_you, logo })
      .then(response => {
        toast(<h3>{response.data["name"]} Created Successfully</h3>);
        this.setState({ name: "", subdomain: "", about_you: "", logo: "" });
        this.props.reload(this.props.lastPage);
      })
      .catch(error => {
        console.log(error);
      });
  };
  updateCompany = () => {
    const { id, name, subdomain, about_you, logo } = this.state;
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


  render() {
    const { company } = this.props;
    return (
      <Modal
        dimmer="inverted"
        trigger={
          <Button
            basic
            color="blue"
            icon="pencil"
            content={company ? "Edit" : "Create Company"}
          />
        }
        basic
        size="tiny"
        header={
          <Header
            icon="building"
            content={company ? `Edit ${company.name}` : "Create New Company"}
          />
        }
        content={
          <div className="padding-2vw">
            <Form>
              <Form.Input
                fluid
                label="Company name"
                placeholder="Enter company name"
                name="name"
                onChange={this.onChange}
                value={this.state.name}
                required
              />
              <Form.Input
                fluid
                label="Domain name"
                placeholder="Enter domain name"
                name="subdomain"
                onChange={this.onChange}
                value={this.state.subdomain}
                required
              />
              <Form.TextArea
                label="About"
                placeholder="Tell us more about you..."
                name="about_you"
                onChange={this.onChange}
                value={this.state.about_you}
              />
              <ImageUpload imageURL={this.uploadImage} logo={this.state.logo} />
            </Form>
          </div>
        }
        actions={[
          "Cancel",
          {
            key: "ok",
            color: "blue",
            content: company ? "Update Company" : "Register Company",
            positive: true,
            onClick: company ? this.updateCompany : this.createCompany
          }
        ]}
      />
    );
  }
}
export default CreateCompany;
