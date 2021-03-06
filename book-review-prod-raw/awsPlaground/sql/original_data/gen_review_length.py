from csv import reader
import datetime

def fix_nulls(s):
    for line in s:
        yield line.replace('\0', ' ')
    return

def clean_review_data(review_input_file_name, review_output_file_name):
    review_file_in = open(review_input_file_name, "r") 
    review_file_out = open(review_output_file_name, "w")

    review_file_out.write("id,asin,reviewLength,reviewText\n")

    # ignore first line
    review_file_in.readline()

    for line in reader(fix_nulls(review_file_in)):
    
        # Get next line from file 
        reviewId = line[0]
        asin = line[1]
        reviewLength = len(line[4])
        reviewText = line[4]
        review_file_out.write(
            str(reviewId) + "," +
            "\"" + "=" + asin + "\"" +  "," +
            "\"" + "=" + str(reviewLength) + "\"" + "," +
            "\"" + "=" + reviewText + "\"" + "\n"
        )

        review_file_out.flush()
    

    review_file_in.close()
    review_file_out.close()
    return

if __name__ == '__main__':
    review_input_file_name = "./kindle_reviews.csv"
    review_output_file_name = "review_length_count.csv"
    clean_review_data(review_input_file_name, review_output_file_name)
