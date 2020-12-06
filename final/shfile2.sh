export LC_ALL=C
export PATH=~/anaconda3/bin:$PATH
conda init bash
source .bashrc
sudo apt-get update
mkdir testspark
cd testspark
yes | conda create -n py35 python=3.5
conda activate py35
conda install pip
which pip
pip install py4j
pip install pyspark
pip install findspark
cd ..
exit