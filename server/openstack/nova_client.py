import env
from novaclient.v3 import client

class NovaClient:
    
    def instances(self, project):
        nova = client.Client(env.OS_USERNAME, env.OS_PASSWORD, project, env.OS_AUTH_URL)
        return nova.servers.list()
