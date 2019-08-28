import React, { Component } from 'react'
import { Card, Icon, Image, Grid, GridColumn, Container, Header } from 'semantic-ui-react'
import { Link } from "react-router-dom";

class Home extends Component {
    render() {
        return (
            <React.Fragment>
                <Container className="page-header">
                    <Header as='h2' className="second-header" floated='right'>
                        Devsinc
                    </Header>
                    <Header as='h2' floated='left'>
                        <Image className="logo" src={require('../../images/logo.png')} />
                        <span className="header-text">Dashboard</span>
                    </Header>
                </Container>
                <div className="ui divider"></div>                
                <Grid columns={5}>
                    <Grid.Row>
                        <Grid.Column>
                            <Link to='/reciept'>
                                <Card>
                                    <Image src={require('../../images/invoice.jpg')} wrapped ui={false} />
                                    <Card.Content>
                                        <Card.Header className="card-heading">New Invoice</Card.Header>
                                    </Card.Content>
                                </Card>
                            </Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Link to='/inventory'>
                                <Card>
                                    <Image src={require('../../images/inventory.jpg')} wrapped ui={false} />
                                    <Card.Content>
                                        <Card.Header className="card-heading">Item Inventory</Card.Header>
                                    </Card.Content>
                                </Card>
                            </Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Link to='/reports'>
                                <Card>
                                    <Image src={require('../../images/reports.jpeg')} wrapped ui={false} />
                                    <Card.Content>
                                        <Card.Header className="card-heading">Sale Reports</Card.Header>
                                    </Card.Content>
                                </Card>
                            </Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Link to="/stock_report">
                                <Card>
                                    <Image src={require('../../images/stock_report.jpg')} wrapped ui={false} />
                                    <Card.Content>
                                        <Card.Header className="card-heading">Stock Report</Card.Header>
                                    </Card.Content>
                                </Card>
                            </Link>
                    </Grid.Column>
                    <Grid.Column>   
                        <Card>
                            <Image src={require('../../images/returns.jpg')} wrapped ui={false} />
                            <Card.Content>
                                <Card.Header className="card-heading">Returns</Card.Header>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
            </React.Fragment>
        )
    }
}

export default Home;
