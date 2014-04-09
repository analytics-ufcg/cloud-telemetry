from flask import Flask, render_template, request, make_response

from telemetry_data import DataHandler

import json, requests

LOGFILE = 'telemetry_server'

app = Flask(__name__)
data_handler = DataHandler()

HOSTS = ['150.165.15.4','150.165.15.38', '150.165.15.42']

@app.route('/projects')
def projects():
    resp = make_response(data_handler.projects())
    resp.headers['Access-Control-Allow-Origin'] = "*" 

    return resp

@app.route('/projects/instances')
def project_instances():
    resp = make_response(data_handler.projects_with_instances_and_cpu_util())
    resp.headers['Access-Control-Allow-Origin'] = "*" 

    return resp

@app.route('/hosts')
def hosts():
    data = {'name':'hosts','children':[]}
    for h in HOSTS:
        host = {'ip':h}
        data['children'].append(host)
    resp = make_response(json.dumps(data))
    resp.headers['Access-Control-Allow-Origin'] = "*"
    return resp

@app.route('/hosts/instances')
def hosts_instances():
    host_name = request.args.get('host_name', None)

    resp = None
    if not host_name:
        resp = make_response(json.dumps({'error' : 'host name cannot be empty'}), 400)
    else:
        resp = make_response(json.dumps(data_handler.instances_from_host(host_name)))

    resp.headers['Access-Control-Allow-Origin'] = "*"
    return resp       

@app.route('/hosts_cpu_util')
def hosts_cpu_util():
    timestamp_begin = request.args.get('timestamp_begin', None)
    timestamp_end = request.args.get('timestamp_end', None)

    data = []
    for host in HOSTS:
        url = "http://%s:6556/host_cpu" % host
        if timestamp_begin:
            url += "?timestamp_begin=%s" % timestamp_begin
        
            if timestamp_end:
                url += "&timestamp_end=%s" % timestamp_end

        r = requests.get(url)
        if r.status_code == 200:
            dic = {}
            dic['host_address'] = host
            dic['data'] = r.json()
            data.append(dic)
        else:
            print 'Unknown host'

    resp = make_response(json.dumps(data))    
    resp.headers['Access-Control-Allow-Origin'] = "*" 

    return resp

@app.route('/hosts_memory')
def hosts_memory():
    timestamp_begin = request.args.get('timestamp_begin', None)
    timestamp_end = request.args.get('timestamp_end', None)

    data = []
    for host in HOSTS:
        url = "http://%s:6556/host_memory" % host
        if timestamp_begin:
            url += "?timestamp_begin=%s" % timestamp_begin

            if timestamp_end:
                url += "&timestamp_end=%s" % timestamp_end

        r = requests.get(url)
        if r.status_code == 200:
            dic = {}
            dic['host_address'] = host
            dic['data'] = r.json()
            data.append(dic)
        else:
            print 'Unknown host'

    resp = make_response(json.dumps(data))
    resp.headers['Access-Control-Allow-Origin'] = "*"

    return resp

@app.route('/hosts_disk')
def hosts_disk():
    timestamp_begin = request.args.get('timestamp_begin', None)
    timestamp_end = request.args.get('timestamp_end', None)

    data = []
    for host in HOSTS:
        url = "http://%s:6556/host_disk" % host
        if timestamp_begin:
            url += "?timestamp_begin=%s" % timestamp_begin

            if timestamp_end:
                url += "&timestamp_end=%s" % timestamp_end

        r = requests.get(url)
        if r.status_code == 200:
            dic = {}
            dic['host_address'] = host
            dic['data'] = r.json()
            data.append(dic)
        else:
            print 'Unknown host'

    resp = make_response(json.dumps(data))
    resp.headers['Access-Control-Allow-Origin'] = "*"

    return resp


@app.route('/hosts_recommendation')
def hosts_recommendation():
    r_cpu = hosts_cpu_util()
    r_memory = hosts_memory() 
    r_disk = hosts_disk()

    resp = make_response(data_handler.hosts_recommendation(r_cpu.data, r_memory.data , r_disk.data))
    resp.headers['Access-Control-Allow-Origin'] = "*"
    return resp


@app.route('/cpu_util')  
def cpu_util():
    timestamp_begin = request.args.get('timestamp_begin', None)
    timestamp_end = request.args.get('timestamp_end', None)
    resource_id = request.args.get('resource_id', None)
    
    resp = make_response(data_handler.cpu_util_from(timestamp_begin, timestamp_end, resource_id))
    resp.headers['Access-Control-Allow-Origin'] = "*" 

    return resp

@app.route('/cpu_util_flavors')
def cpu_util_flavors():
    timestamp_begin = request.args.get('timestamp_begin', None)
    timestamp_end = request.args.get('timestamp_end', None)

    resp = make_response(data_handler.cpu_util_flavors(timestamp_begin, timestamp_end))
    resp.headers['Access-Control-Allow-Origin'] = "*"

    return resp

@app.route('/alarms_history')
def alarms_history():
    timestamp_begin = request.args.get('timestamp_begin', None)
    timestamp_end = request.args.get('timestamp_end', None)

    resp = make_response(data_handler.alarms_history(timestamp_begin, timestamp_end))
    resp.headers['Access-Control-Allow-Origin'] = "*"

    return resp

@app.route('/add_alarm',  methods=['POST'])
def add_alarm():
    name = request.args.get('name')
    resource = request.args.get('resource')
    operator = request.args.get('operator')
    threshold = request.args.get('threshold')
    period = request.args.get('period')
    evalperiod = request.args.get('evalperiod')

    alarm = data_handler.add_alarm(name, resource, threshold, operator, period, evalperiod)
    
    if alarm:
        resp = make_response(json.dumps({'alarm_id' : alarm.alarm_id}))
    else:
        resp = make_response(json.dumps({'alarm_id' : 'null'}))

    resp.headers['Access-Control-Allow-Origin'] = "*" 

    return resp
    
@app.route('/alarm', methods=['POST'])
def alarm():
    data_handler.alarm_email(request.data)
    return 'passou'

@app.route('/alarm_description')
def alarm_description():
    resp = make_response(data_handler.alarm_description())
    resp.headers['Access-Control-Allow-Origin'] = "*"
    return resp

@app.route('/host_metrics')
def metrics():
    project = request.args.get('project')
    resp = make_response(data_handler.host_metrics(project))
    resp.headers['Access-Control-Allow-Origin'] = "*"

    return resp


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=9090)

