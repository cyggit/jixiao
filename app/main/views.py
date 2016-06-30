#coding=utf-8
__author__ = 'cyg'

from datetime import datetime
from flask import render_template,session,redirect,url_for

from . import main
from .. import db
from ..models import *

@main.route('/',methods=['GET','POST'])
def index():
    return render_template('index.html')