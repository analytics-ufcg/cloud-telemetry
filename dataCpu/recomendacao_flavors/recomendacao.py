import subprocess
import csv
import json

script="Rscript generate_recommendation.R"
data_csv = "dados.csv"
data_json = "./testes/ceilometer_Fev01.json"
flavors = "flavors.csv"




def create_csv(file_input, data_csv):
    input = open(file_input)
    output = open(data_csv, "w")
    data = json.load(input)
    output.write("VM,Cores,CPU_UTIL\n")
    for instance in data:
        output.write(instance["resource_id"] + "," +str(instance["resource_metadata"]["flavor.vcpus"]) + "," + str(instance["counter_volume"])+"\n")
    input.close()
    output.close()

def comunica_com_r(scriptR, dado):
    processo = subprocess.Popen(scriptR+" "+dado, shell=True, stdout=subprocess.PIPE)
    while True:
        if (processo.poll() == 0):
            break
        elif (processo.poll() == 1):
            print "Requisio nao concluida"

def gera_retorno(dado):
    dic = {}
    input = open(dado)
    input.readline()
    for linha in input.readlines():
        termos = linha.split(",")
        dic[termos[0][6:-1]] = [round(float(termos[1]),2), termos[2][:-1]]
    input.close()
    return dic


def data_to_dic(dadoJson, dadoCSV, scriptR, flavors):
    create_csv(dadoJson, dadoCSV)
    comunica_com_r(scriptR, dadoCSV)
    return gera_retorno(flavors)


print data_to_dic(data_json, data_csv, script, flavors)
    
    
    



    
