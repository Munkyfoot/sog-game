from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db import Base, db_name

app = Flask(__name__)

engine = create_engine('sqlite:///{}.db'.format(db_name))
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)

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
    app.secret_key = 'super_secret_key'
    app.debug = True
    app.run(host='0.0.0.0', port=5000)