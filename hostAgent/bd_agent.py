import MySQLdb as mdb
import time, datetime

def save_data(cpu, memory, disk):
    try:
        con = mdb.connect('localhost', 'root', 'pass', 'host');
        query = "INSERT INTO HOST VALUES('%s', %i, '%s', '%s')" % (datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S'), cpu, json.dumps(memory), json.dumps(disk))
        cursor = con.cursor()
        cursor.execute(query)
        con.commit()
        return "sucess"    
    except :  
        print "Error %d: %s" % (e.args[0],e.args[1])
        return None
    finally:    
        if con:    
            con.close()

