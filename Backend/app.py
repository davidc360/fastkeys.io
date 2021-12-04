from flask import Flask, Response, request, jsonify
from flask_cors import CORS

from flask_pymongo import PyMongo

from models import make_channel, make_message, make_user

import requests
import json
import os
from dotenv import load_dotenv, find_dotenv

import uuid

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
statsdb = mongo.db.stats

# home route
@app.route('/')
def home():
    return 'hello'

@app.route('/api/views', methods=['PUT'])
def icr_views():
    statsdb.update_one({}, {'$inc': {'views': 1}}, upsert=True)
    return "", 200

@app.route('/api/stats')
def get_stats():
    stats = statsdb.find_one({})
    return json.dumps(stats, default=str)

@app.route('/game', methods=['POST', 'DELETE'])
def post_game():
    if request.method == 'POST':
        doc = {}
        params = request.get_json()
        
        doc['usr'] = params.get('username')
        doc['se'] = params.get('sequence')
        doc['ws'] = params.get('words')
        doc['st'] = params.get('stats')
        doc['m'] = params.get('mode')
        doc['wpm'] = params.get('stats').get('speed')
        doc['acc'] = params.get('stats').get('accuracy')
        game_id = str(uuid.uuid4())[:8]
        while gamesdb.find_one({"id": game_id}) is not None:
            game_id = str(uuid.uuid4())[:8]
        doc['id'] = game_id
        gamesdb.insert_one(doc)
        statsdb.update_one({}, {'$inc': {'games': 1}}, upsert=True)
        return jsonify(game_id)

@app.route('/game/<game_id>', methods=['GET', 'DELETE'])
def return_game(game_id=None):
    if request.method == 'GET':
        game = gamesdb.find_one({"id": game_id})
        statsdb.update_one({}, {'$inc': {'game_played': 1}}, upsert=True)
        return json.dumps(game, default=str)

if __name__ == '__main__':
    app.run()