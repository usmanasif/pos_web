import React from 'react'
import { Pagination } from 'semantic-ui-react'

const Paginate = () => (
  <Pagination
    boundaryRange={0}
    defaultActivePage={1}
    ellipsisItem={null}
    firstItem={null}
    lastItem={null}
    siblingRange={1}
    totalPages={10}
  />
)

export default Paginate