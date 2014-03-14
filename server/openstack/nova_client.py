import subprocess
import json
import env
from novaclient.v3 import client

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
            processo = subprocess.Popen("nova host-describe "+host+" > metrics.txt", shell=True, stdout=subprocess.PIPE)
            while True:
                if (processo.poll() == 0):
                    break
                elif (processo.poll() == 1):
                    print "Requisicao nao concluida"
                    break
            arquivo = open('metrics.txt')
            linhas = arquivo.readlines()[3:-4]
            total = linhas[0].split('|')
            usado = linhas[1].split('|')
            dic =  {'Total':[], 'Em uso':[], 'Percentual': []}
            dic['Total'] = [int(total[3]), int(total[4])]
            dic['Em uso'] = [int(usado[3]), int(usado[4])]
            dic['Percentual'] = [round(float(usado[3])/int(total[3]),3), round(float(usado[4])/int(total[4]),3)] 
            dic_dos_hosts[host] = (dic)
            arquivo.close()
        return json.dumps(dic_dos_hosts)    
