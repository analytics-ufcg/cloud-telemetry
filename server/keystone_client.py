from keystoneclient.v2_0 import client

class KeystoneClient:

    def __init__(self, user, passwd, auth_url):
        self.keystone = client.Client(username=user, password=passwd, auth_url=auth_url)
        self.__projects_list = self.keystone.tenants.list()
        self.projects = { i.id : i.name for i in self.__projects_list }


