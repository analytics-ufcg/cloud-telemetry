CREATE TABLE benchmark_history(
     id MEDIUMINT NOT NULL AUTO_INCREMENT,
     timestamp TIMESTAMP,
     host_address VARCHAR(15),
     PRIMARY KEY (id)
);

CREATE TABLE cpu_table(
     id MEDIUMINT,
     cpu_average_time FLOAT(7,2),
     cpu_median_time FLOAT(7,2),
     cpu_min_time FLOAT(7,2),
     cpu_max_time FLOAT(7,2),
     first_quarter_time FLOAT(7,2),
     second_quarter_time FLOAT(7,2),
     third_quarter_time FLOAT(7,2),
     fourth_quarter_time FLOAT(7,2),
     PRIMARY KEY (id),
     FOREIGN KEY (id) REFERENCES benchmark_history(id)
);

CREATE TABLE mem_table(
     id MEDIUMINT,
     mem_average_time FLOAT(7,2),
     mem_median_time FLOAT(7,2),
     mem_min_time FLOAT(7,2),
     mem_max_time FLOAT(7,2),
     first_quarter_time FLOAT(7,2),
     second_quarter_time FLOAT(7,2),
     third_quarter_time FLOAT(7,2),
     fourth_quarter_time FLOAT(7,2),
     PRIMARY KEY (id),
     FOREIGN KEY (id) REFERENCES benchmark_history(id)
);

CREATE TABLE disk_table(
     id MEDIUMINT,
     disk_average_time FLOAT(7,2),
     disk_median_time FLOAT(7,2),
     disk_min_time FLOAT(7,2),
     disk_max_time FLOAT(7,2),
     first_quarter_time FLOAT(7,2),
     second_quarter_time FLOAT(7,2),
     third_quarter_time FLOAT(7,2),
     fourth_quarter_time FLOAT(7,2),
     PRIMARY KEY (id),
     FOREIGN KEY (id) REFERENCES benchmark_history(id)
);

INSERT INTO benchmark_history values(1, '2014-02-18', 'compute1');
INSERT INTO benchmark_history values(2, '2014-02-19', 'compute1');
INSERT INTO benchmark_history values(3, '2014-02-18', 'compute2');
INSERT INTO benchmark_history values(4, '2014-02-19', 'compute2');
INSERT INTO benchmark_history values(5, '2014-02-18', 'compute3');
INSERT INTO benchmark_history values(6, '2014-02-19', 'compute3');

INSERT INTO cpu_table values(1, 14027, 13938, 13893, 14390, 13921, 13938, 14029, 14390);
INSERT INTO mem_table values(1, 4688, 4635, 4616, 5540, 4625, 4635, 4717, 5540);
INSERT INTO disk_table values(1, 1775, 1764, 1753, 1830, 1758, 1764, 1779, 1830);

INSERT INTO cpu_table values(2, 15027, 14938, 14893, 15390, 14921, 14938, 15029, 15390);
INSERT INTO mem_table values(2, 5688, 5635, 5616, 6540, 5625, 5635, 5717, 6540);
INSERT INTO disk_table values(2, 2775, 2764, 2753, 2830, 2758, 2764, 2779, 2830);

INSERT INTO cpu_table values(3, 12027, 11938, 11893, 12390, 11921, 11938, 12029, 12390);
INSERT INTO mem_table values(3, 6688, 6635, 6616, 7540, 6625, 6635, 6717, 7540);
INSERT INTO disk_table values(3, 3775, 3764, 3753, 3830, 3758, 3764, 3779, 3830);

INSERT INTO cpu_table values(4, 24027, 23938, 23893, 24390, 23921, 23938, 24029, 24390);
INSERT INTO mem_table values(4, 2688, 2635, 2616, 3540, 2625, 2635, 2717, 3540);
INSERT INTO disk_table values(4, 1775, 1764, 1753, 1830, 1758, 1764, 1779, 1830);

INSERT INTO cpu_table values(5, 14027, 13938, 13893, 14390, 13921, 13938, 14029, 14390);
INSERT INTO mem_table values(5, 4088, 4035, 4016, 5040, 4016, 4035, 4038, 5040);
INSERT INTO disk_table values(5, 1575, 1564, 1553, 1630, 1558, 1564, 1579, 1630);

INSERT INTO cpu_table values(6, 18017, 17928, 17883, 18380, 17911, 17928, 18019, 18380);
INSERT INTO mem_table values(6, 5088, 5035, 5016, 5940, 5025, 5035, 5117, 5940);
INSERT INTO disk_table values(6, 1885, 1874, 1863, 1940, 1868, 1874, 1889, 1940);

DELETE FROM cpu_table;
DELETE FROM mem_table;
DELETE FROM disk_table;
DELETE FROM benchmark_history;



select host_address, cpu_average_time, cpu_median_time, cpu_min_time, cpu_max_time, cpu.first_quarter_time, cpu.second_quarter_time, cpu.third_quarter_time, cpu.fourth_quarter_time, mem_average_time, mem_median_time, mem_min_time, mem_max_time, mem.first_quarter_time, mem.second_quarter_time, mem.third_quarter_time, mem.fourth_quarter_time, disk_average_time, disk_median_time, disk_min_time, disk_max_time, disk.first_quarter_time, disk.second_quarter_time, disk.third_quarter_time, disk.fourth_quarter_time from cpu_table as cpu, mem_table as mem, benchmark_history as Bench, disk_table as disk where cpu.id = Bench.id && cpu.id = mem.id && cpu.id = disk.id && cpu.id in (SELECT ID FROM (SELECT MAX(timestamp), MAX(id) AS ID FROM benchmark_history GROUP BY host_address) as last_timestemp);







