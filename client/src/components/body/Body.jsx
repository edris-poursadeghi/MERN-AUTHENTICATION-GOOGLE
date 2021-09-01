import React from "react";

import { Switch, Route } from "react-router-dom";
import Login from "../body/auth/Login";
import Register from "../body/auth/Register";
import ActivationEmail from "../body/auth/ActivationEmail";

import ForgotPassword from "../body/auth/ForgotPassword";
import ResetPassword from "../body/auth/ResetPassword";

import NotFound from "../utils/NotFound/NotFound";

import { useSelector } from "react-redux";
import Profile from "./profile/Profile";
import EditUser from "./profile/EditUser";
import Home from "./home/Home";

function Body() {
  const auth = useSelector((state) => state.auth);
  const { isLogged, isAdmin } = auth;
  return (
    <section>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route component={isLogged ? NotFound : Login} path="/login" exact />

        <Route
          component={isLogged ? NotFound : Register}
          path="/register"
          exact
        />

        <Route
          component={isLogged ? NotFound : ForgotPassword}
          path="/forgot_password"
          exact
        />
        <Route
          component={isLogged ? NotFound : ResetPassword}
          path="/user/reset/:token"
          exact
        />

        <Route
          component={ActivationEmail}
          path="/user/activate/:activation_token"
          exact
        />

        <Route
          component={isAdmin ? EditUser : NotFound}
          path="/edit_user/:id"
          exact
        />

        <Route
          path="/profile"
          component={isLogged ? Profile : NotFound}
          exact
        />
      </Switch>
    </section>
  );
}

export default Body;
