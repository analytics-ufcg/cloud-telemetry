import sys, time
from host_data import HostData
import bd_agent

class AgentPsutil:

    def __init__(self):
        self.hostData = HostData()

    def get_host_data(self, interval, percpu=False, path='/'):
        
       while True:

            virtualMemory = []
            disk = []

            cpu = self.hostData.get_cpu_percent(interval, percpu))
            virtualMemory.append(self.hostData.get_virtual_memory())
            disk.append(self.hostData.get_disk_usage(path))

            bd_agent.saveData(cpu, virtualMemory, disk)

            time.sleep(300)
