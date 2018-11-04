import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import AddNew from "./AddNew";

const styles = theme => ({});
class AddNewDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  render() {
    const {classes, onClose, ...other} = this.props;
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Add New Measurment</DialogTitle>
        <AddNew showTitle={false} loggedIn={true} user={this.props.user} />
      </Dialog>
    );
  }
}

AddNewDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  loggedIn: PropTypes.bool,
  selectedValue: PropTypes.string
};
export default withStyles(styles)(AddNewDialog);
