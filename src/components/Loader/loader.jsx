import React, { Component } from "react";
import { css } from '@emotion/core';
import FadeLoader from 'react-spinners/FadeLoader';

const override = css`
  position: relative;
  font-size: 0;
  left: 374px;
  top: 47px;
  width: 81px;
  height: 115px;
  display: block;
  margin: 0 auto;
`;

class Loader extends Component {
    render(){
        return(
            <div className='sweet-loading'>
                  <FadeLoader
                    css={override}
                    sizeUnit={"px"}
                    size={150}
                    color={'#05b4ac'}
                    loading={true}
                  />
            </div> 
        );
    }
}

export default Loader;