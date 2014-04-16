import time, os, json

#cpu
def fibonacci(x):
    a, b = 0, 1
    n = 0
    while n < x:
        a, b = b, a+b
        n += 1
    return a

#memory
def concatena_Str():
    a = ''
    for i in range(300000):
        a += 'a'

#disk
def create_File(x):
    for i in range(x):
        arq = open('test'+str(i)+'.txt','w')
        for j in range(30):
            arq.write('427386953461975461342758632159')

        arq.close()
        os.remove('test'+str(i)+'.txt')

def run(turns=30):
    cpu = []
    memory = []
    disk = []
    
    for i in range(turns):
        t1 = int(round(time.time() * 1000))
        fibonacci(30000)
        cpu.append(int(round(time.time() * 1000))-t1)

        t1 = int(round(time.time() * 1000))
        concatena_Str()
        memory.append(int(round(time.time() * 1000))-t1)

        t1 = int(round(time.time() * 1000))
        create_File(10)
        disk.append(int(round(time.time() * 1000))-t1)

    return {'cpu':cpu, 'memory':memory, 'disk':disk}

arq = open(str(int(round(time.time() * 1000))) + '.txt', 'w')
arq.write(json.dumps(run()))
arq.close()
