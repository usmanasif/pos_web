import React, { Component }from 'react'
import { Pagination } from 'semantic-ui-react'
class Paginate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: this.props.pageSet.activePage,
      totalPages: this.props.pageSet.totalPages,
      per_page: this.props.pageSet.per_page
    };
  }

  handleActivePage = (e, { activePage }) => {
    this.setState({ activePage });
    const { per_page} = this.state;
    this.props.handlePagination(activePage, per_page);
  }
  componentDidMount(){
    const { activePage, per_page} = this.state;
    const { totalPages } = this.props.pageSet;
    this.setState({
      totalPages: totalPages/per_page
    });

    this.props.handlePagination(activePage, per_page);
  }

  render(){
    const {activePage,totalPages} = this.state;
    
    return(
      <Pagination
        boundaryRange={0}
        defaultActivePage={activePage}
        ellipsisItem={null}
        firstItem={null}
        lastItem={null}
        siblingRange={2}
        totalPages={totalPages}
        onPageChange={this.handleActivePage}
      />
    )
  }
}
export default Paginate
