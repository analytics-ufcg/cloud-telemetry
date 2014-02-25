import env
from keystoneclient.v2_0 import client

class KeystoneClient:

    def __init__(self):
        self.keystone = client.Client(username=env.OS_USERNAME, password=env.OS_PASSWORD, auth_url=env.OS_AUTH_URL)
        self.projects = [ {'name' : i.name, 'id' : i.id} for i in self.keystone.tenants.list() ] 


