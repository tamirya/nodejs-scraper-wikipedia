const axios = require("axios");
const HELPER = require('../helper/utils');

exports.scraper = (req, res) => {
    const url = "https://en.wikipedia.org/wiki/List_of_animal_names";

    axios
        .get(url)
        .then(async response => {
            const data = await HELPER.getData(response.data);
            res.json(data);
        })
        .catch(error => {
            console.log(error);
        });
};