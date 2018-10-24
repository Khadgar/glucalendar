import React, {Component} from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import ApplicationBar from "./components/ApplicationBar";
import "typeface-roboto";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import {Route, Switch} from "react-router-dom";
// import routes from "./components/Routes"; collect routes here in the future
import SignInPage from "./components/SignIn";
import Profile from "./components/Profile";
import axios from "axios";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

const styles = theme => ({
  progress: {
    flexGrow: 1
  }
});


//temporary stuff
const NoMatch = ({location}) => (
  <React.Fragment>
    <Typography component="h2" variant="h1" gutterBottom>
      Not found! <code>{location.pathname}</code>
    </Typography>
  </React.Fragment>
);

const Home = () => (
  <React.Fragment>
    <Typography component="h2" variant="h1" gutterBottom>
      Home
    </Typography>
  </React.Fragment>
);

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      username: null,
      loading: true
    };

    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    this.setState({
      loading: true
    });
    this.getUser();
  }

  updateUser(userObject) {
    //this.setState(userObject);
    this.getUser();
  }

  getUser() {
    axios
      .get("/user")
      .then(response => {
        console.log("Get user response: ");
        console.log(response.data);
        if (response.data.user) {
          console.log("Get User: There is a user saved in the server session: ");
          this.setState({
            loggedIn: true,
            username: response.data.user.username,
            loading: false
          });
        } else {
          console.log("Get user: no user");
          this.setState({
            loggedIn: false,
            username: null,
            loading: false
          });
        }
      })
      .catch(error => {
        console.log("login error: ");
        console.log(error);
      });
  }

  render() {
    const {classes} = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <ApplicationBar auth={this.state.loggedIn} updateUser={this.updateUser} />
          {this.state.loading ? (
            <div className={classes.progress}>
              <LinearProgress color="secondary" />
            </div>
          ) : (
            <div className="App">
              <Switch>
                <Route path="/login" render={props => <SignInPage {...props} updateUser={this.updateUser} loggedIn={this.state.loggedIn} />} />
                <Route path="/profile" render={props => <Profile {...props} loggedIn={this.state.loggedIn} />} />
                <Route exact path="/" component={Home} />
                <Route component={NoMatch} />
              </Switch>
            </div>
          )}
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
