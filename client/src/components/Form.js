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
      h_dep: '',
      h_arr: '',
      escale: '',
      tag:'',

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
      password: this.state.password,
      h_dep:this.state.h_dep,
      h_arr:this.state.h_arr,
      escale:this.state.escale,
      tag:this.state.tag

    }

    trajet(newTrajet).then(res => {
      this.props.history.push(`/map`)
    })
  }



  render() {
    return (
      <div className="container">

        <div className="jumbotron mt-5">
         <h1 className="h3 mb-3 font-weight-normal">Planifier votre voyage</h1><br/>
         <div class="card">
      <div class="card-header">
        <a class="card-link" data-toggle="collapse" href="#collapseOne">
          VOTRE DEPART
        </a>
      </div>
      <div id="collapseOne" class="collapse show" data-parent="#accordion">
        <br/>
        <div class="card-body">
         <div class="input-group mb-3">
           <div class="input-group-prepend">
           <span class="input-group-text" style={{ width: 80 }}>Ville</span>
           </div>
         <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  placeholder=""
                  value={this.state.first_name}
                  onChange={this.onChange}
                />
        </div>
          
        <div class="input-group mb-3">
           <div class="input-group-prepend">
           <span class="input-group-text" style={{ width: 80 }} >Date</span>
           </div>
        <input
                  type="date"
                  className="form-control"
                  name="email"
                  placeholder=""
                  value={this.state.email}
                  onChange={this.onChange}
                />
        </div>

        <div class="input-group mb-3">
           <div class="input-group-prepend">
           <span class="input-group-text" style={{ width: 80 }} >Heure</span>
           </div>
        <input
                  type="time"
                  className="form-control"
                  name="h_dep"
                  placeholder=""
                  value={this.state.h_dep}
                  onChange={this.onChange}
                />
        </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <a class="collapsed card-link" data-toggle="collapse" href="#collapseTwo">
        VOTRE ARRIVEE
      </a>
      </div>
      <div id="collapseTwo" class="collapse" data-parent="#accordion" >
        <div class="card-body">          
              <div class="input-group mb-3">
         <div class="input-group-prepend">
           <span class="input-group-text" style={{ width: 80 }} >Ville</span>
           </div>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  placeholder=""
                  value={this.state.last_name}
                  onChange={this.onChange}
                />
              </div>

         <div class="input-group mb-3">
           <div class="input-group-prepend">
           <span class="input-group-text" style={{ width: 80 }} >Date</span>
           </div>
                <input
                  type="date"
                  className="form-control"
                  name="password"
                  placeholder=""
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
         <div class="input-group mb-3">
           <div class="input-group-prepend">
           <span class="input-group-text" style={{ width: 80 }} >Heure</span>
           </div>
                <input
                  type="time"
                  className="form-control"
                  name="h_arr"
                  placeholder=""
                  value={this.state.h_arr}
                  onChange={this.onChange}
                />
              </div>


        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <a class="collapsed card-link" data-toggle="collapse" href="#collapseThree">
          AUTRES PARAMETRES
        </a>
      </div>
      <div id="collapseThree" class="collapse" data-parent="#accordion">
        <div class="card-body">
         <div class="input-group mb-3">
      
            <div class="input-group-prepend">
           <span class="input-group-text" style={{ width: 80 }} >Escale</span>
           </div>
              
                <input
                  type="text"
                  className="form-control"
                  name="escale"
                  placeholder=""
                  value={this.state.escale}
                  onChange={this.onChange}
                />
              </div>


         <div class="input-group mb-3">
      
          <div class="input-group-prepend">
           <span class="input-group-text" style={{ width: 80 }} >Tag</span>
            </div>
                <input
                  type="text"
                  className="form-control"
                  name="tag"
                  placeholder=""
                  value={this.state.tag}
                  onChange={this.onChange}
                />
              </div>
    
         </div>
        </div>
      </div>
    </div>
            <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
             

              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
                data-toggle="modal" data-target="#myModal"
              >
                C'est parti!
              </button>
            </form>
          </div>


          <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
             <div class="modal-dialog">
               <div class="modal-content">
                     <div class="modal-header">
          <h4 class="modal-title">Un peu de patience</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
   
        <div class="modal-body">
          Le calcul de votre trajet sera fini dans un instant.
        </div>
   
      
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
        </div>

    
   
      </div>
    </div>
  </div>
      </div>
    )
  }
}

export default Trajet
