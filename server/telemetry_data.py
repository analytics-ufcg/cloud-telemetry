from openstack.ceilometer_client import CeilometerClient
from openstack.keystone_client import KeystoneClient
from openstack.nova_client import NovaClient
from mysql_util import get_latest_cpu_util_from_database
import json

class DataHandler:

    def __init__(self):
        self.ceilometer = CeilometerClient()
        self.keystone = KeystoneClient()
        self.__nova = NovaClient()

    def projects(self):
        return json.dumps(self.keystone.projects)

    def cpu_util_from(self, timestamp_begin=None, timestamp_end=None, resource_id=None):
        return json.dumps(self.ceilometer.get_cpu_util(timestamp_begin, timestamp_end, resource_id))

    def projects_with_instances_and_cpu_util(self):
        projects = self.keystone.tenants

        ret = { 'name' : 'cloud', 'children' : [] }

        for p in projects:
            proj = { 'name' : p.name, 'children' : [] }

            instances = self.__nova.instances(p.name)

            cpu_data = get_latest_cpu_util_from_database(project_id=p.id, limit=len(instances))
            for sample in cpu_data:                 
                proj['children'].append({ 'resource_id' : sample[4], 'cpu_util_percent' : sample[6] })

            ret['children'].append(proj)

        return json.dumps(ret)

