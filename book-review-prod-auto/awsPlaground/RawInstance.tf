provider "aws" {
  profile                 = "test"
  shared_credentials_file = "../.aws/credentials"
  region                  = "ap-southeast-1"
}

# vpv
resource "aws_vpc" "prod-vpc" {
  cidr_block = "10.0.0.0/16"
  tags       = {
    Name = "prod-vpc"
  }
}

# gateway
resource "aws_internet_gateway" "prod-gw" {
  vpc_id = aws_vpc.prod-vpc.id
  tags   = {
    Name = "prod-gw"
  }
}

# route table
resource "aws_route_table" "prod-route-table" {
  vpc_id = aws_vpc.prod-vpc.id
  route {
    cidr_block             = "0.0.0.0/0"
    gateway_id             = aws_internet_gateway.prod-gw.id
  }
  route {
    ipv6_cidr_block        = "::/0"
    gateway_id             = aws_internet_gateway.prod-gw.id
  }
  tags   = {
    Name                   = "prod-route-table"
  }
}

# subnet
resource "aws_subnet" "prod-subnet" {
  vpc_id            = aws_vpc.prod-vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-southeast-1a"
  tags              = {
    Name = "prod-subnet"
  }
}

# route table association
resource "aws_route_table_association" "prod-route-table-association" {
  subnet_id      = aws_subnet.prod-subnet.id
  route_table_id = aws_route_table.prod-route-table.id
}

# security group
resource "aws_security_group" "allow-web-traffic" {
  name        = "allow-web-traffic "
  description = "Allow web inbound traffic"
  vpc_id      = aws_vpc.prod-vpc.id
  ingress {
    description = "MySQL traffic"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "SSH traffic"
    from_port   = 22
    to_port     = 22 
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags       = {
    Name        = "allow-web-traffic"
  }
}

# network interface
resource "aws_network_interface" "web-server" {
  subnet_id       = aws_subnet.prod-subnet.id
  private_ips     = ["10.0.1.50"]
  security_groups = [aws_security_group.allow-web-traffic.id]
}

# elastic ip
resource "aws_eip" "one" {
  vpc                       = true
  network_interface         = aws_network_interface.web-server.id
  associate_with_private_ip = "10.0.1.50"
  depends_on                = [aws_internet_gateway.prod-gw, aws_vpc.prod-vpc, aws_subnet.prod-subnet] 
}

# create server
resource "aws_instance" "web-server-instance" {
  ami           = "ami-03060465516794b47"
  instance_type = "t2.xlarge"
  availability_zone = "ap-southeast-1a"
  key_name = "KEY_PAIR_NAME_PLACEHOLDER"
  network_interface {
    device_index = 0
    network_interface_id = aws_network_interface.web-server.id
  }
  tags          = {
    Name = "RawInstance"
  }
  user_data = <<-EOF
              #!/bin/bash
              cd /
              sudo apt-get update -y
              sudo apt-get upgrade -y
              sudo apt-get install git -y
              sudo apt-get install wget -y
              sudo apt-get install unzip -y
              echo "mysql-server-5.7 mysql-server/root_password password password" | sudo debconf-set-selections
              echo "mysql-server-5.7 mysql-server/root_password_again password password" | sudo debconf-set-selections
              sudo apt-get install mysql-server-5.7 -y
              mysql_secure_installation
              sudo sed -i "s/.*bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/mysql.conf.d/mysqld.cnf
              sudo service mysql restart
              cd /home/ubuntu
              git clone https://gitlab.com/AnAsianGangster/mysql-review.git
              cd /home/ubuntu/mysql-review
              sudo chmod 777 setup.sh
              sudo chmod 600 mysqlCredential
              sudo ./setup.sh
              EOF
}

# output ip
output "ip" {
  value = "${aws_instance.web-server-instance.*.public_ip}"
}
