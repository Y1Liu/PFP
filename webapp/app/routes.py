#!/usr/bin/env python
# coding: utf-8


###############################################################################
# Fichier contenant les fonction de planification
# Par Arnaud Duhamel et Robin Cavalieri
# Planificateur intelligent
# SOLUTEC Paris
# juin 2018
###############################################################################


###############################################################################
# LIBRAIRIES
###############################################################################
from flask import Flask, render_template, flash, request, redirect, url_for, session,jsonify
from wtforms import TextField, TextAreaField, validators, StringField, SubmitField, RadioField, SelectMultipleField, \
    SelectField
from wtforms_components import TimeField
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms.validators import Email, Length, InputRequired
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mongoengine import MongoEngine, Document
from flask_pymongo  import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

import pymongo as pm
from registerform import RegisterForm
from loginform import LoginForm
from logoutform import LogoutForm
from modifform import ModifForm
from modifacceptedform import ModifAcceptedForm
from generalform import GeneralForm
from tags import Tags
import computing as cp
import plan as pl
import schedule as sc
import hashlib
from graphnode import *
import configparser
import numpy as np

###############################################################################


###############################################################################
# App config.
###############################################################################
DEBUG = True
app = Flask(__name__)
app.config.from_object(__name__)
cfg = configparser.ConfigParser()
cfg.read('conf.cfg')
user = cfg.get('DB', 'user')
password = cfg.get('DB', 'password')
app.config['MONGO_DBNAME'] = 'Planificateur'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/Planificateur'
app.config['SECRET_KEY'] = '7d441f27d441f27567d441f2b6176a'
app.config['JWT_SECRET_KEY'] = 'secret'
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
bootstrap = Bootstrap(app)
datas = cp.init_matrix()
SESSION_TYPE = "mongodb"
# Session(app)
mongo = pm.MongoClient()
mongo1 = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)
###############################################################################


###############################################################################
# DATABASE
###############################################################################
db = MongoEngine(app)


###############################################################################


@app.route('/users/register', methods=['POST'])
def register():
    users = mongo1.db.users
    first_name = request.get_json()['first_name']
    last_name = request.get_json()['last_name']
    email = request.get_json()['email']
    password = bcrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')
    created = datetime.utcnow()

    user_id = users.insert({
	'first_name' : first_name,
	'last_name' : last_name,
	'email' : email,
	'password' : password,
	'created' : created,
	})
    new_user = users.find_one({'_id' : user_id})

    result = {'email' : new_user['email'] + ' registered'}

    return jsonify({'result' : result})

@login_manager.user_loader
def load_user(user_id):
    return User.objects(pk=user_id).first()


###############################################################################
# ROUTES
###############################################################################
# Page de login
"""
    IN : 
        login_form : formulaire de login   
    OUT : 
        1) template 'login.html'
        2) Après validation du formulaire :
            - si utilisateur dans la BDD : -> redirection vers route 'form' + cryptage du mot de passe
            - sinon -> redirection vers route 'login'
"""


@app.route('/users/login', methods=['POST'])
def login():
    users = mongo1.db.users
    email = request.get_json()['email']
    password = request.get_json()['password']
    result = ""

    response = users.find_one({'email': email})

    if response:
        if bcrypt.check_password_hash(response['password'], password):
            access_token = create_access_token(identity={
                'first_name': response['first_name'],
                'last_name': response['last_name'],
                'email': response['email']}
            )
            result = access_token
        else:
            result = jsonify({"error": "Invalid username and password"})
    else:
        result = jsonify({"result": "No results found"})
    return result

# Page d'inscription
"""
    IN : 
        register_form : formulaire d'inscription

    OUT : 
        1) template 'register.html'
        2) après validation du formulaire -> redirection vers route 'form' + cryptage du mot de passe
"""





# Page de profil
"""
    IN : 
        modif_accepted_form : formulaire de modification des informations utilisateur
        logout_form & modif_form : header    
    OUT : 
        1) template 'profile.html'
        2) Après validation de modif_accepted_form -> redirection vers route 'login'
        3) Après validation de logout_form -> deconnexion et redirection vers route 'login'
        4) Après validation de modif_form -> redirection vers route 'profile'
"""


@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    logout_form = LogoutForm(request.form)
    modif_form = ModifForm(request.form)
    modif_accepted_form = ModifAcceptedForm(request.form)
    if modif_form.modif_submit.data and modif_form.validate_on_submit():
        return redirect(url_for('profile'))
    if logout_form.logout_submit.data and logout_form.validate_on_submit():
        logout_user()
        return redirect(url_for('login'))
    if modif_accepted_form.register_submit.data and modif_accepted_form.validate_on_submit():
        return redirect(url_for('profile'))
    return render_template('profile.html', logout_form=logout_form, modif_form=modif_form, session_email=current_user.email, modif_accepted_form=modif_accepted_form)


# Page de formulaire
"""
    IN : 
        form : formulaire de renseignement     
    OUT : 
        template 'form.html'
        si optimisation en distance/temps : get_path = tableau avec les noms et scores de chaque étape
        si optimisation en affinités : get_way = liste d'étapes [["ville1", "score1"], ["ville2", "score2"], ...] 
"""


@app.route('/form', methods=['GET', 'POST'])
@login_required
def form():
    logout_form = LogoutForm(request.form)
    modif_form = ModifForm(request.form)
    if modif_form.modif_submit.data and modif_form.validate_on_submit():
        return redirect(url_for('profile'))
    if logout_form.logout_submit.data and logout_form.validate_on_submit():
        logout_user()
        return redirect(url_for('login'))

    form = GeneralForm(request.form)
    test = []
    tags = ['Hall', 'Museum']
    start = Node(1000, 0, None, 0, 0)
    target = Node(10000, 0, None, 0, 0)
    if request.method == 'POST':
        add_dep = request.form.get('add_dep')
        session["add_dep"] = add_dep
        add_arr = request.form.get('add_arr')
        session["add_arr"] = add_arr
        escales = [form.escales.data]
        tags = form.tags.data
        session["tags"] = tags
        max_escales = int(request.form.get('max_escales'))
        optimisation = request.form.get('optimisation')
        mode = request.form.get('locomotion')
        h_dep = request.form.get('h_dep')
        session["h_dep"] = h_dep
        j_dep = request.form.get('j_dep')
        session["j_dep"] = j_dep
        h_arr = request.form.get('h_arr')
        session["h_arr"] = h_arr
        j_arr = request.form.get('j_arr')
        session["j_arr"] = j_arr
        t_max = int(request.form.get('t_max'))
        d_max = int(request.form.get('d_max'))
        overallScore = cp.get_classement(datas[2], tags, datas[1], datas[3], datas[0])[0]
        dtfr = cp.get_graph_matrix(add_dep, add_arr, escales, mode, overallScore)
        if (optimisation == 'distance'):
            df_filtered = dtfr.loc[(dtfr['distance'] < d_max) & (dtfr['distance'] > 50000)]
        elif (optimisation == 'time'):
            df_filtered = dtfr.loc[dtfr['time'] < t_max]
        elif (optimisation == 'affinity'):
            df_filtered = dtfr.loc[(dtfr['distance'] < d_max) & (dtfr['distance'] > 50000)]
        test = pl.get_path(start, target, dtfr, overallScore, optimisation, df_filtered, datas[0], add_dep, add_arr, escales)
        session["test"] = test[0]
        time = sc.schedule_str(h_dep, h_arr, dtfr, test[1])
        session["time"] = time
        return redirect('/map')
    else:
        tags = session.get("tags", None)
        test = session.get("test", None)
    return render_template('form.html', title='Formulaire', form=form, logout_form=logout_form, modif_form=modif_form, session_email=current_user.email)


# Page d'affichage de la carte
"""
    IN : 
        depart : Ville de départ enregistrée depuis la requête utilisateur
        j_dep : Jour de départ
        h_dep: Heure de départ
        arrivee : Ville d'arrivée enregistrée depuis la requête utilisateur
        tags : Tags fournis par l'utilisateur
        test = trajet fourni par l'algorithme
    OUT :   
        template 'map.html' avec la carte complétée
"""


@app.route('/map', methods=['GET', 'POST'])
@login_required
def map():
    depart = session.get("add_dep", None)
    j_dep = session.get("j_dep", None)
    h_dep = session.get("h_dep", None)
    arrivee = session.get("add_arr", None)
    tags = session.get("tags", None)
    test = session.get("test", None)
    time = session.get("time", None)
    logout_form = LogoutForm(request.form)
    modif_form = ModifForm(request.form)
    modif_accepted_form = ModifAcceptedForm(request.form)
    if modif_form.modif_submit.data and modif_form.validate_on_submit():
        return redirect(url_for('profile'))
    if logout_form.logout_submit.data and logout_form.validate_on_submit():
        logout_user()
        return redirect(url_for('login'))
    return render_template('map.html', title='Map', depart=depart, j_dep=j_dep, h_dep=h_dep, arrivee=arrivee, tags=tags, test=test, time=time, logout_form=logout_form, modif_form=modif_form, session_email=current_user.email, modif_accepted_form=modif_accepted_form)


###############################################################################


###############################################################################
# MAIN
###############################################################################
if __name__ == "__main__":
    app.run(debug="true")
###############################################################################
