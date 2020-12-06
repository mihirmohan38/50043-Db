from csv import reader
import datetime

WHITELIST = set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

def fix_nulls(s):
    for line in s:
        yield line.replace('\0', ' ')
    return

def clean_review_data(review_input_file_name, review_output_file_name):
    review_file_in = open(review_input_file_name, "r") 
    review_file_out = open(review_output_file_name, "w")

    review_file_out.write("reviewerID,username,email,password\n")

    # ignore first line
    review_file_in.readline()
    # ,asin,helpful,overall,reviewText,reviewTime,reviewerID,reviewerName,summary,unixReviewTime

    userSet = set()

    for line in reader(fix_nulls(review_file_in)):
        # Get next line from file 
        reviewerID = line[6]
        if not userSet.__contains__(reviewerID):
            userSet.add(reviewerID)
            reviewerName = ''.join(filter(WHITELIST.__contains__, line[7]))
            email = str(reviewerID) + "@email.com"
            password = "$2b$08$pHGuJDJT0g9430cwIjhWP.Z1.OuG.xYqdofoZ8l/BxzMjAckFOzVW"
            review_file_out.write(
                "\"" + reviewerID + "\"" + "," +
                "\"" + reviewerName +"\"" + "," +
                "\"" + email + "\"" + "," +
                "\"" + password + "\"" + "\n"
            )

            review_file_out.flush()
    

    review_file_in.close()
    review_file_out.close()
    return

if __name__ == '__main__':
    review_input_file_name = "./kindle_reviews.csv"
    review_output_file_name = "user_full.csv"
    clean_review_data(review_input_file_name, review_output_file_name)
