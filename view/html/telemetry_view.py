from flask import Flask, render_template, make_response

import requests, json

app = Flask(__name__)

__SERVER_ADDRESS = 'http://150.165.15.4:9090'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/projects/instances')
def projects_instances():
    r = requests.get(__SERVER_ADDRESS + '/projects/instances')
    if r.status_code == 200:
        resp = make_response(r.json())
    else
        resp = make_response(json.dumps({ 'error' : r.status_code }))

    resp.headers['Access-Control-Allow-Origin'] = "*"

    return resp    

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=9999)

