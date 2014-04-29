import MySQLdb as mdb
import time, datetime, json

class BenchmarkDataHandler:

    def __init__(self, server='localhost', user='root', password='pass', db='telemetry_benchmarks', table='benchmark_history'):
        try:
            self.con = mdb.connect(server, user, password, db)
            self.table = table;
        except mdb.Error, e:
            print "Error %d: %s" % (e.args[0],e.args[1])
            return None

    def get_data_db(self):
        cursor = self.con.cursor()
        try:
            query = "SELECT MAX(timestamp), host_address,  cpu_average_time, cpu_median_time, memory_average_time, memory_median_time, disk_average_time, disk_median_time FROM benchmark_history GROUP BY host_address;"
            cursor.execute(query)
            self.con.commit()
            
            rows = cursor.fetchall()
            ret = []

            for row in rows:
                ret.append({'host':row[1], 'cpu_mean':row[2], 'cpu_median':row[3], 'mem_mean':row[4], 'mem_median':row[5], 'disk_mean': row[6], 'disk_median':row[7]})            

            return json.dumps(ret)
        except Exception, e:
            print e
            return None
        finally:
            cursor.close()




