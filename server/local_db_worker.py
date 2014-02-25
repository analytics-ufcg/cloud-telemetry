import sys, time

def db_worker():
    while True:
        sys.stdout.write('({}) foo\n'.format(time.ctime()))
        time.sleep(1)

