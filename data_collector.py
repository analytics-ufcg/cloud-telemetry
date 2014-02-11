from ceilometerclient import client

import json

class DataCollector:

  def __init__(self):
    try: 
      self.ceilometer = client.get_client('2', os_username='admin', os_password='pass', os_tenant_name='demo', os_auth_url='http://localhost:5000/v2.0')
    except:
      print 'could not get Ceilometer client'

  def get_cpu_util_data(self, timestamp_begin=None, timestamp_end=None, resource_id=None):
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
      ret.append(json.dumps({ 'resource_id' : d.resource_id, 'timestamp' : d.timestamp, 'cpu_util_percent' : d.counter_volume }))
    
    return json.dumps(ret)


