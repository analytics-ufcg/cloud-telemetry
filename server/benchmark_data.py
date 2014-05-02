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
            query = "select host_address, cpu_average_time, cpu_median_time, cpu_min_time, cpu_max_time, cpu.first_quarter_time, cpu.second_quarter_time, cpu.third_quarter_time, cpu.fourth_quarter_time, mem_average_time, mem_median_time, mem_min_time, mem_max_time, mem.first_quarter_time, mem.second_quarter_time, mem.third_quarter_time, mem.fourth_quarter_time, disk_average_time, disk_median_time, disk_min_time, disk_max_time, disk.first_quarter_time, disk.second_quarter_time, disk.third_quarter_time, disk.fourth_quarter_time from cpu_table as cpu, mem_table as mem, benchmark_history as Bench, disk_table as disk where cpu.id = Bench.id && cpu.id = mem.id && cpu.id = disk.id && cpu.id in (SELECT ID FROM (SELECT MAX(timestamp), MAX(id) AS ID FROM benchmark_history GROUP BY host_address) as last_timestemp);"
            cursor.execute(query)
            self.con.commit()
            
            rows = cursor.fetchall()
            ret = []

            for row in rows:
                ret.append({'host':row[0], 'cpu_average':row[1], 'cpu_median':row[2], 'cpu_min':row[3], 'cpu_max':row[4], 'cpu_first_quarter': row[5], 'cpu_second_quarter':row[6],
'cpu_third_quarter': row[7], 'cpu_fourth_quarter': row[8], 'mem_average':row[9], 'mem_median':row[10], 'mem_min':row[11], 'mem_max':row[12], 'mem_first_quarter': row[13], 'mem_second_quarter':row[14],
'mem_third_quarter': row[15], 'mem_fourth_quarter': row[16], 'disk_average':row[17], 'disk_median':row[18], 'disk_min':row[19], 'disk_max':row[20], 'disk_first_quarter': row[21], 'disk_second_quarter':row[22], 'disk_third_quarter': row[23], 'disk_fourth_quarter': row[24]   
})            

            return json.dumps(ret)
        except Exception, e:
            print e
            return None
        finally:
            cursor.close()




