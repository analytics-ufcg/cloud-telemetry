import time, datetime, psutil

from host_data import HostDataHandler 

def store_host_data(interval=1, percpu=False, path='/'):
    db = HostDataHandler()
    while True:
        memory = []
        disk = []
            
        cpu = get_cpu_percent(interval, percpu)
        memory.append(get_virtual_memory())
        disk.append(get_disk_usage(path))

        db.save_data_db(cpu, memory, disk)

        time.sleep(60)


def get_cpu_percent(interval, percpu):
    return psutil.cpu_percent(interval, percpu)

def get_virtual_memory():
    memory = {}

    memory["total"] = psutil.virtual_memory().total/1024
    memory["available"] = psutil.virtual_memory().available/1024
    memory["free"] = psutil.virtual_memory().free/1024

    return memory

def get_disk_usage(path):
    disk = {}

    disk["total"] = psutil.disk_usage(path).total/1024
    disk["used"] = psutil.disk_usage(path).used/1024
    disk["free"] = psutil.disk_usage(path).free/1024
    disk["percent"] = psutil.disk_usage(path).percent

    return disk

