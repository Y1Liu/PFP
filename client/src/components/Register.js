import React, { Component } from 'react'
import { register } from './UserFunctions'

class Register extends Component {
  constructor() {
    super()
    this.state = {
      first_name: '',
      last_name: '',
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

    const newUser = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password
    }

    register(newUser).then(res => {
      this.props.history.push(`/login`)
    })
  }

  render() {
    return (
      <div className="container">
       <div className="jumbotron mt-5">
         <div className="col-md-6 mt-3 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h2 mb-3 font-weight-normal">Inscription</h1>
                 <br></br>
                    <br></br>
              <div className="form-group">
                <label htmlFor="name">Prénom</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  placeholder="Entrer votre prénom"
                  value={this.state.first_name}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Nom</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  placeholder="Entrer votre nom"
                  value={this.state.last_name}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Adresse email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Entrer votre email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Entrer votre mot de passe"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
                 <br></br>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Register
