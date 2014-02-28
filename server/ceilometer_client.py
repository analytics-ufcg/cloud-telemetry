from ceilometerclient import client

from keystone_client import KeystoneClient

from time import gmtime, strftime
import json, datetime

API_VERSION = '2'
OS_USERNAME = 'admin'
OS_PASSWORD = 'pass'
OS_TENANT_NAME = 'demo'
OS_AUTH_URL = 'http://localhost:5000/v2.0'

class CeilometerClient:

    def __init__(self):
        self.ceilometer = client.get_client(API_VERSION, os_username=OS_USERNAME, os_password=OS_PASSWORD, os_tenant_name=OS_TENANT_NAME, os_auth_url=OS_AUTH_URL)
        self.keystone = KeystoneClient(OS_USERNAME, OS_PASSWORD, OS_AUTH_URL)
        #TERRIBLE - FIX THIS
        d = datetime.datetime.now() + datetime.timedelta(seconds=-60*60)
        self.last_data = self.ceilometer.samples.list('cpu_util', [{'field' : 'timestamp', 'op' : 'gt', 'value' : d.strftime("%Y-%m-%dT%H:%M:%S")}])

    def get_projects_with_cpu_util(self):
        projects = self.keystone.projects

        ret = { 'name' : 'cloud', 'children' : [] }

        for p in projects.keys():
            proj = { 'name' : projects[p], 'children' : [] }

            for d in self.last_data:
                if d.project_id == p and not any(d.resource_id in k.values() for k in proj['children']):
                    proj['children'].append({ 'resource_id' : d.resource_id, 'cpu_util_percent' : d.counter_volume })

            ret['children'].append(proj)

        return json.dumps(ret)


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
            ret.append({ 'resource_id' : d.resource_id, 'timestamp' : d.timestamp, 'cpu_util_percent' : d.counter_volume })
    
        return json.dumps(ret)

    def set_alarm(self, name, meter, threshold, operator, period, evaluation_period):
        try:
            alarm = self.ceilometer.alarms.create(name=name, meter_name=meter, threshold=threshold, comparison_operator=operator, period=period, evaluation_periods=evaluation_period, alarm_actions='log://')
            return alarm
        except:
            return None
      
