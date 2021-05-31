const express = require("express");
const router = express.Router();
const upload = require("express-fileupload");
//Used Zips.json file directly as an Array database.
const zips = require("../../zips.json");
const auth = require("../../middleware/auth");

// @route    GET api/zips/
// @desc     Pagination, Sorting
// @access   Private, token needed
router.get("/", auth, async (req, res) => {
    //Pagination
    console.log(req.query);
    const {
        pageSize = 10,
        pageNumber = 1,
        sort = "desc",
        city,
        state,
    } = req.query;

    const paginatedResult = zips.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize
    );

    //sorting by population || default Descending order
    paginatedResult.sort(function (a, b) {
        if (sort == "desc") {
            return parseFloat(b.pop) - parseFloat(a.pop);
        }
        return parseFloat(a.pop) - parseFloat(b.pop);
    });
    res.send(paginatedResult);
});

// @route    GET api/zips/maxpop
// @desc     Returns Zip from json file with Highest Population
// @acces    Private, token needed
router.get("/maxpop", auth, async (req, res) => {
    let maxPopZip = zips[0];
    //return a ZIPS object with maximum population.
    zips.forEach((zip) => {
        if (zip.pop > maxPopZip.pop) {
            maxPopZip = zip;
        }
    });

    res.send({maxPopZip});
});

// @route    GET api/zips/search
// @desc     Returns object after searching by city,state
// @acces    Private,token needed
router.get("/search", auth, async (req, res) => {
    const {city, state} = req.query;
    console.log(city, state);
    var searchResult = zips.filter((zip, index) => {
        //Search with City and State - Combined
        if (city && state) {
            if (zip.city == city && zip.state == state) return true;
        }
        //search by city only
        else if (city) {
            if (zip.city == city) return true;
        } else if (state) {
            if (zip.state == state) return true;
        } else {
            return false;
        }
    });

    if (!searchResult.length) {
        searchResult.push({msg: "No Match Found!"});
    }
    res.send(searchResult);
});

// @route    POST api/zips/upload
// @desc     Uploads the file to server in Uploads folder.
// @acces    Private,token needed
router.post("/upload", auth, (req, res) => {
    console.log("Hit here");
    if (req.files) {
        var file = req.files.file;
        var filename = file.name;

        file.mv("./uploads/" + filename, (err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("File Uploaded");
            }
        });
    }
});

module.exports = router;
