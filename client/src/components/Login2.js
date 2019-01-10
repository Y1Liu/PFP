import React, { Component } from 'react'
import { login } from './UserFunctions'
import './style.css'

class Login2 extends Component {
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

        <div id="page" className="site">
            <div id="page_co">
                <div id="" className="page_co">
                    <div className="row cadres_co">
                        <div className="col-5 cadre_co">
                            <div className="col-7 cont_cadre">
                                <div className="row titre">
                                    BON VOYAGE !!
                                </div>
                                <form noValidate onSubmit={this.onSubmit} className="row form_co">
                                    <div className="col-12 line">
                                        <input
                                            type="email"
                                            idName="mail_co"
                                            className="mail"
                                            placeholder="Adresse Mail"
                                            value={this.state.email}
                                            onChange={this.onChange} />
                                    </div>
                                    <div className="col-12 line">
                                        <input type="password" id="password_co" className="password"
                                               placeholder="Mot de passe" value={this.state.password} onChange={this.onChange} /></div>
                                    <div className="col-12 line">
                                        <input type="submit" id="button_co" className="button" value="SE CONNECTER" />
                                    </div>
                                    <div className="col-12 line">
                                        <input type="checkbox" id="condition_co" className="conditions" />J'accepte les
                                            conditions d'utilisation</div>
                                </form>
                            </div>
                            <div className="forg_password">
                                <a href="">Mot de passe oublié ?</a>
                            </div>
                        </div>
                        <div className="col-7 cadre_ins">
                            <div className="col-9 cont_cadre">
                                <div className="row titre">
                                    INSCRIPTION
                                </div>
                                <form method="" className="row form_ins">
                                    <div className="col-6 line">
                                        <div className="posi_name">Prénom</div>
                                        <input type="text" id="firstname_ins" className="firstname"
                                               placeholder="Gérard" />
                                    </div>
                                    <div className="col-6 line">
                                        <div className="posi_name">Nom</div>
                                        <input type="text" id="lastname_ins" className="lastname" placeholder="Patrick" />
                                    </div>
                                    <div className="col-12 line">
                                        <input type="email" id="mail_ins" className="mail" placeholder="Adresse Mail" />
                                            <div className="col-12 line"></div>
                                            <input type="password" id="password1_ins" className="password"
                                                   placeholder="Mot de passe" />
                                                <div className="col-12 line"></div>
                                                <input type="password" id="password2_ins" className="password"
                                                       placeholder="Mot de passe" />
                                                    <div className="col-12 line"></div>
                                                    <input type="submit" id="button_ins" className="button"
                                                           value="S'INSCRIRE" />
                                                        <div className="col-12 line"></div>
                                                        <input type="checkbox" id="condition_co" className="conditions" />J'accepte
                                                            les conditions d'utilisation</div>
                                </form>
                            </div>
                            <div className="forg_password">
                                <a href="">Mot de passe oublié ?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
  }
}

export default Login2
