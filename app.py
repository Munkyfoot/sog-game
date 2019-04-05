from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_bcrypt import generate_password_hash, check_password_hash
import hashlib
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, or_, desc
from sqlalchemy.orm import sessionmaker
from db import Base, Tile, db_name
import random

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
    entries = db.session.query(Entry).all()

    return jsonify(Entries=[e.serialize for e in entries])

# Page
@app.route('/')
def mainPage():
    return render_template('index.html')

# Page with params
@app.route('/<int:entry_id>/')
def page(id):

    restaurant = db.session.query(Entry).filter_by(id = entry_id).one()

    return render_template('page.html', entry = entry)

'''
# Helper Methods
def GenerateGame():
    for i in range(16**2):
        tile = Tile(color_id=0)
        db.session.add(tile)
        db.session.commit()


# Page
@app.route('/')
def main():
    game_state = db.session.query(Tile).all()

    if len(game_state) == 0:
        GenerateGame()
        game_state = db.session.query(Tile).all()

    return render_template('index.html')


@app.route('/update/<int:tile_id>/', methods = ['POST'])
def update(tile_id):
    if request.method == 'POST':
        tile = db.session.query(Tile).filter_by(id=tile_id).first()
        if tile != None:
            tile.color_id = (tile.color_id + 1) % 2
            db.session.add(tile)
            db.session.commit()
        
        return redirect(url_for('jsonMain'))

@app.route('/json/')
def jsonMain():
    game_state = db.session.query(Tile).all()

    return jsonify([t.serialize for t in game_state])


if __name__ == '__main__':
    app.secret_key = hashlib.md5('secret_key'.encode()).hexdigest()
    app.debug = True
    app.run(host='0.0.0.0', port=8000)