import env
from keystoneclient.v2_0 import client

class KeystoneClient:

    def __init__(self):
        self.__keystone = client.Client(username=env.OS_USERNAME, password=env.OS_PASSWORD, auth_url=env.OS_AUTH_URL)
        self.projects = [ {'name' : i.name, 'id' : i.id} for i in self.__keystone.tenants.list() ] 
        self.tenants = self.__keystone.tenants.list()

