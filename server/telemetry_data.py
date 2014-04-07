from openstack.ceilometer_client import CeilometerClient
from openstack.keystone_client import KeystoneClient
from openstack.nova_client import NovaClient
from mysql_util import get_latest_cpu_util_from_database
import json, ast, smtplib, math

import analytics.recommendations

def send_email(from_addr, to_addr_list, cc_addr_list,
              subject, message,
              login, password,
              smtpserver='smtp.gmail.com:587'):
    header  = 'From: %s\n' % from_addr
    header += 'To: %s\n' % ','.join(to_addr_list)
    header += 'Cc: %s\n' % ','.join(cc_addr_list)
    header += 'Subject: %s\n\n' % subject
    message = header + message


    server = smtplib.SMTP(smtpserver)
    server.starttls()
    server.login(login,password)
    problems = server.sendmail(from_addr, to_addr_list, message)
    server.quit()
    return problems

class DataHandler:

    def __init__(self):
        self.__ceilometer = CeilometerClient()
        self.__keystone = KeystoneClient()
        self.__nova = NovaClient()

    def projects(self):
        return json.dumps(self.__keystone.projects)

    def cpu_util_from(self, timestamp_begin=None, timestamp_end=None, resource_id=None):
        return json.dumps(self.__ceilometer.get_cpu_util(timestamp_begin, timestamp_end, resource_id))

    def cpu_util_flavors(self, timestamp_begin=None, timestamp_end=None):
        data = self.__ceilometer.get_cpu_util_flavors(timestamp_begin, timestamp_end)
        ret = analytics.recommendations.recomenda_flavor(data)
        return json.dumps(ret)

    def projects_with_instances_and_cpu_util(self):
        projects = self.__keystone.tenants

        ret = { 'name' : 'cloud', 'children' : [] }

        for p in projects:
            proj = { 'name' : p.name, 'children' : [] }

            instances = self.__nova.instances(p.name)

            cpu_data = get_latest_cpu_util_from_database(project_id=p.id, limit=len(instances))
            for sample in cpu_data:                 
                proj['children'].append({ 'resource_id' : sample[4], 'cpu_util_percent' : sample[6] })

            ret['children'].append(proj)

        return json.dumps(ret)

    def alarms_history(self, timestamp_begin=None, timestamp_end=None):
        return json.dumps(self.__ceilometer.get_alarms_history(timestamp_begin, timestamp_end))

    def add_alarm(self, name, resource, threshold, operator, period, ev_period):
        return self.__ceilometer.set_alarm(name, resource, threshold, operator, period, ev_period)

    def alarm_email(self, data_requested):
        alarm_id = ast.literal_eval(data_requested)['alarm_id']
        userId = self.__ceilometer.get_alarm_userid(alarm_id)
        projectId = self.__ceilometer.get_alarm_projectid(alarm_id)
        userEmail = self.__keystone.get_user_email(userId, projectId)

        send_email('cloudtelemetry@gmail.com', 
                        [userEmail],
                        [],
                        'Alert Telemetry Cloud',
                        'Email disparado pelo alarme!!!', 
                        'cloudtelemetry@gmail.com',
                        '4n4lyt1cs')

    def host_metrics(self, project):
        return self.__nova.metrics(project)

    def hosts_recommendation(self, r_cpu, r_memory , r_disk):
        resource = []
        ret = {}
        r_cpu = json.loads(r_cpu)
        r_memory = json.loads(r_memory)
        r_disk = json.loads(r_disk)
        for host in r_cpu:
            host_http = host["host_address"]
            if host["data"] is None:
                continue
            for data in host["data"]:
                resource.append(data["data"])
            resource = sorted(resource)
            if(len(resource)%2 == 0):
                index = len(resource)/2
                mediana = (resource[index-1] + resource[index+1])/2
            else:
                mediana = resource[int(math.ceil(len(resource)/2))]

            if mediana >= 95:
                ret[host_http] ="sobrecarregado"
            else:
                resource = []
                for host_mem in r_memory:
                    if(host["host_address"]  == host_mem["host_address"]):
                        for data in host_mem["data"]:
                            for value in json.loads(data["data"]):
                                resource.append(value["percent"])
                        resource = sorted(resource)

                if(len(resource)%2 == 0):
                    index = len(resource)/2
                    mediana = (resource[index-1] + resource[index+1])/2
                else:
                    mediana = resource[int(math.ceil(len(resource)/2))]

                if mediana >= 95:
                    ret[host_http] ="sobrecarregado"
                else:
                    ret[host_http] ="normal"       
        return json.dumps(ret)
        #return json.dumps(cpu)

    def instances_from_host(self, host_name):
        ret = []
        projects = self.__keystone.projects
        for project in projects:
            instances = self.__nova.instances(project['name'])
            for instance in instances:
                print instance._info
                if instance._info['os-extended-server-attributes:host'] == host_name:
                    ret.append({'instance_name' : instance.name, 'instance_id' : instance.id})
        return ret   

