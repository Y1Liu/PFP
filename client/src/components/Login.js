import React, { Component } from 'react'
import { login } from './UserFunctions'

class Login extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    login(user).then(res => {
        if (!res.error) {
        this.props.history.push(`/profile`)
        }
    })
  }

  render() {
    return (

      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h2 mb-3 font-weight-normal">Connexion</h1>
                 <br></br>
                    <br></br>
              <div className="form-group">
                <label htmlFor="email">Adresse email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mot de passe/label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Mot de passe"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
              <br></br>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Connexion
              </button>
            </form>
          </div>
        </div>
      </div>


    )
  }
}

export default Login
