# Book Review Auto Deployment Script

## prerequisite

1. terraform
    > brew install terraform
2. sed
    > brew install sed
3. jq
    > brew install jq

## Usage

1. put credential as follow in `.aws/` folder, name it as `credentials`

```txt
[test]
aws_access_key_id = <id>
aws_secret_access_key = <key>
```

2. enter **key pair name**

```sh
./init.sh
```

3. run

```sh
./overallSetUp.sh
```

4. check intances ips

```sh
./overall.sh
```

5. proper destroy

```sh
./overallDestroy.sh
```

6. force destroy

```sh
./overallDestroyRaw.sh
```

## :exclamation: Always destroy before fire instances up
