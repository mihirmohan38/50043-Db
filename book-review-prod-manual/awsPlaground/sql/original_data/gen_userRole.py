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

    review_file_out.write("roleId,reviewerID,createdAt,updatedAt\n")

    # ignore first line
    review_file_in.readline()

    userSet = set()

    for line in reader(fix_nulls(review_file_in)):
        # Get next line from file 
        reviewerID = line[6]
        roleId = 1
        createdAt = "NULL"
        updatedAt = "NULL"
        if not userSet.__contains__(reviewerID):
            userSet.add(reviewerID)
            review_file_out.write(
                str(roleId) + "," +
                "\"" + reviewerID +"\"" + "," +
                createdAt + "," +
                updatedAt + "\n"
            )

            review_file_out.flush()
    
    review_file_in.close()
    review_file_out.close()
    return

if __name__ == '__main__':
    review_input_file_name = "./kindle_reviews.csv"
    review_output_file_name = "user_role_full.csv"
    clean_review_data(review_input_file_name, review_output_file_name)
