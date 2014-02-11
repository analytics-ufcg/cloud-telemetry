from ceilometerclient import client

import json

class DataCollector:

  def __init__(self):
    try: 
      self.ceilometer = client.get_client('2', os_username='admin', os_password='pass', os_tenant_name='demo', os_auth_url='http://localhost:5000/v2.0')
    except:
      print 'could not get Ceilometer client'

  def get_cpu_util_data(self):
    data = self.ceilometer.samples.list('cpu_util')

    ret = []
    for d in data:
      ret.append(json.dumps({ 'resource_id' : d.resource_id, 'timestamp' : d.timestamp, 'cpu_util_percent' : d.counter_volume }))
    
    return json.dumps(ret)


