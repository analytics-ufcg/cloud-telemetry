import json

def create_csv(file_input, file_output):
    input = open(file_input)
    output = open(file_output, "w")
    data = json.load(input)
    output.write("VM,Cores,CPU_UTIL\n")
    for instance in data:
        output.write(instance["resource_id"] + "," +str(instance["resource_metadata"]["flavor.vcpus"]) + "," + str(instance["counter_volume"])+"\n")
    input.close()
    output.close()


create_csv("ceilometer_data.json", "data_cpu.csv")
