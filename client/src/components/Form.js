import React, { Component } from 'react'
import { trajet } from './UserFunctions'
import Modal from 'react-modal'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

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
      modalIsOpen: false,

      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  
   openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#C0C0C0';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
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
                onClick={this.openModal}
              >
                C'est parti!
              </button>
            </form>
          </div>


          <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <h3 ref={subtitle => this.subtitle = subtitle}>Chargement...</h3>
          <br/>
          <p>Un peu de patience. Le calcul de votre trajet sera fini dans un instant.</p>
          <br/>
          <div class="progress">
             <div class="progress-bar progress-bar-striped progress-bar-animated" style={{width: 200}}></div>
          </div>
          <br/>
          <br/>
          <div>
          <button class="btn btn-secondary" onClick={this.closeModal} >Annuler</button>
          </div>
         </Modal>

    
   
      
      </div>
    )
  }
}

export default Trajet
