#!/usr/bin/env python
# coding: utf-8


###############################################################################
# LIBRAIRIES
###############################################################################
from flask import Flask, render_template, flash, request, redirect, url_for, session, jsonify
from wtforms import TextField, TextAreaField, validators, StringField, SubmitField, RadioField, SelectMultipleField, \
    SelectField
from wtforms_components import TimeField
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms.validators import Email, Length, InputRequired
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mongoengine import MongoEngine, Document
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required,
                                get_jwt_identity, get_raw_jwt)

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
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'password': password,
        'created': created,
    })
    new_user = users.find_one({'_id': user_id})

    result = {'email': new_user['email'] + ' registered'}

    return jsonify({'result': result})


@login_manager.user_loader
def load_user(user_id):
    return User.objects(pk=user_id).first()


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


@app.route('/trajets/trajet', methods=['POST'])
def trajet():
    trajets = mongo1.db.trajets
    lieudedepart = request.get_json()['first_name']
    lieudarrivee = request.get_json()['last_name']
    jourdedepart = request.get_json()['email']
    jourdarrivee = request.get_json()['password']

    user_id = trajets.insert({
        'lieudedepart': lieudedepart,
        'lieudarrivee': lieudarrivee,
        'jourdedepart': jourdedepart,
        'jourdarrivee': jourdarrivee,

    })


    result = jsonify({"result": "Bien reçu."})

    return result


###############################################################################


###############################################################################
# MAIN
###############################################################################
if __name__ == "__main__":
    app.run(debug="true")
###############################################################################
