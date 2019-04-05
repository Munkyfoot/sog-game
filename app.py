from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_bcrypt import generate_password_hash, check_password_hash
import hashlib
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, or_, desc
from sqlalchemy.orm import sessionmaker
from db import Base, db_name

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}.db?check_same_thread=False'.format(
    db_name)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()
db.init_app(app)

'''
# JSON API Endpoint
@app.route('/JSON/')
def restaurantsJSON():
    session = DBSession()

    entries = session.query(Entry).all()

    return jsonify(Entries=[e.serialize for e in entries])

# Page
@app.route('/')
def mainPage():
    session = DBSession()
    return render_template('index.html')

# Page with params
@app.route('/<int:entry_id>/')
def page(id):
    session = DBSession()

    restaurant = session.query(Entry).filter_by(id = entry_id).one()

    return render_template('page.html', entry = entry)

'''

if __name__ == '__main__':
    app.secret_key = hashlib.md5('secret_key'.encode()).hexdigest()
    app.debug = True
    app.run(host='0.0.0.0', port=8000)