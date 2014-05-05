from flask import Flask, render_template, make_response, request

import requests, json

app = Flask(__name__)

__SERVER_ADDRESS = 'http://150.165.15.4:9090'

@app.route('/projects')
def projects():
    return forward_request(request)

@app.route('/projects/instances')
def projects_instances():
    return forward_request(request)

@app.route('/cpu_util')
def cpu_util():
    return forward_request(request)

@app.route('/cpu_util_flavors')
def cpu_util_flavors():
    return forward_request(request)

@app.route('/alarms_history')
def alarms_history():
    return forward_request(request)

@app.route('/hosts')
def hosts():
    return forward_request(request)

@app.route('/hosts/instances')
def hosts_instances():
    return forward_request(request)

@app.route('/hosts_cpu_util')
def hosts_cpu_util():
    return forward_request(request)

@app.route('/hosts_memory')
def hosts_memory():
    return forward_request(request)

@app.route('/hosts_disk')
def hosts_disk():
    return forward_request(request)

@app.route('/hosts_recommendation')
def hosts_recommendation():
    return forward_request(request)

@app.route('/host_metrics')
def metrics():
    return forward_request(request)

@app.route('/alarm_description')
def alarm_description():
    return forward_request(request)

@app.route('/alarm_delete')
def alarm_delete():
    return forward_request(request)

@app.route('/add_alarm',  methods=['POST'])
def add_alarm():
    return forward_request(request)    

@app.route('/live_migration', methods=['POST'])
def live_migration():
    return forward_request(request)

@app.route('/host_migration')
def can_migrate():
    return forward_request(request)

@app.route('/benchmark_data')
def benchmark_data():
    return forward_request(request)

@app.route('/get_benchmark')
def get_benchmark():
    return forward_request(request)

@app.route('/start_instance_bench')
def start_instance_bench():
    return forward_request(request)

@app.route('/get_benchmark_status')
def get_benchmark_status():
    return forward_request(request) 

@app.route('/repeat_benchmark')
def repeat_benchmark():
    return forward_request(request)

def forward_request(req):
    url = req.url
    path = req.path
    print __SERVER_ADDRESS + path + url[url.find(path)+len(path):]
    r = None
    if req.method == 'POST':
        r = requests.post(__SERVER_ADDRESS + path + url[url.find(path)+len(path):])
    else:
        r = requests.get(__SERVER_ADDRESS + path + url[url.find(path)+len(path):])
    
    if r.status_code == 200:
        resp = make_response(json.dumps(r.json()))
    else:
        resp = make_response(json.dumps({ 'error' : r.status_code }))

    resp.headers['Access-Control-Allow-Origin'] = "*"

    return resp    


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=9090)
