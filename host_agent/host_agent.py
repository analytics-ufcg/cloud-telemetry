import time, datetime, psutil

from host_data import HostDataHandler 

def store_host_data(interval=1, percpu=False):
    db = HostDataHandler()
    while True:
        memory = []
        disk = []
            
        cpu = get_cpu_percent(interval, percpu)
        memory.append(get_virtual_memory())
        disk.append(get_disk_usage())

        db.save_data_db(cpu, memory, disk)

        time.sleep(60)


def get_cpu_percent(interval, percpu):
    return psutil.cpu_percent(interval, percpu)

def get_virtual_memory():
    memory = {}

    #memory["total"] = psutil.virtual_memory().total/1024
    #memory["used"] = psutil.virtual_memory().used/1024
    #memory["free"] = psutil.virtual_memory().free/1024
    memory["percent"] = psutil.virtual_memory().percent

    return memory

def get_disk_usage():
    disk = {}
    devices = len(psutil.disk_partitions())

    for i in range(devices):
        path = psutil.disk_partitions()[i].mountpoint
        
        #disk["total"] = psutil.disk_usage(path).total/1024
        #disk["used"] = psutil.disk_usage(path).used/1024
        #disk["free"] = psutil.disk_usage(path).free/1024
        disk["device"] = path
        disk["percent"] = psutil.disk_usage(path).percent
        
    return disk

