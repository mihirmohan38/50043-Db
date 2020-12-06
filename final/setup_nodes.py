import boto3
import os
import sys

ec2 = boto3.client('ec2',
aws_access_key_id= sys.argv[1],
aws_secret_access_key= sys.argv[2],
aws_session_token= sys.argv[3])

n_nodes = sys.argv[4]

keyname = "bigdataprojkey"
keypair = ec2.create_key_pair(KeyName=keyname)

response = ec2.describe_vpcs()
vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')

try:
    #create a security group
    response = ec2.create_security_group(GroupName='database_attempt_new502',
                                         Description='make descriptions great again',
                                         VpcId=vpc_id)
    #get security group id
    security_group_id = response['GroupId']

    data = ec2.authorize_security_group_ingress(
        GroupId=security_group_id,
        IpPermissions=[
            {'IpProtocol': 'tcp',
             'FromPort': 80,
             'ToPort': 80,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
            {'IpProtocol': 'tcp',
             'FromPort': 22,
             'ToPort': 22,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
            {'IpProtocol': 'tcp',
             'FromPort': 8041,
             'ToPort': 8041,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
        ])
    #print('Ingress Successfully Set %s' % data)
except Exception as e:
    print(e)


s = boto3.Session(region_name="us-east-1")
ec2_resource = s.resource('ec2')

def create_instance(security_group_id):
    instances = ec2_resource.create_instances(
        BlockDeviceMappings=[
            {
                "DeviceName": "/dev/sda1",
                'Ebs':{
                    'DeleteOnTermination': True,
                    'VolumeSize': 20
                }

            }
        ],
        ImageId='ami-0f82752aa17ff8f5d',
        MinCount=1,
        MaxCount=1,
        InstanceType='t2.micro',
        KeyName='bigdataprojkey',
        SecurityGroupIds=[security_group_id]
    )

    instance = instances[0]

    instance.wait_until_running()

    instance.load()
    public_dns_name = instance.public_dns_name

    ipaddress = instance.private_ip_address
    return([public_dns_name, ipaddress])

node_dict = {}


nodes = ["namenode"] + [("datanode" + str(i+1)) for i in range(n_nodes)]

for node in nodes:
    print(node)
    node_dict[node] = create_instance(security_group_id)
    print(node_dict[node])


print(node_dict)

for node in nodes:
    public_dns_name = node_dict[node][0]
    os.system("ssh-keyscan " + public_dns_name + " >> ~/.ssh/known_hosts")

    os.system("scp -vvv -i bigdataprojkey.pem shfile1.sh " + "ubuntu@" + str(public_dns_name) + ":~/")

    os.system("scp -vvv -i bigdataprojkey.pem shfile2.sh " + "ubuntu@" + str(public_dns_name) + ":~/")

    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + str(public_dns_name) + " " + "'export LC_ALL=C; chmod +x package_downloads.sh; ./package_downloads.sh; chmod +x shfile1.sh; chmod +x shfile2.sh; ./shfile1.sh; ./shfile2.sh; exit'")
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + str(public_dns_name) + " " + "'mkdir testspark;'")
    os.system("scp -vvv -i bigdataprojkey.pem reviews.csv " + "ubuntu@" + str(public_dns_name) + ":~/testspark")
    os.system("scp -vvv -i bigdataprojkey.pem metadata.csv " + "ubuntu@" + str(public_dns_name) + ":~/testspark")
    os.system("scp -vvv -i bigdataprojkey.pem code_refactored.py " + "ubuntu@" + str(public_dns_name) + ":~/testspark")

    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + str(public_dns_name) + " " + "'export LC_ALL=C; cd testspark; source activate py35; pip --no-cache-dir install py4j; pip --no-cache-dir install pyspark; pip --no-cache-dir install findspark; pip --no-cache-dir install pysqoop; exit'")
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + str(public_dns_name) + " " + "'apt install python3-flask; pip install flask-cors; apt install python3-waitress; git clone https://github.com/rahulbhatta/db-flask-copy.git; cd db-flask-copy/db-flask-main; waitress-serve --port=8041 --call" +  '"' + "flaskr:create_app" + '"' + "; exit'")


for node in nodes:
    print(node)
    command1 = """'sudo apt-get update; sudo apt-get -y install openjdk-8-jdk-headless; mkdir server; cd server; wget https://downloads.apache.org/hadoop/common/hadoop-3.2.1/hadoop-3.2.1.tar.gz; tar xzf hadoop-3.2.1.tar.gz; echo "export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64" >> ~/server/hadoop-3.2.1/etc/hadoop/hadoop-env.sh; exit'"""
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[node][0] + " " + command1)

command2 = "'"
for node in nodes:
    command2 += 'echo "' + node_dict[node][1] + " com.avg." + node + '" | sudo tee -a /etc/hosts; '
command2 += "exit'"

worker_command1 = 'WORKERS="com.avg.' + nodes[1]
try:
    for node in nodes[2:]:
        worker_command1 += ' com.avg.' + node
except:
    pass
worker_command = worker_command1 + '"; exit'

command4 = """'export JH="\/usr\/lib\/jvm\/java-8-openjdk-amd64"; sed -i "s/# export JAVA_HOME=.*/export\ JAVA_HOME=${JH}/g" \
~/server/hadoop-3.2.1/etc/hadoop/hadoop-env.sh; MASTER=com.avg.namenode; """

core_site_edit = """echo -e "<configuration>
<property>
<name>fs.defaultFS</name>
<value>hdfs://${MASTER}:9000</value>
</property>
</configuration>" > ~/server/hadoop-3.2.1/etc/hadoop/core-site.xml; exit'"""

data_dir_command = "'sudo mkdir -p /usr/local/hadoop/hdfs/data; sudo chown -R ubuntu:ubuntu /usr/local/hadoop/hdfs/data; exit'"

#command2, worker_command, command4 + core_site_edit, data_dir_command

for node in nodes:
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[node][0] + " " + command2)
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[node][0] + " " + worker_command)
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[node][0] + " " + (command4 + core_site_edit))
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[node][0] + " " + data_dir_command)

#for namenode

ssh_keygen_command = "'ssh-keygen; cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys; exit'"
os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + ssh_keygen_command)

#for all datanodes:
for node in nodes[1:]:
    command = 'ssh ubuntu@' + node_dict[nodes[0]][0] + ' -i bigdataprojkey.pem "sudo cat /home/ubuntu/.ssh/id_rsa.pub" | ssh ubuntu@' + node_dict[node][0] + ' -i bigdataprojkey.pem "sudo cat - | sudo tee -a /home/ubuntu/.ssh/authorized_keys; exit"'
    os.system(command)

#for namenode, setup ssh config

ssh_config_1 = 'echo -e "'

ssh_config = """Host namenode
  HostName """ + node_dict[nodes[0]][1] + """
  User ubuntu
  IdentityFile ~/.ssh/id_rsa"""

for node in nodes[1:]:
    ssh_config += """ 
    Host datanode1
    HostName """ + node_dict[node][1] + """
    User ubuntu
    IdentityFile ~/.ssh/id_rsa"""

ssh_config_command = "'" + ssh_config_1 + ssh_config + '" > ~/.ssh/config' + "; exit'"
os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + ssh_config_command)

namenode_hdfs = """'echo -e "<configuration>
<property>
<name>dfs.replication</name>
<value>3</value>
</property>
<property>
<name>dfs.namenode.name.dir</name>
<value>file:///usr/local/hadoop/hdfs/data</value>
</property>
</configuration>
" > ~/server/hadoop-3.2.1/etc/hadoop/hdfs-site.xml; exit'"""
os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + namenode_hdfs)

mapred_site = """'echo -e "<configuration>
<property>
<name>mapreduce.jobtracker.address</name>
<value>""" + node_dict[nodes[0]][1] + """:54311</value>
</property>
<property>
<name>mapreduce.framework.name</name>
<value>yarn</value>
</property>
</configuration>
" > ~/server/hadoop-3.2.1/etc/hadoop/mapred-site.xml; exit'"""
os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + mapred_site)

yarn_properties = """'echo -e "<configuration>
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
  </property>
  <property>
    <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
    <value>org.apache.hadoop.mapred.ShuffleHandler</value>
  </property>
  <property>
    <name>yarn.resourcemanager.hostname</name>
    <value>""" + node_dict[nodes[0]][1] + """</value>
  </property>
</configuration>" > ~/server/hadoop-3.2.1/etc/hadoop/yarn-site.xml; exit'"""
os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + yarn_properties)

create_master = "'" + '''echo -e "''' + node_dict[nodes[0]][1] + '''" >> ~/server/hadoop-3.2.1/etc/hadoop/masters;''' + " exit'"
os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + create_master)

create_workers = "'"
for node in nodes[1:]:
    create_workers += '''echo -e "''' + node_dict[node][1] + '''" >> ~/server/hadoop-3.2.1/etc/hadoop/workers; '''
create_workers += "exit;'"
os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + create_workers)

datanode_hdfs = """'echo -e "<property>
  <name>dfs.replication</name>
  <value>3</value>
</property>
<property>
  <name>dfs.datanode.data.dir</name>
  <value>file:///usr/local/hadoop/hdfs/data</value>
</property>" > ~/server/hadoop-3.2.1/etc/hadoop/hdfs-site.xml; exit'"""

for node in nodes[1:]:
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[node][0] + " " + datanode_hdfs)

#test SPARK from here:
#download and extract the spark version into namenode
download_extract = "'cd server; wget https://apachemirror.sg.wuchna.com/spark/spark-3.0.1/spark-3.0.1-bin-hadoop3.2.tgz; tar zxvf spark-3.0.1-bin-hadoop3.2.tgz; exit'"
configure1 = "'cd server; cp spark-3.0.1-bin-hadoop3.2/conf/spark-env.sh.template \
spark-3.0.1-bin-hadoop3.2/conf/spark-env.sh; exit'"

configure2 = """'cd server; echo -e "
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export HADOOP_HOME=~/server/hadoop-3.2.1
export SPARK_HOME=/opt/spark-3.0.1-bin-hadoop3.2
export SPARK_CONF_DIR=\${SPARK_HOME}/conf
export HADOOP_CONF_DIR=\${HADOOP_HOME}/etc/hadoop
export YARN_CONF_DIR=\${HADOOP_HOME}/etc/hadoop
export SPARK_EXECUTOR_CORES=1
export SPARK_EXECUTOR_MEMORY=2G
export SPARK_DRIVER_MEMORY=1G
export PYSPARK_PYTHON=python3" >> spark-3.0.1-bin-hadoop3.2/conf/spark-env.sh; exit'"""


#execute download extract, configure1, configure2
#final_command = download_extract + configure1 + configure2
#os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + final_command)

#execute worker_command1

worker_config = ' for ip in ${WORKERS}; do echo -e "${ip}" >> spark-3.0.1-bin-hadoop3.2/conf/slaves; done; exit;' + "'"

#breakup zip folder
zip_folder1 = " tar czvf spark-3.0.1-bin-hadoop3.2.tgz spark-3.0.1-bin-hadoop3.2/; exit'"
zip_folder2 = " for i in ${WORKERS}; do scp spark-3.0.1-bin-hadoop3.2.tgz $i:./spark-3.0.1-bin-hadoop3.2.tgz; done; exit'"
zip_folder3 = " mv spark-3.0.1-bin-hadoop3.2.tgz ~/.; exit'" #this mv is failing
worker_command2_1 = "'" + worker_command1 + '";' + " cd server;" + zip_folder1
worker_command2_2 = "'" + worker_command1 + '";' + " cd server;" + zip_folder2
worker_command2_3 = "'" + worker_command1 + '";' + " cd server;" + zip_folder3

#end for now

for node in nodes:
    #separate out the commands
    #1. download_extract
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[node][0] + " " + download_extract)

    #2. configure1
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[node][0] + " " + configure1)

    #3. configure2
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[node][0] + " " + configure2)

    #4. worker command1 + worker_config
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[node][0] + " " + "'cd server; " + worker_command1 + '";' + worker_config)



##5. worker command2
#os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + worker_command2_1)
#os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + worker_command2_2)
#os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + worker_command2_3)

#for all nodes:
#sudo chown -R hadoop:hadoop /opt/spark-3.0.1-bin-hadoop3.2; 
install_command = "'cd server; sudo mv spark-3.0.1-bin-hadoop3.2 /opt/; exit'"
for node in nodes:
    os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[node][0] + " " + install_command)

os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + "'~/server/hadoop-3.2.1/bin/hdfs namenode -format; ~/server/hadoop-3.2.1/sbin/start-dfs.sh; ~/server/hadoop-3.2.1/sbin/start-yarn.sh; /opt/spark-3.0.1-bin-hadoop3.2/sbin/start-all.sh; ~/server/hadoop-3.2.1/bin/hdfs dfs -mkdir -p /user; exit'")
os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + "'cd testspark; source activate py35; pip --no-cache-dir install py4j; pip --no-cache-dir install pyspark; pip --no-cache-dir install findspark; /opt/spark-3.0.1-bin-hadoop3.2/bin/spark-submit --master yarn code_refactored.py'")
os.system("ssh -vvv -i bigdataprojkey.pem ubuntu@" + node_dict[nodes[0]][0] + " " + "'/opt/spark-3.0.1-bin-hadoop3.2/sbin/stop-all.sh; ~/server/hadoop-3.2.1/sbin/stop-dfs.sh && ~/server/hadoop-3.2.1/sbin/stop-yarn.sh'")

print(node_dict)
