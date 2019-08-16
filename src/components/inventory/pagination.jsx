import React, { Component }from 'react'
import { Pagination } from 'semantic-ui-react'
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
      totalPages: totalPages/per_page
    });
  }

  render(){
    const {activePage,totalPages} = this.state;
    
    return(
      <Pagination
        boundaryRange={0}
        activePage={activePage}
        firstItem={null}
        lastItem={null}
        totalPages={totalPages}
        onPageChange={this.handleActivePage}
      />
    )
  }
}
export default Paginate
