import React, { Component } from "react";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: props.logo ? props.logo : ""
    };
    this._handleImageChange = this._handleImageChange.bind(this);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.props.imageURL(reader.result); //pass data(base64 URL) to parent
      this.setState({
        imageUrl: reader.result
      });
    };
    
    if (file) reader.readAsDataURL(file);
  }

  render() {
    return (
      <div className="imguploader">
        <input type="file" onChange={this._handleImageChange} />
        {this.state.imageUrl ? <img src={this.state.imageUrl} alt="" /> : null}
      </div>
    );
  }
}

export default ImageUpload;
