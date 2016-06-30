__author__ = 'cyg'

import os
basedir=os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY=os.environ.get('SECRET_KEY') or '87d440dc3e1311e69176e0accb97b7ce'
    # SQLALCHEMY_COMMIT_ON_TEARDOWN=True
    # FLASK_MAIL_SUBJECT_PREFIX=['xinfang jixiao']
    # FLASK_MAIL_SENDER='lgxfj@longgang.gov.cn'
    # FLASK_ADMIN=os.environ.get('FLASK_ADMIN')

    @staticmethod
    def init_app(app):
        pass

config={
    'defalut':Config,
}