CREATE TABLE benchmark_history(
     id MEDIUMINT NOT NULL AUTO_INCREMENT,
     timestamp TIMESTAMP,
     host_address VARCHAR(15),
     PRIMARY KEY (id)
);

CREATE TABLE cpu_table(
     id MEDIUMINT,
     cpu_average_time FLOAT(5,2),
     cpu_median_time FLOAT(5,2),
     cpu_min_time FLOAT(5,2),
     cpu_max_time FLOAT(5,2),
     first_quarter_time FLOAT(5,2),
     second_quarter_time FLOAT(5,2),
     third_quarter_time FLOAT(5,2),
     fourth_quarter_time FLOAT(5,2),
     PRIMARY KEY (id),
     FOREIGN KEY (id) REFERENCES benchmark_history(id)
);

CREATE TABLE mem_table(
     id MEDIUMINT,
     mem_average_time FLOAT(5,2),
     mem_median_time FLOAT(5,2),
     mem_min_time FLOAT(5,2),
     mem_max_time FLOAT(5,2),
     first_quarter_time FLOAT(5,2),
     second_quarter_time FLOAT(5,2),
     third_quarter_time FLOAT(5,2),
     fourth_quarter_time FLOAT(5,2),
     PRIMARY KEY (id),
     FOREIGN KEY (id) REFERENCES benchmark_history(id)
);

CREATE TABLE disk_table(
     id MEDIUMINT,
     disk_average_time FLOAT(5,2),
     disk_median_time FLOAT(5,2),
     disk_min_time FLOAT(5,2),
     disk_max_time FLOAT(5,2),
     first_quarter_time FLOAT(5,2),
     second_quarter_time FLOAT(5,2),
     third_quarter_time FLOAT(5,2),
     fourth_quarter_time FLOAT(5,2),
     PRIMARY KEY (id),
     FOREIGN KEY (id) REFERENCES benchmark_history(id)
);

INSERT INTO benchmark_history values(1, '2014-02-18', '150.165.15.4');
INSERT INTO benchmark_history values(2, '2014-02-19', '150.165.15.4');
INSERT INTO benchmark_history values(3, '2014-02-18', '150.165.15.37');
INSERT INTO benchmark_history values(4, '2014-02-19', '150.165.15.37');
INSERT INTO benchmark_history values(5, '2014-02-18', '150.165.15.42');
INSERT INTO benchmark_history values(6, '2014-02-19', '150.165.15.42');
INSERT INTO benchmark_history values(7, '2014-02-20', '150.165.15.42');

INSERT INTO cpu_table values(1, 20.5, 19, 10, 30, 15, 20.5, 25, 30);
INSERT INTO mem_table values(1, 22.5, 21, 12, 32, 17, 22.5, 27, 32);
INSERT INTO disk_table values(1, 18.5, 17, 8, 28, 13, 18.5, 23, 28);

INSERT INTO cpu_table values(2, 220.5, 219, 210, 230, 215, 220.5, 225, 230);
INSERT INTO mem_table values(2, 222.5, 221, 212, 232, 217, 222.5, 227, 232);
INSERT INTO disk_table values(2, 218.5, 217, 28, 228, 213, 218.5, 223, 228);

INSERT INTO cpu_table values(3, 320.5, 319, 310, 330, 315, 320.5, 325, 330);
INSERT INTO mem_table values(3, 322.5, 321, 312, 332, 317, 322.5, 327, 332);
INSERT INTO disk_table values(3, 318.5, 317, 38, 328, 313, 318.5, 323, 328);

INSERT INTO cpu_table values(4, 20.5, 19, 10, 30, 15, 20.5, 25, 30);
INSERT INTO mem_table values(4, 22.5, 21, 12, 32, 17, 22.5, 27, 32);
INSERT INTO disk_table values(4, 18.5, 17, 8, 28, 13, 18.5, 23, 28);

INSERT INTO cpu_table values(5, 420.5, 419, 410, 430, 415, 420.5, 425, 430);
INSERT INTO mem_table values(5, 422.5, 421, 412, 432, 417, 422.5, 427, 432);
INSERT INTO disk_table values(5, 418.5, 417, 48, 428, 413, 418.5, 423, 428);

INSERT INTO cpu_table values(6, 820.5, 819, 810, 830, 815, 820.5, 825, 830);
INSERT INTO mem_table values(6, 822.5, 821, 812, 832, 817, 822.5, 827, 832);
INSERT INTO disk_table values(6, 818.5, 817, 88, 828, 813, 818.5, 823, 828);

INSERT INTO cpu_table values(7, 620.5, 619, 610, 630, 615, 620.5, 625, 630);
INSERT INTO mem_table values(7, 622.5, 621, 612, 632, 617, 622.5, 627, 632);
INSERT INTO disk_table values(7, 618.5, 617, 68, 628, 613, 618.5, 623, 628);

DELETE FROM cpu_table;
DELETE FROM mem_table;
DELETE FROM disk_table;
DELETE FROM benchmark_history;



select host_address, cpu_average_time, cpu_median_time, cpu_min_time, cpu_max_time, cpu.first_quarter_time, cpu.second_quarter_time, cpu.third_quarter_time, cpu.fourth_quarter_time, mem_average_time, mem_median_time, mem_min_time, mem_max_time, mem.first_quarter_time, mem.second_quarter_time, mem.third_quarter_time, mem.fourth_quarter_time, disk_average_time, disk_median_time, disk_min_time, disk_max_time, disk.first_quarter_time, disk.second_quarter_time, disk.third_quarter_time, disk.fourth_quarter_time from cpu_table as cpu, mem_table as mem, benchmark_history as Bench, disk_table as disk where cpu.id = Bench.id && cpu.id = mem.id && cpu.id = disk.id && cpu.id in (SELECT ID FROM (SELECT MAX(timestamp), MAX(id) AS ID FROM benchmark_history GROUP BY host_address) as last_timestemp);







