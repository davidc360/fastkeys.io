from flask import Flask, Response, request
from flask_cors import CORS

from flask_pymongo import PyMongo

from models import make_channel, make_message, make_user

import requests
import json
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

MONGO_URI = os.environ.get("MONGO_URI")

#dev
import json

app = Flask(__name__)
CORS(app)
# mongo URI for pymongo
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)
gamesdb = mongo.db.games

# home route
@app.route('/')
def home():
    return 'hello'

@app.route('/game', methods=['POST', 'DELETE'])
def post_game():
    if request.method == 'POST':
        doc = {}
        params = request.get_json()
        doc['usr'] = params.get('username')
        doc['seq'] = params.get('sequence')
        doc['id'] = format(gamesdb.find().count()+40000, 'x')
        gamesdb.insert_one(doc)
        return Response(status=200)

@app.route('/game/<game_id>', methods=['GET', 'DELETE'])
def return_game(game_id=None):
    if request.method == 'GET':
        game = gamesdb.find_one({"id": game_id})
        return json.dumps(game, default=str)


if __name__ == '__main__':
    app.run()