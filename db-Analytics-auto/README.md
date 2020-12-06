# 50043-Db
## Analytics system

1. Simply run the code setup_nodes.py with 4 arguments:
- aws_access_key_id
- aws_secret_access_key
- aws_session_token
- number of nodes(excluding namenode)

separated by spaces.

eg: python3 setup_nodes.py haha haha haha 3

It will start up the instances required, and perform the analytics tasks, and also startup the flask server to respond to requests.

