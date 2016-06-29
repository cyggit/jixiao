#coding=utf-8
__author__ = 'cyg'

from Flask import  Flask,render_template
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from config import config

bootstrap = Bootstrap()
db=SQLAlchemy

def create_app(confing_name):
    app=Flask(__name__)
    app.config.from_object(config[confing_name])
    config[confing_name].__init__(app)

    bootstrap.init_app(app)
    db.init_app(app)
    return app
