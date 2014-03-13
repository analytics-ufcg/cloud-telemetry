import psutil

class HostData:


    def get_cpu_percent(self, interval, percpu):
        return psutil.cpu_percent(interval, percpu)

    def get_virtual_memory(self):
        memory = {}

        memory["total"] = psutil.virtual_memory().total/1024
        memory["available"] = psutil.virtual_memory().available/1024
        memory["free"] = psutil.virtual_memory().free/1024

        return memory


    def get_disk_usage(self, path):
        disk = {}

        disk["total"] = psutil.disk_usage(path).total/1024
        disk["used"] = psutil.disk_usage(path).used/1024
        disk["free"] = psutil.disk_usage(path).free/1024
        disk["percent"] = psutil.disk_usage(path).percent

        return disk


