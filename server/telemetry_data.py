from openstack.ceilometer_client import CeilometerClient
from openstack.keystone_client import KeystoneClient
from openstack.nova_client import NovaClient
from host_data import HostDataHandler
from benchmark_data import BenchmarkDataHandler


import json, ast, smtplib, math, requests

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

class MigrateException(Exception):
    
    def __init__(self,error,message):
        Exception.__init__(self)
        self.error = error
        self.message = message

class DataHandler:

    def __init__(self):
        self.__ceilometer = CeilometerClient()
        self.__keystone = KeystoneClient()
        self.__nova = NovaClient()
        self.__hosts_db = HostDataHandler()
        self.__benchmark_db = BenchmarkDataHandler()

    def projects(self):
        return json.dumps(self.__keystone.projects)

    def sugestion(self):
        project_list = [ a['name'] for a in json.loads(self.projects()) ]
        host_vm_info = self.__nova.vm_info(project_list)
        hosts_critical =[]
        servers_critical = self.__nova.critical_instances(project_list)
        desligar = {}
        migracoes = {}
        copia_hosts = host_vm_info[:]
        for host in host_vm_info:
	 hostname = host.keys()[0]
	 for server in servers_critical:
		if((server in host[hostname]['nomes'].keys()) and(host.keys()[0] not in hosts_critical)):
			hosts_critical.append(host.keys()[0])
	desligar = {}
	migracoes = {}
	copia_hosts = host_vm_info[:]
	for e in host_vm_info:
		dic_aux = e.copy()
		chave = e.keys()[0]
		if(chave not in hosts_critical):
			if( len( dic_aux[chave]['vms'].keys() ) > 0 ):
				vms_aux = dic_aux[chave]['vms'].copy()
				copia_hosts.remove(e)
				migra = False
				migracoes[chave] = {}
				for i in vms_aux:
				   for j in copia_hosts:
					   if(i not in servers_critical):
						   migra = False
						   if( (j[j.keys()[0]]['Livre'][0] >= vms_aux[i][0]) and (j[j.keys()[0]]['Livre'][1] >= vms_aux[i][1])  and (j[j.keys()[0]]['Livre'][2] >= vms_aux[i][2])):
							   valores = [ j[j.keys()[0]]['Livre'][0] - vms_aux[i][0], j[j.keys()[0]]['Livre'][1] - vms_aux[i][1], j[j.keys()[0]]['Livre'][2] - vms_aux[i][2] ]
							   j[j.keys()[0]]['Livre'] = valores
							   dic = j[j.keys()[0]]['vms']
							   dic[vms_aux.keys()[0]] = vms_aux[vms_aux.keys()[0]]
							   j[j.keys()[0]]['vms'] = dic
							   j[j.keys()[0]]['nomes'][i] = dic_aux[chave]['nomes'][i]
							   migracoes[chave][ e[chave]['nomes'].get(i) ] = j.keys()[0]
							   migra = True
							   break
						   else:
							   continue
					   else:
						   continue
				   if migra == False:
					   migracoes[chave][ e[chave]['nomes'].get(i) ] = None
					   desligar[chave] = False
				if not chave in desligar:
				   desligar[chave] = True
			else:
			   copia_hosts.remove(e)
			   desligar[chave] = True
			   continue
		else:
		    desligar[chave] = False

	saida = {}
	saida['Hosts']= desligar
	saida['Migracoes'] = migracoes
        return json.dumps(saida)    

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

            for i in instances:                 
                proj['children'].append({ 'resource_id' : i.id, 'instance_name' : i.name })

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

    def alarm_description(self):
        return json.dumps(self.__ceilometer.get_alarm_parameters())
    
    def delete_alarm(self, alarm_id):
        return json.dumps(self.__ceilometer.delete_alarms(alarm_id))

    def hosts_cpu(self, timestamp_begin, timestamp_end):
        return self.__hosts_db.get_data_db('Cpu_Util', timestamp_begin, timestamp_end)

    def hosts_memory(self, timestamp_begin, timestamp_end):
        return self.__hosts_db.get_data_db('Memory', timestamp_begin, timestamp_end)

    def hosts_disk(self, timestamp_begin, timestamp_end):
        return self.__hosts_db.get_data_db('Disk', timestamp_begin, timestamp_end)

    def host_metrics(self, project):
        return self.__nova.metrics(project)

    def host_aggregates(self, project):
        return self.__nova.host_aggregates(project)

    def resource_host(self, host):
        return self.__nova.resource_host(host)


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

    def migrate_to_host(self, project_name, host_name, instance_id):
        host_vm = self.__nova.vm_hostname(project_name,instance_id)
        if host_vm._info['os-extended-server-attributes:host'] == host_name:
            raise MigrateException(400,"Migracao para o mesmo destino")
	elif host_vm._info['os-extended-server-attributes:host'] == 'truta' and host_name != 'truta':
            raise MigrateException(500,"Migracao de host para compute node")
        else:
            self.__nova.vm_migration(project_name,host_name,instance_id)
            return True


    def get_benchmark_bd(self):
        ret = self.__benchmark_db.get_data_db()
        return ret


    def start_instance_bench(self, project):
        return self.__nova.start_instance_bench(project)


    def get_benchmark(self, project):
        benchmark_ip = self.__nova.get_benchmark_ip(project)
        data = requests.get('http://'+benchmark_ip+':5151/get_benchmarking')
        return data.json()
 
    def get_benchmark_status(self, project):
        benchmark_ip = self.__nova.get_benchmark_ip(project)
        data = requests.get('http://'+benchmark_ip+':5151/get_status')
        return data.text

    def repeat_benchmark(self, project):
        benchmark_ip = self.__nova.get_benchmark_ip(project)
        data = requests.get('http://'+benchmark_ip+':5151/start_benchmarking')
        return data.text

    def remove_benchmark_instance(self):
        id = self.__nova.benchmark_id()
        if id == None:
            return "sem instancia benchmark"
        else:
            remove = self.__nova.remove_instance(id)
            return remove

    def hosts_aggregation_cpu(self, timestamp_begin=None, timestamp_end=None):
        ret = []

        cpu_data = self.hosts_cpu(timestamp_begin, timestamp_end)
        aggregates = self.__nova.host_aggregates('admin')

        for aggregate in aggregates:
            result = []
            host_address = aggregate["host_address"]
            for host in host_address:
                host_name = self.__nova.server_name_by_ip(host)
                host_cpu = self.__nova.resource_host(host_name)["cpu"]
                
                for data in cpu_data:
                    if(data["host_address"]==host):
                        convert = []

                        for cpu_percent in data["data"]:
                            cpu_percent["data"] = (1 - cpu_percent["data"]/100.0)* host_cpu
                            convert.append(cpu_percent)
 
                        if(len(result)==0):
                            result = convert
                        else:
                            if(len(result) > len(convert)):
                                result = result[0:len(convert)]
                            for i in range(len(result)):
                                value = result[i]
                                value["data"] = value["data"] + (convert[i])["data"]
                                result[i] = value
                                
                        break
            ret.append({"Aggregate":aggregate["name"], "data":result})
        return json.dumps(ret)

    def vcpus_for_aggregate(self, project):
        return json.dumps(self.__nova.vcpus_for_aggregate(project))
