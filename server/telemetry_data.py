from openstack.ceilometer_client import CeilometerClient
from openstack.keystone_client import KeystoneClient

import json

class DataHandler:

    def __init__(self):
        self.ceilometer = CeilometerClient()
        self.keystone = KeystoneClient()

    def get_projects(self):
        return json.dumps(self.keystone.projects)

    def get_cpu_util_from(self, timestamp_begin=None, timestamp_end=None, resource_id=None):
        return json.dumps(self.ceilometer.get_cpu_util(timestamp_begin, timestamp_end, resource_id))

#    def get_projects_with_cpu_util(self):
#        projects = self.keystone.projects
#
#        ret = { 'name' : 'cloud', 'children' : [] }
#
#        for p in projects.keys():
#            proj = { 'name' : projects[p], 'children' : [] }
#
#            for d in self.last_data:
#                if d.project_id == p and not any(d.resource_id in k.values() for k in proj['children']):
#                    proj['children'].append({ 'resource_id' : d.resource_id, 'cpu_util_percent' : d.counter_volume })
#
#            ret['children'].append(proj)
#
#        return json.dumps(ret)

