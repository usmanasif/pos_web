import React, { Component }from 'react'
import { Pagination, Icon } from 'semantic-ui-react'
class Paginate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: this.props.pageSet.activePage,
      totalPages: 0,
      per_page: this.props.pageSet.per_page
    };
  }

  handleActivePage = (e, { activePage }) => {
    this.setState({ activePage });
    const { per_page} = this.state;
    this.props.handlePagination(activePage, per_page);
  }

  componentDidMount(){
    const { per_page} = this.state;
    const { totalPages } = this.props.pageSet;
    this.setState({
      totalPages: Math.ceil(totalPages/per_page)
    });
  }

  render(){
    this.state.activePage = this.props.pageSet.activePage;
    this.state.totalPages =  Math.ceil(this.props.pageSet.totalPages/ this.state.per_page);   
    return(
      <Pagination
        boundaryRange={0}
        activePage={this.state.activePage}
        siblingRange={3}
        disabled={ this.state.totalPages<2?true:false}
        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
        prevItem={{ content: <Icon name='angle left' />, icon: true }}
        nextItem={{ content: <Icon name='angle right' />, icon: true }}
        totalPages={this.state.totalPages}
        onPageChange={this.handleActivePage}
      />
    )
  }
}
export default Paginate
