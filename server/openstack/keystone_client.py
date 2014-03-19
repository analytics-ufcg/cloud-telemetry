import env, ast
from keystoneclient.v2_0 import client

class KeystoneClient:

    def __init__(self):
        self.__keystone = client.Client(username=env.OS_USERNAME, password=env.OS_PASSWORD, auth_url=env.OS_AUTH_URL)
        self.projects = [ {'name' : i.name, 'id' : i.id} for i in self.__keystone.tenants.list() ] 
        self.tenants = self.__keystone.tenants.list()

    def get_user_email(self, user_id, project_id):
        self.__keystone2 = client.Client(tenant_id=project_id, username=env.OS_USERNAME, password=env.OS_PASSWORD, auth_url=env.OS_AUTH_URL)
        userData = str(self.__keystone2.users.get(user_id))[6:-1]
        return ast.literal_eval(userData)['email']
