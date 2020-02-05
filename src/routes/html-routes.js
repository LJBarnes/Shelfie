// eslint-disable-next-line no-undef
// var path = require('path');
const db = require('../models');


module.exports=function(app){

    // this route needs to go to signup/sign in page
    app.get('/', (req,res) => {
        res.render('index');
    });

    //this route needs to go to shelf page
    app.get('/home/:id',(req, res) =>{
        db.Books.findAll({
            subQuery: false,
            attributes: ['id', 'book_title', 'book_id', 'book_shelf'],
            where: {
                UserId: req.params.id
            }
        }).then(function(data) {
            
            let cur = [];
            let unr = [];
            let read = [];
            data.forEach(obj => {
                switch (obj.book_shelf) {
                case 'Current': cur.push(obj);
                    break;
                case 'Read': read.push(obj);
                    break;
                case 'Unread': unr.push(obj);
                    break;
                }
            });
            let hbsBooks = {
                Current: cur,
                Read: read,
                Unread: unr
            };
            res.render('home', hbsBooks);
        });
    });

};

