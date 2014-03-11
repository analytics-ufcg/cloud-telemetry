import env
from keystone_client import KeystoneClient

from ceilometerclient import client

class CeilometerClient:

    def __init__(self):
        self.ceilometer = client.get_client(env.CEILOMETER_API_VERSION, os_username=env.OS_USERNAME, os_password=env.OS_PASSWORD, os_tenant_name=env.OS_TENANT_NAME, os_auth_url=env.OS_AUTH_URL)

    def get_cpu_util(self, timestamp_begin=None, timestamp_end=None, resource_id=None, project_id=None):
        query = []

        if any([timestamp_begin, timestamp_end, resource_id, project_id]):
            if timestamp_begin:
                query.append({'field':'timestamp', 'op':'gt', 'value':timestamp_begin})
        
            if timestamp_end:
                query.append({'field':'timestamp', 'op':'lt', 'value':timestamp_end})

            if resource_id:
                query.append({'field':'resource_id', 'op':'eq', 'value':resource_id})

            if project_id:
                query.append({'field':'project_id', 'op':'eq', 'value':project_id})

        data = self.ceilometer.samples.list('cpu_util', query)

        ret = []
        for d in data:
            ret.append({ 'resource_id' : d.resource_id, 'timestamp' : d.timestamp, 'cpu_util_percent' : d.counter_volume })
    
        return ret

    def get_cpu_util_flavors(self, timestamp_begin=None, timestamp_end=None, resource_id=None, project_id=None):
        query = []

        if any([timestamp_begin, timestamp_end, resource_id, project_id]):
            if timestamp_begin:
                query.append({'field':'timestamp', 'op':'gt', 'value':timestamp_begin})

            if timestamp_end:
                query.append({'field':'timestamp', 'op':'lt', 'value':timestamp_end})

            if resource_id:
                query.append({'field':'resource_id', 'op':'eq', 'value':resource_id})

            if project_id:
                query.append({'field':'project_id', 'op':'eq', 'value':project_id})

        data = self.ceilometer.samples.list('cpu_util', query)
        ret = []
        for d in data:
            ret.append({'VM': d.resource_id, 'Cores': d.resource_metadata['flavor.vcpus'], 'CPU_UTIL': d.counter_volume})
        return ret

    def set_alarm(self, name, meter, threshold, operator, period, evaluation_period):
        try:
            alarm = self.ceilometer.alarms.create(name=name, meter_name=meter, threshold=threshold, comparison_operator=operator, period=period, evaluation_periods=evaluation_period, alarm_actions='log://')
            return alarm
        except:
            return None

    def get_alarms_history(self, timestamp_begin=None, timestamp_end=None):
        query = []
        
        if any([timestamp_begin, timestamp_end]):
            if timestamp_begin:
                query.append({'field':'timestamp', 'op':'gt', 'value':timestamp_begin})

            if timestamp_end:
                query.append({'field':'timestamp', 'op':'lt', 'value':timestamp_end})

        alarms = self.ceilometer.alarms.list()

        ret = []
        for alarm in alarms:
            ret.append({ 'alarm_name':alarm.name, 'alarm_id':alarm.alarm_id, 'history':[event.__dict__['_info'] for event in self.ceilometer.alarms.get_history(alarm.alarm_id, query)] })

        return ret


