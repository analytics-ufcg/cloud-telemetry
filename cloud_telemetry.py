from flask import Flask, render_template, request
#from data_collector import DataCollector

import json

app = Flask(__name__)
#collector = DataCollector()

@app.route('/')
def home(name=None):
    return render_template('index.html', name=name)

@app.route('/cpu_util')  
def cpu_util():
    timestamp = request.args.get('timestamp', None)
    resource_id = request.args.get('resource_id', None)
    
    return json.dumps({'response' : 'echo', 'timestamp' : timestamp, 'resource_id' : resource_id})

@app.route('/add_alarm',  methods=['POST'])
def add_alarm():
    resource = request.args.get('resource')
    operation = request.args.get('operation')
    threshold = request.args.get('threshold')

    return json.dumps({'response' : 'echo', 'resource' : resource, 'threshold' : threshold, 'operation' : operation})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9090)
