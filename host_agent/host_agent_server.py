import json, threading

from flask import Flask, make_response, request
from host_agent import store_host_data
from host_data import HostDataHandler

app = Flask(__name__)
db = HostDataHandler()

@app.route('/host_cpu')
def host_cpu():
    timestamp_begin = request.args.get('timestamp_begin', None)
    timestamp_end = request.args.get('timestamp_end', None)

    resp = make_response(json.dumps(db.get_data_db('Cpu_Util', timestamp_begin, timestamp_end)))
    resp.headers['Access-Control-Allow-Origin'] = "*"

    return resp
    
@app.route('/host_memory')
def host_memory():
    timestamp_begin = request.args.get('timestamp_begin', None)
    timestamp_end = request.args.get('timestamp_end', None)

    resp = make_response(json.dumps(db.get_data_db('Memory', timestamp_begin, timestamp_end)))
    resp.headers['Access-Control-Allow-Origin'] = "*"

    return resp

@app.route('/host_disk')
def host_disk():
    timestamp_begin = request.args.get('timestamp_begin', None)
    timestamp_end = request.args.get('timestamp_end', None)

    resp = make_response(json.dumps(db.get_data_db('Disk', timestamp_begin, timestamp_end)))
    resp.headers['Access-Control-Allow-Origin'] = "*"

    return resp 

if __name__ == '__main__':
    worker = threading.Thread(target=store_host_data)
    worker.daemon = True
    worker.start()
    
    app.debug = True    
    app.run(host='0.0.0.0', port=2020)

