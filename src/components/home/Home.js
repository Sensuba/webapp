import React, { Component } from 'react';
import './Home.css';
import Nav from '../nav/Nav';
import MainButton from '../buttons/MainButton';
import Flowers from '../other/flowers/Flowers';
import Lightbox from '../utility/Lightbox';
import { Input, Button, Label, Form, FormFeedback } from 'reactstrap';
import SocketManager from '../../SocketManager';

import { read } from '../../TextManager';

export default class Home extends Component {

  state={}

  login () {

    let username = document.getElementById("username-login").value;
    let password = document.getElementById("password-login").value;

    if (username.length < 4 || password.length < 8)
      return;

    SocketManager.master.login(username, password);
  }

  render () {

    return (
      <div className="main-page light home-page">
        <Flowers/>
        <Nav/>

        { this.state.logbox ?
          <Lightbox open={true} onClose={() => this.setState({logbox: null})}> 
            <div className="logbox">
            {
              this.state.logbox === "login" ?
                <Form onSubmit={e => {e.preventDefault(); this.login();}}>
                  <Label for="username-login">
                    <div className="label-input">{ read('menu/username') }</div>
                    <Input id="username-login" type="text" name="username" autoComplete="on"/>
                  </Label>
                  <Label for="password-login">
                    <div className="label-input">{ read('menu/password') }</div>
                    <Input id="password-login" type="password" name="password" autoComplete="off"/>
                  </Label>
                  <MainButton>{ read('menu/login') }</MainButton>
                  <div className="more-detail" onClick={() => this.setState({logbox: "signup"})}>{ read('menu/createaccount') }</div>
                </Form>
                :
                <Form onSubmit={e => {e.preventDefault(); this.signup();}}>
                  <Label for="username-signup">
                    <div className="label-input">{ read('menu/username') }</div>
                    <Input autoComplete="off" onChange={() => this.setState({"usernamesignupvalid": document.getElementById("username-signup").value.length >= 4})} invalid={!this.state.usernamesignupvalid} id="username-signup" type="text" name="username"/>
                    <FormFeedback>{ (this.state.usernamesignupvalid ? "✔ " : "❌ ") + read('menu/usernamelengthwarning') }</FormFeedback>
                  </Label>
                  <Label for="password-signup">
                    <div className="label-input">{ read('menu/password') }</div>
                    <Input autoComplete="off" onChange={() => this.setState({"passwordsignupvalid": document.getElementById("password-signup").value.length >= 8})} invalid={!this.state.passwordsignupvalid} id="password-signup" type="password" name="password"/>
                    <FormFeedback>{ (this.state.passwordsignupvalid ? "✔ " : "❌ ") + read('menu/passwordlengthwarning') }</FormFeedback>
                  </Label>
                  <Label for="confirm-password-signup">
                    <div className="label-input">{ read('menu/confirmpassword') }</div>
                    <Input autoComplete="off" onChange={() => this.setState({"confirmpasswordsignupvalid": document.getElementById("confirm-password-signup").value === document.getElementById("password-signup").value})} invalid={!this.state.confirmpasswordsignupvalid} id="confirm-password-signup" type="password" name="confirm-password"/>
                    <FormFeedback>{ (this.state.confirmpasswordsignupvalid ? "✔ " : "❌ ") + read('menu/confirmpasswordwarning') }</FormFeedback>
                  </Label>
                  <MainButton>{ read('menu/signup') }</MainButton>
                  <div className="more-detail" onClick={() => this.setState({logbox: "login"})}>{ read('menu/alreadyaccount') }</div>
                </Form>
            }
            </div>
          </Lightbox> : ""
        }

        <div className="main">
          <h1>{ read('menu/title') }</h1>
          <MainButton to="/play">{ read('menu/play') }</MainButton>
          <MainButton onClick={() => this.setState({logbox: "login"})}>{ read('menu/login') }</MainButton>
        </div>
      </div>
    );
  }
}

