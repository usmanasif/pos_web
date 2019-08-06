import React, { Component } from "react";
import {
  Table,
  Menu,
  Icon,
  Button,
  Popup,
  Modal,
  Header,
  Input,
  Segment
} from "semantic-ui-react";
import http from "../../services/httpService";
import { apiUrl } from "../../utils/api-config";
import _ from "lodash";
import { toast } from "react-toastify";
import CreateCompany from "./createCompany";
import SignOut from "../authentication/signOut";
class CompanyHome extends Component {
  state = {
    companies: [],
    current_page: 1,
    total_pages: 2,
    confirmSub: "",
    page_loading: false
  };

  componentDidMount() {
    http.get(`${apiUrl}/companies`).then(res => {
      this.setState({
        companies: res.data.companies,
        current_page: res.data.current_page,
        total_pages: res.data.total_pages
      });
    });
  }
  handlePagination = i => {
    this.setState({ page_loading: true });
    i = i === 0 ? this.state.total_pages : i;
    i = i > this.state.total_pages ? 1 : i;
    http
      .get(`${apiUrl}/companies`, {
        params: {
          page: i
        }
      })
      .then(res => {
        this.setState({
          companies: res.data.companies,
          current_page: res.data.current_page,
          total_pages: res.data.total_pages,
          page_loading: false
        });
      });
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  confirmDelete = company => {
    if (this.state.confirmSub === company.subdomain) {
      const companies = [...this.state.companies];
      const index = _.findIndex(companies, company);
      companies[index].deleting = true;
      this.setState({ companies });
      this.handleDelete(company);
    }
    this.setState({ confirmSub: "" });
  };

  handleDelete = company => {
    http
      .delete(`${apiUrl}/companies/${company.id}`)
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          toast(`${company.name} Deleted Successfully.`);
          this.handlePagination(this.state.current_page);
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    const { companies, current_page, total_pages, page_loading } = this.state;
    const menu_items = [];
    for (let i = 1; i <= total_pages; i++) {
      menu_items.push(i);
    }
    return (
      <React.Fragment>
        <div className="m-10">
          <Menu pointing>
            <Menu.Item
              name="Companies"
              content="All Compaines"
              color="blue"
              active={true}
            />
            <Menu.Menu position="right">
              <div className="m-5">
                <CreateCompany
                  reload={this.handlePagination}
                  lastPage={this.state.total_pages}
                />
              </div>
            </Menu.Menu>

            <Menu.Menu position="right">
              <div className="m-5">
                <SignOut />
              </div>
            </Menu.Menu>
          </Menu>

          <Segment textAlign="right" color="blue">
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>id</Table.HeaderCell>
                  <Table.HeaderCell>name</Table.HeaderCell>
                  <Table.HeaderCell>subdomain</Table.HeaderCell>
                  <Table.HeaderCell>logo</Table.HeaderCell>
                  <Table.HeaderCell />
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {page_loading ? (
                  <Table.Row>
                    <Table.Cell colSpan="6">
                      <img
                        className="table_loading_img"
                        src="./images/cart.gif"
                        alt="Loading...."
                      />
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  companies.map(company => (
                    <Table.Row
                      key={company.id}
                      className={company.deleting && "bg-delete"}
                    >
                      <Table.Cell
                        className={company.deleting && "border-delete"}
                      >
                        {company.id}
                      </Table.Cell>
                      <Table.Cell>{company.name}</Table.Cell>
                      <Table.Cell>{company.subdomain}</Table.Cell>
                      <Table.Cell textAlign="center">
                        <img
                          className="company_logo"
                          src={company.logo}
                          alt="Company Logo..."
                        />
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {!company.deleting ? (
                          <Popup
                            content={`Edit ${company.name}`}
                            trigger={
                              <CreateCompany
                                company={company}
                                reload={this.handlePagination}
                                current_page={this.state.current_page}
                              />
                            }
                          />
                        ) : (
                          <b>Deleting...</b>
                        )}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {company.deleting ? (
                          <b>Deleting...</b>
                        ) : (
                          <Modal
                            dimmer="inverted"
                            trigger={
                              <Button
                                basic
                                color="red"
                                icon="trash alternate outline"
                              />
                            }
                            basic
                            size="tiny"
                            header={
                              <Header
                                icon="trash alternate outline"
                                content="Are you Sure"
                              />
                            }
                            content={
                              <div className="padding-2vw">
                                <h3>{`Enter Subdomain to Delete Company ${
                                  company.name
                                }`}</h3>
                                <Input
                                  label="Subdomain:"
                                  name="confirmSub"
                                  onChange={this.handleChange}
                                  value={this.state.confirmSub}
                                  fluid
                                />
                              </div>
                            }
                            actions={[
                              { key: "ok", content: "Ok", positive: true }
                            ]}
                            onClose={() => this.confirmDelete(company)}
                          />
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>

              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="6">
                    <Menu floated="right" pagination>
                      <Menu.Item
                        as="a"
                        onClick={() => this.handlePagination(current_page - 1)}
                        icon
                      >
                        <Icon name="chevron left" />
                      </Menu.Item>
                      {menu_items.map(i => (
                        <Menu.Item
                          className={i === current_page ? "active_page" : ""}
                          key={i}
                          as="a"
                          onClick={() => this.handlePagination(i)}
                        >
                          {i}
                        </Menu.Item>
                      ))}
                      <Menu.Item
                        as="a"
                        onClick={() => this.handlePagination(current_page + 1)}
                        icon
                      >
                        <Icon name="chevron right" />
                      </Menu.Item>
                    </Menu>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Segment>
        </div>
      </React.Fragment>
    );
  }
}

export default CompanyHome;
