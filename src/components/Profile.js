import React, {Component} from "react";
import Typography from "@material-ui/core/Typography";
import {Redirect} from "react-router-dom";

class Body extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    if(!this.props.loggedIn){
      return <Redirect to={{pathname: "/"}} />;
    }
    return (
      <Typography component="h2" variant="h1" gutterBottom>
        Profile Page
      </Typography>
    );
  }
}
export default Body;
