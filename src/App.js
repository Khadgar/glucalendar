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
import AddNew from "./components/AddNew";
import Profile from "./components/Profile";
import axios from "axios";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

const themeLight = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    type: "light"
  }
});

const themeDark = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    type: "dark"
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

//temporary stuff
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
      user: null,
      loading: true,
      theme: "light"
    };

    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount Root");
    this.setState({
      loading: true
    });
    this.getUser();
  }

  changeTheme() {
    this.setState({
      theme: this.state.theme === "light" ? "dark" : "light"
    });
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
        if (response.data.user) {
          console.log("Get User: There is a user saved in the server session: ");
          this.setState({
            loggedIn: true,
            user: response.data.user,
            loading: false
          });
        } else {
          console.log("Get user: no user");
          this.setState({
            loggedIn: false,
            user: null,
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
        <MuiThemeProvider theme={this.state.theme === "light" ? themeLight : themeDark}>
          <CssBaseline />
          <ApplicationBar auth={this.state.loggedIn} updateUser={this.updateUser} user={this.state.user} changeTheme={this.changeTheme} currentTheme={this.state.theme} />
          {this.state.loading ? (
            <div className={classes.progress}>
              <LinearProgress color="secondary" />
            </div>
          ) : (
            <div className="App">
              <Switch>
                <Route path="/login" render={props => <SignInPage {...props} updateUser={this.updateUser} loggedIn={this.state.loggedIn} />} />
                <Route path="/profile" render={props => <Profile {...props} loggedIn={this.state.loggedIn} user={this.state.user} />} />
                <Route path="/add-new" render={props => <AddNew {...props} loggedIn={this.state.loggedIn} user={this.state.user} />} />
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
