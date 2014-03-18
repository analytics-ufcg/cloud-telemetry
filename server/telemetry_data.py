from openstack.ceilometer_client import CeilometerClient
from openstack.keystone_client import KeystoneClient
from openstack.nova_client import NovaClient
from mysql_util import get_latest_cpu_util_from_database
import json, ast, smtplib

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
        return self.__ceilometer.set_alarm(name, resource, threshold, operator, period, 1)

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
