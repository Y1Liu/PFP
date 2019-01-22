import React, { Component } from 'react'
import { trajet } from './UserFunctions'

class Trajet extends Component {
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

    const newTrajet = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password
    }

    trajet(newTrajet).then(res => {
      this.props.history.push(`/map`)
    })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Planifier votre voyage</h1><br/>


              <div className="form-group">
                <label htmlFor="name">Lieu de départ</label>

                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  placeholder=""
                  value={this.state.first_name}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Lieu d'arrivée</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  placeholder=""
                  value={this.state.last_name}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Jour de départ</label>
                <input
                  type="date"
                  className="form-control"
                  name="email"
                  placeholder=""
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Jour d'arrivée</label>
                <input
                  type="date"
                  className="form-control"
                  name="password"
                  placeholder=""
                  value={this.state.password}
                  onChange={this.onChange}
                /><br/>
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                C'est parti!
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Trajet