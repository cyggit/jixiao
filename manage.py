#!/usr/bin/python
#coding=utf-8
__author__ = 'cyg'


import os
from app import create_app,db
from flask.ext.script import Manager,Shell
from flask.ext.migrate import Migrate,MigrateCommand

app=create_app('defalut')

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=8000)