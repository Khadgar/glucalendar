import React, {Component} from "react";
import Typography from "@material-ui/core/Typography";
import {Redirect} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import Results from "./Results";
import PropTypes from "prop-types";
import AddNewDialog from "./AddNewDialog";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  addNewBtn: {
    margin: '4px'
  }
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddResult: false
    };
  }
  handleClickOpen = () => {
    this.setState({
      openAddResult: true
    });
  };

  handleClose = () => {
    this.setState({openAddResult: false});
  };

  render() {
    if (!this.props.loggedIn) {
      return <Redirect to={{pathname: "/"}} />;
    } else {
      return (
        <React.Fragment>
          <Typography component="h2" variant="h1" gutterBottom>
            Profile Page of {this.props.user.username}
          </Typography>
          <Button className={this.props.classes.addNewBtn} variant="outlined" color="primary" onClick={this.handleClickOpen}>Add New Measurment</Button>
          <AddNewDialog user={this.props.user} open={this.state.openAddResult} onClose={this.handleClose} />
          <Results user={this.props.user} />
        </React.Fragment>
      );
    }
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);
