from ceilometerclient import client

from keystone_client import KeystoneClient

import json

API_VERSION = '2'
OS_USERNAME = 'admin'
OS_PASSWORD = 'pass'
OS_TENANT_NAME = 'demo'
OS_AUTH_URL = 'http://localhost:5000/v2.0'

class CeilometerClient:

    def __init__(self):
        self.ceilometer = client.get_client(API_VERSION, os_username=OS_USERNAME, os_password=OS_PASSWORD, os_tenant_name=OS_TENANT_NAME, os_auth_url=OS_AUTH_URL)
        self.keystone = KeystoneClient(OS_USERNAME, OS_PASSWORD, OS_AUTH_URL)

    def get_cpu_util(self, timestamp_begin=None, timestamp_end=None, resource_id=None):
        query = []

        if any([timestamp_begin, timestamp_end, resource_id]):
            if timestamp_begin:
                query.append({'field':'timestamp', 'op':'gt', 'value':timestamp_begin})
        
            if timestamp_end:
                query.append({'field':'timestamp', 'op':'lt', 'value':timestamp_end})

            if resource_id:
                query.append({'field':'resource_id', 'op':'eq', 'value':resource_id})

        data = self.ceilometer.samples.list('cpu_util', query)

        ret = []
        for d in data:
            ret.append(json.dumps({ 'resource_id' : d.resource_id, 'timestamp' : d.timestamp, 'cpu_util_percent' : d.counter_volume, 'project_id' : d.project_id, 'project_name' : self.keystone.projects.get(d.project_id) }))
    
        return json.dumps(ret)

    def set_alarm(self, name, meter, threshold, operator, period, evaluation_period):
        self.ceilometer.alarms.create(name=name, meter_name=meter, threshold=threshold, comparison_operator=operator, period=period, evaluation_periods=evaluation_period, alarm_actions='log://')
      
