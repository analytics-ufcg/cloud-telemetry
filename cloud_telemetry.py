from flask import Flask, render_template, request, make_response

#from ceilometer_client import CeilometerClient
#from local_db_worker import db_worker

import json

app = Flask(__name__)
#ceilometer = CeilometerClient()

@app.route('/')
def home(name=None):
    return render_template('index.html', name=name)

@app.route('/projects')
def projects():
    resp = make_response(ceilometer.get_projects_with_cpu_util())
    resp.headers['Access-Control-Allow-Origin'] = "*" 

    return resp

@app.route('/cpu_util')  
def cpu_util():
    timestamp_begin = request.args.get('timestamp_begin', None)
    timestamp_end = request.args.get('timestamp_end', None)
    resource_id = request.args.get('resource_id', None)
    
    resp = make_response(ceilometer.get_cpu_util(timestamp_begin,timestamp_end,resource_id))
    resp.headers['Access-Control-Allow-Origin'] = "*" 

    return resp
    #return json.dumps({'response' : 'echo', 'timestamp_begin' : timestamp_begin, 'timestamp_end' : timestamp_end, 'resource_id' : resource_id})

@app.route('/add_alarm',  methods=['POST'])
def add_alarm():
    name = request.args.get('name')
    resource = request.args.get('resource')
    operator = request.args.get('operator')
    threshold = request.args.get('threshold')
    period = request.args.get('period')

    #resp = make_response(json.dumps({'resource' : resource, 'threshold' : threshold, 'operation' : operation}))
    
    alarm = ceilometer.set_alarm(name, resource, threshold, operator, period, 1)
    
    if alarm:
        resp = make_response(json.dumps({'alarm_id' : alarm.alarm_id}))
    else:
        resp = make_response(json.dumps({'alarm_id' : 'null'}))

    resp.headers['Access-Control-Allow-Origin'] = "*" 

    return resp
    


if __name__ == '__main__':
#    import threading

#    worker = threading.Thread(target=db_worker)
#    worker.daemon = True
#    worker.start()
    
    app.run(host='0.0.0.0', port=9090)

