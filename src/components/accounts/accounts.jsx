import React,{Component} from "react";
import { Container, Header, Image, Table, Grid, Card, Button, Label, Message} from "semantic-ui-react";
import { apiUrl } from "../../utils/api-config";
import http from "../../services/httpService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };
  
class Accounts extends Component{
    constructor(props) {
        super(props);
        this.state = {
            Data:[
            ],
            startDate:Date(),
            endDate:Date(),
            amount:0,
            debit:0,
            credit:0
        }
    }
    setAmount = () =>{
        const {Data} = this.state;
        let deb=0, cred=0;
        Data.forEach(item=>{
            if(item.credit>0)
                cred += item.credit;
            if(item.debit>0)
                deb += item.debit;
        });
        this.setState({
            debit:deb,
            credit:cred,
            amount:deb-cred
        });
    }

    fetchTransections = () => {
        http
        .get(`${apiUrl}/api/v1/transections`)
        .then(res=>{
            this.setState({
                Data:res.data
            },()=>{
                this.setAmount();
            });
        })
        .catch(error=>{
            console.log(error);
        });
    }
    componentDidMount(){
        this.fetchTransections();
    }

    handleChangeStart = e => {
        this.setState({ startDate: e });
      };
    handleChangeEnd = e => {
      this.setState({ endDate: e });
    };
    
    render(){
        const {startDate, endDate, Data, debit, credit, amount} = this.state;
        return (
            <React.Fragment>
                <Container className="page-header">
                    <Header as="h2" className="second-header" floated="right">
                        Devsinc
                    </Header>
                    <Header as="h2" floated="left">
                        <Image className="logo" src={require("../../images/logo.png")} />
                        <span className="header-text">Accounts</span>
                    </Header>
                </Container>
                <div className="ui divider"></div>
                <Grid>
                    <Grid.Column width={4}>
                    <Card>
                        <Card.Content header='Filters' />
                        <Card.Content >
                            <lable>Date-From</lable>
                            <DatePicker
                            className="ui input date_picker_input"
                            selected={Date.parse(startDate)}
                            selectsStart
                            startDate={Date.parse(startDate)}
                            endDate={Date.parse(endDate)}
                            onChange={this.handleChangeStart}
                            isClearable={true}
                            dateFormat=" dd MMMM yyyy"
                            /><br/><br/>
                            <label>Date-To</label>
                            <DatePicker
                            className="ui input date_picker_input"
                            selected={Date.parse(endDate)}
                            selectsEnd
                            startDate={Date.parse(startDate)}
                            endDate={Date.parse(endDate)}
                            onChange={this.handleChangeEnd}
                            minDate={Date.parse(startDate)}
                            isClearable={true}
                            dateFormat=" dd MMMM yyyy"
                            /><br/><br/>
                             <Button color="green">Apply</Button>
                        </Card.Content>
                    </Card>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Message info>
                            <p>NOTE: Each amount is in US-Dollar</p>
                        </Message>
                        <Table celled>
                            <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Date</Table.HeaderCell>
                                <Table.HeaderCell>Details</Table.HeaderCell>
                                <Table.HeaderCell>Debit</Table.HeaderCell>
                                <Table.HeaderCell>Credit</Table.HeaderCell>                    
                            </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {Data.map(item =>(
                                    <Table.Row key={item.id}>
                                        <Table.Cell>
                                        {new Intl.DateTimeFormat("en-PK", dateOptions).format(
                                            new Date(item.created_at)
                                        )}</Table.Cell>
                                        <Table.Cell>{item.details}</Table.Cell>
                                        <Table.Cell>{item.debit}</Table.Cell>
                                        <Table.Cell>{item.credit}</Table.Cell>
                                    </Table.Row>
                                ))}

                            </Table.Body>
                       </Table>
                       <div style={{textAlign:"right"}}>
                            <Label color='blue' size="large">
                                Debit
                                <Label.Detail>{debit}</Label.Detail>
                            </Label>
                            <Label  color='teal' size="large">
                                Credit
                                <Label.Detail>{credit}</Label.Detail>
                            </Label>
                            <Label color='yellow' size="large">
                                Total
                                <Label.Detail>{amount}</Label.Detail>
                            </Label>
                        </div>
                    </Grid.Column>
                </Grid>
            </React.Fragment>
        )
    }
}
export default Accounts;
