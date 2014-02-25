import pyodbc, json, collections

class VerticaConnector:

        def __init__(self):

                self.DB_CONNECTION = pyodbc.connect('DSN=Vertica')
                self.DB_CURSOR = self.DB_CONNECTION.cursor()



#fecha conexao aberta na chamada
        def close_connection(self):
                self.DB_CURSOR.close()
                self.DB_CONNECTION.close()



#insere na tabela valores atribuidos em 'file'
        def insert(self, file):

                try:
			data = open(file).read()
                	self.DATA = json.loads(data)
		
                	for line in self.DATA:
                        	self.DB_CURSOR.execute("INSERT INTO ceilometer_data(timestamp, project_id, cpu_util_percent, resource_id) VALUES ('%s', '%s', '%f', '%s')" % 
(json.loads(line).get('timestamp'),
json.loads(line).get('project_id'),
float(json.loads(line).get('cpu_util_percent')), json.loads(line).get('resource_id')))
	                        self.DB_CONNECTION.commit()
		except:
			print 'Entrada invalida'


#Cria tabela com colunas do ceilometer
        def create_table(self, nome):
                self.DB_CURSOR.execute( "CREATE TABLE IF NOT EXISTS " + nome + "(key AUTO_INCREMENT, timestamp TIMESTAMP, project_id VARCHAR(255), cpu_util_percent FLOAT, resource_id VARCHAR(255), PRIMARY KEY(key))")
                self.DB_CONNECTION.commit()

