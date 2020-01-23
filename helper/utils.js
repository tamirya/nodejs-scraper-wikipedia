const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');

exports.download_image = (url, image_path)=>{
    axios({
        url,
        responseType: 'stream',
    }).then(
        response =>
            new Promise((resolve, reject) => {
                response.data
                    .pipe(fs.createWriteStream(image_path))
                    .on('finish', () => resolve())
                    .on('error', e => reject(e));
            })
    )
};

exports.saveAnimalImage = (url, fileName, localPath = './tmp/')=>{
    this.download_image(url, localPath + fileName + '.jpg');
};

exports.getData = (html)=>{
    return new Promise(
        async (resolve, reject) => {
            const data = [];
            const $ = cheerio.load(html);
            const tbl = $($("table.wikitable tbody")[1]).find('tr');

            for (let i = 0; i < tbl.length; i++) {
                if (i !== 0 && i !== 1) {
                    const elem = tbl[i];
                    const animal = $(elem).children().eq(0).text();
                    const collateralAdjective = $(elem).children().eq(5).text();
                    let animalPage = $(elem).children().eq(0).find('a').attr('href');

                    if (animalPage) {
                        animalPage = 'https://en.wikipedia.org/' + animalPage;
                        this.getAnimalImage(animalPage, animal);
                    }

                    data.push(
                        {
                            animal,
                            collateralAdjective,
                            animalPage,
                            animalImgPath: `tmp/${animal}.jpg`
                        }
                    );
                }
            }
            resolve(data);
        }
    );
};

exports.getAnimalImage  = (url, animalName)=>{
    axios
        .get(url)
        .then(response => {
            const $ = cheerio.load(response.data);
            const imgUrl = $($('table.biota tr td').children()[0]).find('img').attr('src')
            if (imgUrl) {
                this.saveAnimalImage('https://' + imgUrl.substring(2), animalName.trim().replace('/', ''));
            }
        })
        .catch(error => {
            console.log(error);
        });
};