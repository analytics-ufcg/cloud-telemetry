import json
from flask import Flask, make_response, request
from psutil_agent import PsutilAgent
from db_agent import DbAgent

app = Flask(__name__)
psutil = PsutilAgent()
db = DbAgent()

@app.route('/host_cpu')
def host_cpu():
    resp = make_response(json.dumps(db.get_data_db('Cpu_Util')))
    resp.headers['Access-Control-Allow-Origin'] = "*"

    return resp
    
@app.route('/host_memory')
def host_memory():
    resp = make_response(json.dumps(db.get_data_db('Memory')))
    resp.headers['Access-Control-Allow-Origin'] = "*"

    return resp

@app.route('/host_disk')
def host_disk():
    resp = make_response(json.dumps(db.get_data_db('Disk')))
    rep.headers['Access-Control-Allow-Origin'] = "*"

    return None

if __name__ == '__main__':
    
    app.debug = True    
    app.run(host='0.0.0.0', port=6556)

