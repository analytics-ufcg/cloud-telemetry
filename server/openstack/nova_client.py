import subprocess
import json, requests
import env
from keystone_client import KeystoneClient
from novaclient.v3 import client
from novaclient.v3.servers import ServerManager

class NovaClient:

    def instances(self, project):
        nova = client.Client(env.OS_USERNAME, env.OS_PASSWORD, project, env.OS_AUTH_URL)
        return nova.servers.list()

    def metrics(self, project):

        nova = client.Client(env.OS_USERNAME, env.OS_PASSWORD, project, env.OS_AUTH_URL)
        hosts = nova.hosts.list()
        nome_dos_hosts = []
        dic_dos_hosts = {}
        for host in hosts:
            corte = str(host)[7:-1]
            nome_dos_hosts.append(corte)
        nome_dos_hosts = list(set(nome_dos_hosts))

        for host in nome_dos_hosts:
            descricao = self.host_describe(host)

            cpu_total = descricao['host'][0]['resource']['cpu']
            memoria_total =  descricao['host'][0]['resource']['memory_mb']
            disco_total =  descricao['host'][0]['resource']['disk_gb']

            cpu_usado = descricao['host'][1]['resource']['cpu']
            memoria_usado =  descricao['host'][1]['resource']['memory_mb']
            disco_usado =  descricao['host'][1]['resource']['disk_gb']

            dic =  {'Total':[], 'Em uso':[], 'Percentual': []}

            dic['Total'] = [cpu_total, memoria_total, disco_total]
            dic['Em uso'] = [cpu_usado, memoria_usado, disco_usado]
            dic['Percentual'] = [round(float(cpu_usado)/cpu_total,3), round(float(memoria_usado)/memoria_total, 3), round(float(disco_usado)/disco_total,3)]

            dic_dos_hosts[host] = dic

        return json.dumps(dic_dos_hosts)


    def host_describe(self, host_name):
        auth_tokens_url = env.OS_AUTH_URL + '/tokens'
        headers = {'Content-Type':'application/json','Accept':'application/json'}
        payload = {"auth": {"tenantName": env.OS_ADMIN_TENANT, "passwordCredentials": {"username": env.OS_USERNAME, "password": env.OS_PASSWORD}}}

        r = requests.post(auth_tokens_url, data=json.dumps(payload), headers=headers)
        if r.status_code != 200:
            msg = 'Token request error. HTTP error ' + str(r.status_code)
            raise Exception(msg)

        response = r.json()

        token = response['access']['token']['id']
        compute_service = None
        for s in response['access']['serviceCatalog']:
            if s['type'] == 'compute':
                compute_service = s
                break

        if compute_service is None:
            raise Exception('could not retrieve compute service (nova)')

        admin_url = compute_service['endpoints'][0]['adminURL']
        headers = {'X-Auth-Project-Id':'admin', 'Accept':'application/json', 'X-Auth-Token':token}
        os_hosts_url = admin_url + '/os-hosts/' + host_name

        r = requests.get(os_hosts_url, headers=headers)
        if r.status_code != 200:
            msg = 'Host info request error. HTTP error ' + str(r.status_code)
            raise Exception(msg)

        return r.json()
        
    def vm_migration(self,project_name,host_name,instance_id):
        nova = client.Client(env.OS_USERNAME, env.OS_PASSWORD, project_name, env.OS_AUTH_URL)
        server = ServerManager(nova)
        block = True
        disk_commit = False 
        server.live_migrate(instance_id,host_name,block,disk_commit)

    def vm_hostname(self,project_name,instance_id):
        nova = client.Client(env.OS_USERNAME, env.OS_PASSWORD, project_name, env.OS_AUTH_URL)
        server = ServerManager(nova)
        return server.get(instance_id)

    def start_instance_bench(self, project):
        nova = client.Client(env.OS_USERNAME, env.OS_PASSWORD, project, env.OS_AUTH_URL)
        servers = nova.servers.list()
        for server in servers:
            if server.name == 'benchmark':
                return 'ja ha uma instancia chamada benchmark'
        nova.servers.create('benchmark', '330a1d0b-5dc4-4dac-b83f-a45212abf5fd', '4d8a8f1a-2a43-4b0c-9af6-7e379a2358b8')
        return 'instancia disparada'

    def get_benchmark_ip(self, project):
        nova = client.Client(env.OS_USERNAME, env.OS_PASSWORD, project, env.OS_AUTH_URL)
        servers = nova.servers.list()
        benchmark_id  = ' '
        for server in servers:
            if server.name == 'benchmark':
                benchmark_id = server.id
        if benchmark_id == ' ':
            return 'nao ha instancia de benchmark'
        instance_bench = nova.servers.get(benchmark_id)
        return instance_bench.addresses['private'][0]['addr']
