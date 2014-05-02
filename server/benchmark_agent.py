from telemetry_data import DataHandler
import json, requests, time

def start_bench_th(projeto):
    dados = DataHandler()
    dados.start_instance_bench(projeto)
    while dados.get_benchmark_status != True:
        time.sleep(15)
    #pega o resultado e escreve no banco
    a = open('a.txt','w')
    a.close()    
    return 'funfou'



