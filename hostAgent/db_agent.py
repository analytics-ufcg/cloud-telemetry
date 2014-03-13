import MySQLdb as mdb
import time, datetime, json

class DbAgent:

    def __init__(self, server='localhost', user='root', password='pass', db='HOST', table='HOST'):
        try:
            self.con = mdb.connect(server, user, password, db)
            self.cursor = self.con.cursor()
            self.table = table;
        except mdb.Error, e:
            print "Error %d: %s" % (e.args[0],e.args[1])
            return None


    def save_data_db(self, cpu, memory, disk):
        try:
            query = "INSERT INTO HOST VALUES((SELECT CURRENT_TIMESTAMP()), %f, '%s', '%s')" % (cpu, json.dumps(memory), json.dumps(disk))
            self.cursor.execute(query)
            self.con.commit()
            return "sucess"    
        except:  
            print "Cant save data"
            return None

    def get_data_db(self, data):
        try:
            query = "SELECT Date, %s FROM %s" % (data, self.table)
            self.cursor.execute(query)
            
            rows = self.cursor.fetchall()
            
            return rows
        except:
            print "Cant get data"
            return None

    def close_db(self):
        try:
            self.cursor.close()
            self.con.close()
        except:
            print 'Cant close connection'
