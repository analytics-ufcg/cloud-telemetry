import time, datetime, psutil

def host_data(interval=1, percpu=False):
    memory = []
    cpu = get_cpu_percent(interval, percpu)
    memory.append(get_virtual_memory())
    disk = get_disk_usage()
    return {"cpu":cpu, "memory":memory, "disk":disk}


def get_cpu_percent(interval, percpu):
    return psutil.cpu_percent(interval, percpu)

def get_virtual_memory():
    memory = {}
    memory["percent"] = psutil.virtual_memory().percent

    return memory

def get_disk_usage():
    disks = []
    devices = len(psutil.disk_partitions())

    for i in range(devices):
        disk_device_data = {}
        path = psutil.disk_partitions()[i].mountpoint
        disk_device_data["device"] = path
        disk_device_data["percent"] = psutil.disk_usage(path).percent
        
        disks.append(disk_device_data)
        
    return disks

