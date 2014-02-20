from flask import Flask, render_template, request

from ceilometer_client import CeilometerClient
#from local_db_worker import db_worker

import json

app = Flask(__name__)
ceilometer = CeilometerClient()

@app.route('/')
def home(name=None):
    return render_template('index.html', name=name)

@app.route('/cpu_util')  
def cpu_util():
    timestamp_begin = request.args.get('timestamp_begin', None)
    timestamp_end = request.args.get('timestamp_end', None)
    resource_id = request.args.get('resource_id', None)
    
    return ceilometer.get_cpu_util(timestamp_begin,timestamp_end,resource_id)
    #return json.dumps({'response' : 'echo', 'timestamp_begin' : timestamp_begin, 'timestamp_end' : timestamp_end, 'resource_id' : resource_id})

@app.route('/add_alarm',  methods=['POST'])
def add_alarm():
    resource = request.args.get('resource')
    operation = request.args.get('operation')
    threshold = request.args.get('threshold')

    return json.dumps({'response' : 'echo', 'resource' : resource, 'threshold' : threshold, 'operation' : operation})


if __name__ == '__main__':
#    import threading

#    worker = threading.Thread(target=db_worker)
#    worker.daemon = True
#    worker.start()
    
    app.run(host='0.0.0.0', port=9090)

