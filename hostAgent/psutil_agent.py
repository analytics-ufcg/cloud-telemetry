import time, datetime
from db_agent import DbAgent
from host_data import HostData

class PsutilAgent:

    def __init__(self):
        self.hostData = HostData()
        self.dbAgent = DbAgent()


    def get_host_data(self, interval=1, percpu=False, path='/'):
        while True:
            memory = []
            disk = []
            
            cpu = self.hostData.get_cpu_percent(interval, percpu)
            memory.append(self.hostData.get_virtual_memory())
            disk.append(self.hostData.get_disk_usage(path))

            self.dbAgent.save_data_db(cpu, memory, disk)

            time.sleep(300)
