
exports.aggregate = (async (req, res, next) => {
    if (!req.query.url || !req.query.source_name) {
        return res.status(406).json({
            "response_code": 406,
            "error": {
                messsage: "Pass mandatory fields url and source_name"
            }
        });
    }

    let valid_sources = ["yelp", "facebook", "glassdoor"];

    if (valid_sources.indexOf(req.query.source_name) == -1) {
        return res.status(406).json({
            "response_code": 406,
            "error": {
                messsage: "Invalid source name"
            }
        });

    };

    // here we can call an API or fetch data from database query. For now, I have send sample response

    let sampleResponse = {
        review_count: 2,
        aggregated_reviews: [
            {
                "rating": 4,
                "review_date": "2023-06-07",
                "comment": "What is our primary use case? I mainly use Azure for data analytics and implementation.",
                "reviewer_name": "Associate"
            },
            {
                "reviewer_name": "reviewer1786524",
                "review_date": "2022-02-22",
                "rating": 5,
                "comment": "Microsoft Azure has hundred of services that they offer on the platform."
            }
        ],
        review_aggregated_count: 2,

        response_code: 200
    }
    if(req.query.filter_date){
        let result = sampleResponse.aggregated_reviews.filter(d => {
            var time = new Date(req.query.filter_date).getTime();
            return ( new Date(d.review_date).getTime() >= time);
        });
        sampleResponse.aggregated_reviews = result;
        sampleResponse.review_count = result.length;
        sampleResponse.review_aggregated_count = result.length;

    }
    res.status(200).json(sampleResponse);
});

