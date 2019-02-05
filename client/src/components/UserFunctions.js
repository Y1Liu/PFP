import axios from 'axios'

export const register = newUser => {
  return axios
    .post('users/register', {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: newUser.password
    })
    .then(response => {
      console.log('Registered')
    })
}

export const login = user => {
  return axios
    .post('users/login', {
      email: user.email,
      password: user.password
    })
    .then(response => {
      localStorage.setItem('usertoken', response.data)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const getProfile = user => {
  return axios
    .get('users/profile', {
      //headers: { Authorization: ` ${this.getToken()}` }
    })
    .then(response => {
      console.log(response)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const trajet = newTrajet => {
  return axios
    .post('trajets/trajet', {
      first_name: newTrajet.first_name,
      last_name: newTrajet.last_name,
      email: newTrajet.email,
      password: newTrajet.password,
      h_dep: newTrajet.h_dep,
      h_arr: newTrajet.h_arr,
      escale: newTrajet.escale,
      tag: newTrajet.tag

    })
    .then(response => {
      console.log('Registered')
    })
}
