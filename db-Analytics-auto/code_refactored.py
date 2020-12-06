import findspark
from pyspark.sql import SparkSession
import math

class data_model:
    def __init__(self) : 
        self.data = None 
        self.metadata = None
        self.joined = None
        self.spark= SparkSession.builder \
            .master("local[*]") \
            .appName("Learning_Spark") \
            .getOrCreate()

    def load_metadata(self, filename) : 
        self.metadata = self.spark.read.csv(filename,inferSchema=True, header=True)

    def load_data_reviews(self,filename) : 
        self.data = self.spark.read.csv(filename,inferSchema=True, header=True)

    def get_avg_review_length(self) : 
        length = self.data.rdd.map(lambda x: (x[1],(len(x[4]),1))).reduceByKey(lambda x,y: (x[0] + y[0],x[1]+y[1])).map(lambda x : (x[0], x[1][0]/x[1][1])).collect()
        df = self.spark.createDataFrame(data=length, schema=["ASN", "length"])
        return df
    
    def join_df(self) : 
        if self.data==None or self.metadata==None :
            print("joined dataset not found")
            return None 
        df = self.get_avg_review_length()
        self.joined = df.join(self.metadata, df.ASN == self.metadata.asin,how='left')
    
    def get_pearson(self,col1, col2) : 
        if self.joined==None : 
            print("please load data first")
            return None 
        df = self.joined.select(col1, col2)
        avg_NA = df.rdd.map(lambda x: (0,x[0])).reduceByKey(lambda x,y: x + y).collect()[0][1]/df.count()
        avg_EU = df.rdd.map(lambda x: (1,x[1])).reduceByKey(lambda x,y: x + y).collect()[0][1]/df.count()
        NA_dev = df.rdd.map(lambda x: (0,(x[0]-avg_NA)**2)).reduceByKey(lambda x,y: x + y).collect()[0][1]
        EU_dev = df.rdd.map(lambda x: (1,(x[1]-avg_EU)**2)).reduceByKey(lambda x,y: x + y).collect()[0][1]
        NA_EU_dev = df.rdd.map(lambda x: (2,(x[0]-avg_NA)*(x[1]-avg_EU))).reduceByKey(lambda x,y: x + y).collect()[0][1]
        return NA_EU_dev/(NA_dev*EU_dev)**0.5

    def get_tfidf(self):
        data = self.data
        
        lines = data.select("asin", "reviewText").rdd
        map1 = lines.flatMap(lambda x: [((x[0],i),1) for i in x[1].split()])
        reduce = map1.reduceByKey(lambda x,y:x+y)
        tf = reduce.map(lambda x: (x[0][1],(x[0][0],x[1])))

        map3 = reduce.map(lambda x: (x[0][1],(x[0][0],x[1],1)))
        map3.collect()

        map4 = map3.map(lambda x:(x[0],x[1][2]))
        map4.collect()

        reduce2 = map4.reduceByKey(lambda x,y:x+y)
        reduce2.collect()

        num_rows = data.count()
        idf = reduce2.map(lambda x: (x[0], math.log10(num_rows/x[1])))
        idf.collect()

        rdd=tf.join(idf)
        rdd=rdd.map(lambda x: (x[1][0][0],(x[0],x[1][0][1],x[1][1],x[1][0][1]*x[1][1]))).sortByKey()
        rdd.collect()
        
        rdd=rdd.map(lambda x: (x[0],x[1][0],x[1][1],x[1][2],x[1][3]))
        rdd.saveAsTextFile("hdfs://com.avg.namenode:9000/user/TFIDF")
        #rdd.toDF(["DocumentId", "Token", "TF", "IDF", "TF-IDF"]).show()

model = data_model() 
model.load_data_reviews("reviews.csv")
model.load_metadata("metadata.csv")
model.join_df() 
pearson_score = model.get_pearson("length", "price")
print(pearson_score)
print("\n")
model.get_tfidf()

