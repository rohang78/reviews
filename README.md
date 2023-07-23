Steps to install the project on local system and run it.
1. Make sure node js and git is installed on system.
2. Clone this repository using command "git clone git@github.com:rohang78/reviews.git"
3. Run the command where project is installed using "npm install".
4. Now, open postman.
5. Import the CURL request on postman to test the API.
   curl -XGET 'http://localhost:8080/reviews/aggregate?source_name=yelp&url=https://www.yelp.com/biz/naturally-delicious&filter_date=2022-01-01'
