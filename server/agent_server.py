from host_data import HostDataHandler 
import json, requests, time

def store_host_data(hosts, interval=1, percpu=False):
    db = HostDataHandler()

    while True:
        for host in hosts:
            data = get_host_metric(host)

            if(data == 'Unknown host'):
                continue

            cpu = data["cpu"]
            memory = data["memory"]
            disk = data["disk"]

            db.save_data_db(cpu, memory, disk, host)

        time.sleep(60)


def get_host_metric(host):
    url = "http://%s:6556/host_data" % host
    try:
        r = requests.get(url)
        if r.status_code == 200:
            return r.json()
        else:
            return 'Unknown host'
    except:
        return 'Unknown host'
