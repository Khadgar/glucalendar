import {Home, ContentPaste, Notifications, AccountCircle} from "@material-ui/icons";
import SignInPage from "./SignIn";

const Routes = [
  {
    path: "/login",
    sidebarName: "Sign In",
    navbarName: "Sign In",
    icon: AccountCircle,
    component: SignInPage
  }
];

export default Routes;
