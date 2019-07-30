import React, { Component } from 'react'
<<<<<<< HEAD
import Axios from 'axios';
import {Form, Grid} from "semantic-ui-react";
import ImageUpload from "../imageUploader/imageUpload"
import {apiUrl} from "../../utils/api-config";
=======
import Navigation from './navigation'
import NewReciept from './newReciept'

>>>>>>> new reciept/bill page design
class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
                name:'',
                subdomain:'',
                about_you:'',
                logo:''
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
         });
    }

    uploadImage = (url) => {
        this.setState({logo: url})
     }

    createCompany = () =>{
        console.log(this.state)
        const {name, subdomain, about_you, logo} =this.state;
        Axios.post(apiUrl+"/companies",{name, subdomain, about_you, logo})
            .then(function (response) {
                // handle success
                console.log(response);
                // this.props.history.push("/home");
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    render() {
        return (
<<<<<<< HEAD
            <Grid centered>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Form>
                            <Form.Input
                                fluid label='Company name'
                                placeholder='Enter company name'
                                name="name"
                                onChange={this.onChange}
                                value={this.state.name}
                            />
                            <Form.Input
                                fluid label='Domain name'
                                placeholder='Enter domain name'
                                name="subdomain"
                                onChange={this.onChange}
                                value={this.state.subdomain}
                            />
                            <Form.TextArea
                                label='About'
                                placeholder='Tell us more about you...'
                                name="about_you"
                                onChange={this.onChange}
                                value={this.state.about_you}
                            />
                            <ImageUpload imageURL = {this.uploadImage}></ImageUpload>
                            <Form.Button primary onClick={this.createCompany}>Register Company</Form.Button>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
=======
            <div>
                <Navigation></Navigation>
                <NewReciept></NewReciept>
            </div>
>>>>>>> new reciept/bill page design
        )
    }
}

export default Home;
